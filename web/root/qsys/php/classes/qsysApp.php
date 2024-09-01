<?php E_STRICT;

require_once(__FILE_ROOT__ . '/php/classes/app.php');
require_once(__FILE_ROOT__ . '/php/traits/jsmsgdisplay.php');

class QSys_App extends App
{
    use JsMsgDisplay;

    private string $username = '';
    private string $userSessionId = ''; // not to be confused with a PHP session Id
    private string $token = '';
    private ?DateTime $sessionTimeStamp = null;
    private ?DateInterval $maxSessionDuration = null; // NULL means no expiration for user sessions
    private int $sessionIdLength = 16;
    private int $tokenLength = 64;

    public function __construct()
    {
        $this->setName('Queuing System');
        $this->setDynamic(true);

        require_once(__FILE_ROOT__ . '/php/secure/dbcreds.php');

        $this->addDBConn(new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, 'SDO_QSys'));

        $this->maxSessionDuration = new DateInterval('PT15M'); // set a default of 15-minute session expiration

        $this->setupEnums();
    }

    public function run(string $pageId = 'dashboard')
    {
        if ($pageId !== 'login' && $pageId !== 'queue_screen')
        {
            try
            {
                // $this->validateSession();
            }
            catch (Exception $ex)
            {
                $this->redirectToLogin();
            }
        }

        switch ($pageId)
        {
            case 'login':
                $this->generateLoginUI();
                break;
            case 'dashboard':
                $this->generateDashboardUI();
                break;
            case 'qmgr':
                $this->generateQueueManagerUI();
                break;
            case 'qscreen':
                $this->generateQueueScreenUI();
                break;
            case 'landing':
            default:
                $this->redirectToDashboard();
                break;
        }
    }

    private function setupEnums()
    {}

    private function isFirstRun() : bool
    {
        $db = $this->getDBConn(0);
        $dbTable = 'QSYS_User';
        $dbResults = [];

        try
        {
            $dbResults = $db->select($dbTable, '*');

            if (!is_null($db->lastException))
            {
                throw new Exception($this->sqlExceptionMsg('Error in querying database.', $db->lastException));
            }
            else if (is_null($dbResults) || count($dbResults) === 0)
            {
                return true;
            }
        }
        catch (Exception $ex)
        {}

        return false;
    }

    /* Account Management Functions */
    private function createUser(string $username, string $password, string $position, string $department, string $givenName, string $middleName = null, string $familyName = null, string $spouseName = null, string $extName = null, ?DateTime $expiration = null) // throw exception on any error
    {
        $db = $this->getDBConn(0);
        $dbTable = 'QSYS_User';
        $dbResults = [];

        // check if username exists
        try
        {
            $dbResults = $this->retrieveUser($username);

            if (count($dbResults) === 0)
            {
                // add new user to database
                $passwordHash = $this->hashString($password);
                $dbResults = $db->insert($dbTable, '(username, password, $expiration)', "(\"$username\", \"$passwordHash\", " . (is_null($expiration) ? 'NULL' : "\"$expiration\"") . ")");
                if (!is_null($db->lastException))
                {
                    throw new Exception($this->sqlExceptionMsg('User creation failed.', $db->lastException));
                }
            }
            else
            {
                throw new Exception('User already exists.');
            }
        }
        catch (Exception $ex)
        {
            throw $ex;
        }
    }

    private function retrieveUser(string $username) : array
    {
        $db = $this->getDBConn(0);
        $dbTable = 'QSYS_User';
        $dbResults = $db->select($dbTable, '*', "WHERE username = \"$username\"");

        if (!is_null($db->lastException))
        {
            throw new Exception($this->sqlExceptionMsg('Error encountered while retrieving user data.', $db->lastException));
        }

        return $dbResults;
    }

    private function isValidCredentials(string $username, string $password) : bool
    {
        $dbResults = [];

        try
        {
            $dbResults = $this->retrieveUser($username);

            if (count($dbResults) === 0)
            {
                return false;
            }
            else
            {
                return $this->verifyHash($password, $dbResults[0]['password']);
            }
        }
        catch (Exception $ex)
        {
            throw $ex;
        }

        return false;
    }

    private function isPasswordExpired(string $username) : bool
    {
        $dbResults = [];

        try
        {
            $dbResults = $this->retrieveUser($username);

            if (count($dbResults) === 0)
            {
                throw new Exception('User does not exist.');
            }
            else
            {
                return !is_null($dbResults[0]['expiration']) && (new DateTime()) > $dbResults[0]['expiration'];
            }
        }
        catch (Exception $ex)
        {
            throw $ex;
        }

        return true;
    }

    private function deleteUser(string $username) // throw exception on any error
    {
        if ($username === $this->username)
        {
            throw new Exception('Cannot delete current user.');
        }

        $db = $this->getDBConn(0);
        $dbTable = 'QSYS_User';

        try
        {
            $db->delete($dbTable, "username = \"$username\"");

            if (!is_null($db->lastException))
            {
                throw new Exception($this->sqlExceptionMsg("Error encoutered while deleting user \"$username\"", $db->lastException));
            }
        }
        catch (Exception $ex)
        {
            throw $ex;
        }
    }

    private function hashString(string $str) : string // hashing algorithm or method may be changed
    {
        try
        {
            return password_hash($str, PASSWORD_BCRYPT_DEFAULT_COST);
        }
        catch (Exception $ex)
        {
            throw $ex;
            return '';
        }
    }

    private function verifyHash(string $str, $strHash) : bool // hashing algorithm or method may be changed
    {
        try
        {
            return password_verify($str, $strHash);
        }
        catch (Exception $ex)
        {
            throw $ex;
            return false;
        }
    }

    /* User Session Management Functions */
    private function enterSession(string $username, string $password, DateTime $validationTimestamp) // throw exception on any error or upon failing authentication
    {
        $db = $this->getDBConn(0);
        $dbTable = 'QSYS_Session';
        $user = [];

        try
        {
            $users = $this->retrieveUser($username);

            if (is_array($users) && count($users) === 0)
            {
                throw new Exception('User not found.');
            }
            
            $user = $users[0];

            if (!$this->verifyHash($password, $user['password']))
            {
                throw new Exception('Invalid credentials.');
            }

            if (!is_null($user['expiration']) && (new DateTime()) > $user['expiration'])
            {
                throw new Exception('Expired password.');
            }

            $this->cleanupSessions($username);

            $sessionId = $this->generateSessionId();
            $token = $this->generateSecureToken();
            $expiration = (is_null($this->maxSessionDuration) ? 'NULL' : '"' . $validationTimestamp->add($this->maxSessionDuration) . '"');

            $db->insert($dbTable, 'username, sessionId, token, expiration', "(\"$username\", \"$sessionId\", \"$token\", $expiration)");

            $this->username = $username;
            $this->userSessionId = $sessionId;
            $this->token = $token;
            $this->sessionTimeStamp = $validationTimestamp;
        }
        catch (Exception $ex)
        {
            throw $ex;
        }
    }

    private function reenterSession(string $username, string $userSessionId, string $secureToken, DateTime $validationTimestamp) // throw exception on any error or upon failing authentication
    {
        $db = $this->getDBConn(0);
        $dbTable = 'QSYS_Session';
        $session = null;

        try
        {
            $sessions = $db->select($dbTable, '*', "WHERE username = \"$username\" AND sessionId = \"$userSessionId\"");

            if (!is_null($db->lastException))
            {
                throw new Exception($this->sqlExceptionMsg('Error encountered while reentering user session.', $db->lastException));
            }

            if (is_array($sessions) && count($sessions) === 0)
            {
                throw new Exception('Session not found.');
            }

            $session = $sessions[0];

            if (!$this->verifyHash($secureToken, $this->hashString($session['token'])))
            {
                throw new Exception('Session is invalid.');
            }

            if (!is_null($this->maxSessionDuration) && (is_null($session['expiration']) || $validationTimestamp->add($this->maxSessionDuration) !== $session['expiration'] || $session['expiration'] < (new DateTime())))
            {
                throw new Exception('Session is expired.');
            }
        }
        catch (Exception $ex)
        {
            throw $ex;
        }
    }

    private function cleanupSessions(string $username) // throw exception on any error
    {
        $db = $this->getDBConn(0);
        $dbTable = 'QSYS_Session';
        
        try
        {
            $db->delete($dbTable, "username = \"$username\" AND expiration < \"" . (new DateTime()) . "\"");

            if (!is_null($db->lastException))
            {
                throw new Exception($this->sqlExceptionMsg("Error encountered while cleaning up sessions for user \"$username\".", $db->lastException));
            }
        }
        catch (Exception $ex)
        {
            throw $ex;
        }
    }

    private function generateSessionId() : string // throw exception on any error
    {
        return bin2hex(random_bytes($this->sessionIdLength / 2));
    }

    private function generateSecureToken() : string // throw exception on any error
    {        
        return bin2hex(random_bytes($this->tokenLength / 2));
    }

    /* API */
    public function runAPI()
    {
        if (isset($_POST) && count($_POST) > 0 && (!isset($_POST['api-tester']) || $_POST['api-tester'] !== 'api-tester'))
        {
            $this->processRequest($_POST, 'POST');
        }
        else if (isset($_GET) && count($_GET) > 0 && (!isset($_GET['api-tester']) || $_GET['api-tester'] !== 'api-tester'))
        {
            $this->processRequest($_GET, 'GET');
        }
        else if (isset($_REQUEST) && count($_REQUEST) > 0 && (!isset($_REQUEST['api-tester']) || $_REQUEST['api-tester'] !== 'api-tester'))
        {
            $this->processRequest($_REQUEST, 'REQUEST');
        }
        else
        {
            $this->generateAPITesterUI();
        }
    }

    private function processRequest($request, $method = 'INTERNAL') : array
    {
        $response = [];
        if (isset($request['a']))
        {
            switch ($request['a'])
            {
                case 'login':
                    $response = $this->sendResponse('Info', 'Login requested.', ($method !== 'INTERNAL'));
                    break;
                case 'logout':
                    $response = $this->sendResponse('Info', 'Logout requested.', ($method !== 'INTERNAL'));
                    break;
                default:
                    $response = $this->sendResponse('Error', 'Unknown action requested.', ($method !== 'INTERNAL'));
                    break;
            }
        }

        return $response;
    }

    /**  
     * Returns an associative array and optionally echoes its JSON equivalent
     * 
     * @param string $type Includes any of the following: "Success", "Info", "Error", "Text", "Username", "JSON", "DataRows", "DataRow", "User", "Entries", "Entry", "UI"
     * @param mixed $content Any type of content. May be a primitive, a regular array, or an associative array.
     * @param bool $send Instructs function to echo the contents of the response.
     */
    private function sendResponse(string $type, mixed $content, bool $send = true) : array // 
    {
        $response = [
            'type'=>$type,
            'content'=>$content
        ];

        if ($send)
        {
            header('Content-Type: application/json');
            echo(json_encode($response));
        }

        return $response;
    }

    /* Redirects */
    private function jsRedirect($url)
    { ?>
<script>
window.location.replace("<?php echo($url); ?>");
</script><?php 
    }

    private function redirect($url) // will only work if no other headers precede this call
    {
        header('Location: ' . $url);
    }

    private function redirectToLogin()
    {
        $this->redirect(__BASE__ . '/qsys/login?redir=' . $_SERVER['PHP_SELF']);
    }

    private function redirectToDashboard()
    {
        $this->redirect(__BASE__ . '/qsys/dashboard/');
    }

    /* UI */
    private function generateDashboardUI()
    { 
        $this->htmlHead('Dashboard');
        $this->htmlHeaderMain('Dashboard');
        $this->htmlNav(); ?>

        <?php $this->htmlFooter(); 
        $this->htmlTail();
    }

    private function generateQueueManagerUI()
    { 
        $this->htmlHead('Queue Manager');
        $this->htmlHeaderMain('Queue Manager');
        $this->htmlNav(); ?>

        <?php $this->htmlFooter(); 
        $this->htmlTail();
    }

    private function generateQueueScreenUI()
    { 
        $this->htmlHead('Queue Screen'); ?>

    <header>
        <span class="institutional-logo-container"><img class="institutional-logo" src="<?php echo(__BASE__ . '/images/logo-depedstotomas.webp'); ?>" alt="SDO Logo" <?php // TEMP ?>style="max-width: 1.5in;"<?php // TEMP ?> /></span>
        <h1>Now Serving</h1>
        <div id="now-serving-display">
            <a href="?queue=test01" class="queue"><span class="queue-name">Test01</span> <span class="queue-serve">1</span></a>
            <a href="?queue=test02" class="queue"><span class="queue-name">Test02</span> <span class="queue-serve">2</span></a>
        </div>
        <a id="link-home" href="<?php echo(__BASE__ . '/qsys'); ?>"><span class="qsys-temp-logo">Q<i>S</i><i>y</i><i>s</i></span> <span class="material-icons-round">home</span></a>
    </header>

    <main>
        <section id="regular-clients-queue-display">
            <h2>Regular</h2>
        </section>
        <section id="priority-clients-queue-display">
            <h2>Priority</h2>
        </section>
        <section id="ad-content-display">
            <h2>SDO News and Updates</h2>
            <div id="ad-content">
                carousel
            </div>
        </section>
        <section id="clients-remaining-counter">1</section>
        <section id="date-time-display"><?php echo(date_format(date_create('now', timezone_open('Asia/Manila')), 'l, F j, Y, h:i A')); ?></section>
    </main>

        <?php $this->htmlTail();
    }

    private function generateLoginUI()
    { 
        $this->htmlHead('Sign In'); ?>
<main id="login">
    <span class="institutional-logo-container"><img class="institutional-logo" src="<?php echo(__BASE__ . '/images/logo-depedstotomas.webp'); ?>" alt="SDO Logo" <?php // TEMP ?>style="max-width: 3in;"<?php // TEMP ?> /></span>
    <form id="login-form" name="login-form" method="post">
        <h1><span class="qsys-temp-logo">Q<i>S</i><i>y</i><i>s</i></span> Login</h1>
        <div class="textbox-ex"><label for="usr">Username</label> <input id="usr" name="usr" type="text" placeholder="Username" required autofocus></div>
        <div class="textbox-ex"><label for="pw">Password</label> <input id="pw" name="pw" type="password" placeholder="Password" required></div>
        <div class="checkbox-ex"><input id="remember-user" name="remember-user" type="checkbox"> <label for="remember-user">Remember me</label></div>
        <div class="button-group-ex">
            <span class="button-ex"><button id="sign-in" name="sign-in" type="submit">Sign In</button></span>
            <span class="button-ex"><button id="redir" name="redir" form="redir-qscreen" value="<?php echo($_SERVER['PHP_SELF']); ?>">Queue Screen</button></span>
        </div>
        <div class="login-error-msg"><?php 
            if (isset($_POST) && isset($_POST['sign-in']) && !$this->isValidCredentials($_POST['usr'], $_POST['pw']))
            {
                var_dump($_POST);
            } 
        ?></div>
    </form>
    <form id="redir-qscreen" name="redir-qscreen" action="<?php echo(__BASE__); ?>/qsys/queue" method="get"></form>
</main><?php $this->htmlTail();
    }

    private function generateAPITesterUI()
    {
        $this->htmlHead('API Tester');
?>
<h1>QSys API Tester</h1>
<table id="params-table" border="1">
<caption style="font-weight: bold; text-transform: uppercase;">Parameters Table</caption>
<thead>
<tr>
<th><label for="param-name">Parameter</label></th>
<th>Value</th>
</tr>
</thead>
<tbody id="params">
<tr>
<td colspan="2">Nothing to show</td>
</tr>
</tbody>
<tfoot>
<tr>
<td colspan="2" style="text-align: center;">
<button id="button-add-param" type="button">Add Parameter</button> <button id="button-get" form="form-data" formmethod="get" type="submit">GET</button> <button id="button-post" form="form-data" formmethod="post" type="submit">POST</button>
</td>
</tr>
</tfoot>
</table>
<form id="form-data" name="form-data" action="<?php echo($_SERVER['PHP_SELF']); ?>">
<input type="hidden" name="api-tester" value="api-tester">
</form><?php 
        if (isset($_REQUEST) && count($_REQUEST) > 0)
        { ?>
<br>
<table id="responses-table" border="1">
<caption style="font-weight: bold; text-transform: uppercase;">Requests and Responses Table</caption>
<thead>
<tr>
<th>Parameter</th>
<th>Value</th>
<th>Type</th>
</tr>
</thead>
<tbody><?php
            foreach (['GET'=>$_GET, 'POST'=>$_POST, 'RESPONSE-GET'=>$this->processRequest($_GET, 'INTERNAL'), 'RESPONSE-POST'=>$this->processRequest($_POST, 'INTERNAL')] as $method => $data)
            {
                if (is_array($data) || is_object($data))
                {
                    foreach ($data as $key => $value)
                    { ?>
<tr>
<td><?php echo($key); ?></td>
<td><?php if (is_array($value)) var_dump($value); else echo($value); ?></td>
<td><?php echo($method); ?></td>
</tr>
<?php
                    }
                }
            }
?>
</tbody>
</table>
<?php
        }
?>
<script src="<?PHP echo(__BASE__); ?>/js/elements.js"></script>
<script>
let paramsContainer = document.getElementById("params");
let buttonAdd = document.getElementById("button-add-param");
let buttonGet = document.getElementById("button-get");
let buttonPost = document.getElementById("button-post");
let formData = document.getElementById("form-data");

paramsContainer.params = [];

buttonAdd.addEventListener("click", clickEvent=>{
    let i = (new Date()).valueOf();
    if (Object.keys(paramsContainer.params).length === 0)
    {
        paramsContainer.innerHTML = "";
    }
    let tr = ElementEx.create("tr", ElementEx.NO_NS, paramsContainer);
    let td = [
        ElementEx.create("td", ElementEx.NO_NS, tr),
        ElementEx.create("td", ElementEx.NO_NS, tr)
    ];
    let param = {
        name:ElementEx.create("input", ElementEx.NO_NS, td[0], null, "type", "text", "name", "param-name[]", "placeholder", "Parameter name#" + i),
        value:ElementEx.create("input", ElementEx.NO_NS, td[1], null, "type", "text", "name", "param-value[]", "placeholder", "Parameter value#" + i),
        hidden:ElementEx.create("input", ElementEx.NO_NS, formData, null, "type", "hidden", "name", "name" + i, "value", "value" + i)
    };

    param.name.addEventListener("change", changeEvent=>{
        param.hidden.name = param.name.value;
    });

    param.value.addEventListener("change", changeEvent=>{
        param.hidden.value = param.value.value;
    });

    let deleteButton = ElementEx.create("button", ElementEx.NO_NS, td[1], null, "type", "button", "style", "margin: 0; padding: 0; vertical-align: top; display: inline-flex; width: 1.5em; height: 1.5em; justify-content: center; align-items: center; border-radius: 50%; background-color: #FF5555;");
    ElementEx.addText("close", ElementEx.create("span", ElementEx.NO_NS, deleteButton, null, "class", "material-icons-round", "style", "margin: 0; padding: 0; line-height: 1.2; font-size: inherit;"));
    paramsContainer.params["param" + i] = param;

    console.log(paramsContainer.params);
    deleteButton.addEventListener("click", clickDeleteEvent=>{
        delete paramsContainer.params["param" + i];
        param.hidden.remove();
        tr.remove();
    });


});
</script>
<?php
        $this->htmlTail();        
    }

    private function htmlHead($subtitle = NULL)
    { ?><!DOCTYPE html>
<html lang="en-PH">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<title><?php echo(is_null($subtitle) ? $this->getName() : 'QSys | ' . $subtitle);?></title>
<!-- FAVICON START -->
<link rel="apple-touch-icon" sizes="180x180" href="<?php echo(__BASE__); ?>/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="<?php echo(__BASE__); ?>/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="<?php echo(__BASE__); ?>/favicon-16x16.png">
<link rel="manifest" href="<?php echo(__BASE__); ?>/site.webmanifest">
<!-- FAVICON END -->
<script src="<?php echo(__BASE__); ?>/js/classes/UIEx.js"></script>
<link href="<?php echo(__BASE__); ?>/styles/UIEx.css" rel="stylesheet" />
<link href="<?php echo(__BASE__); ?>/styles/material.io/material-icons.css" rel="stylesheet">
</head>
<body>
<div class="app qsys<?php echo((isset($subtitle) && !is_null($subtitle) && trim($subtitle) !== '' ? ' ' . strtolower(str_replace(' ', '-', $subtitle)) : '') . (isset($_REQUEST['queue']) ? ' ' . strtolower(str_replace(' ', '-', $_REQUEST['queue'])) : '')); ?>">
<?php
    }

    private function htmlHeaderMain($pageTitle = NULL)
    { ?>
    <header>
        <span class="institutional-logo-container"><img class="institutional-logo" src="<?php echo(__BASE__ . '/images/logo-depedstotomas.webp'); ?>" alt="SDO Logo" <?php // TEMP ?>style="max-width: 1in;"<?php // TEMP ?> /></span>
        <h1><span class="qsys-temp-logo">Q<i>S</i><i>y</i><i>s</i></span></h1>
        <h2><?php echo($pageTitle); ?></h2>
        <span class="button-ex"><button id="nav-button" name="nav-button" type="button">=</button></span>
    </header><?php
    }

    private function htmlNav()
    { ?>

    <nav>
        <ul>
            <li><a href="<?php echo(__BASE__); ?>/qsys/dashboard">Dashboard</a></li>
            <li><a href="<?php echo(__BASE__); ?>/qsys/queue">Queue Screen</a></li>
            <li><a href="<?php echo(__BASE__); ?>/qsys/qmgr">Queue Manager</a></li>
            <!--li><a href="<?php echo(__BASE__); ?>/qsys/qmgr">Ad/Content Manager</a></li>
            <li><a href="<?php echo(__BASE__); ?>/qsys/qmgr">Settings</a></li>
            <li><a href="<?php echo(__BASE__); ?>/qsys/qmgr">Help</a></li-->
        </ul>
    </nav><?php
    }

    private function htmlFooter()
    { ?>

    <footer>
        <p>&copy; 2024 DepEd Sto. Tomas City</p>
    </footer><?php
    }

    private function htmlTail()
    { ?>

</div>
</body>
</html>
<?php
    }

    private function sqlExceptionMsg(string $errMsg, ?Exception $dbException = null)
    {
        return $errMsg . (is_null($dbException) ? '' : '<span class="sql-error">' . $dbException->getMessage() . '</span>');
    }
}

?>