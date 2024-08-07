<?php E_STRICT;

require_once(__FILE_ROOT__ . '/php/classes/app.php');
require_once(__FILE_ROOT__ . '/php/traits/jsmsgdisplay.php');

class QSys_App extends App
{
    use JsMsgDisplay;

    private $username;
    private $tokenId;

    public function __construct()
    {
        $this->setName('Queuing System');
        $this->setDynamic(true);

        require_once(__FILE_ROOT__ . '/php/secure/dbcreds.php');

        // $this->addDBConn(new DatabaseConnection($dbtype, $servername, 'root', '', 'SDO_QSys'));

        $this->setupEnums();
    }

    public function run(string $pageId = 'dashboard')
    {
        if ($pageId !== 'login' && $pageId !== 'queue_screen')
        {
            try
            {
                $this->validateSession();
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

    /* Account Management Functions */
    private function createUser(string $username, string $password) // throw exception on any error
    {}

    private function isValidCredentials(string $username, string $password) : bool
    {
        return false;
    }

    private function deleteUser(string $username) : bool
    {
        return false;
    }

    /* User Session Management Functions */
    private function enterSession(string $username, string $password) // throw exception on any error or upon failing authentication
    {}

    private function reenterSession() // throw exception on any error or upon failing authentication
    {}

    private function validateSession() // throw exception on any error
    {}

    private function generateTokenId()
    {
        // generate token Id using username, password hash, and login timestamp or using random string generator
        // store timestamp and token Id in the DB
        
        return $this->retrieveTokenId();
    }

    private function retrieveTokenId() // will also be called by validateSession() for checking login session
    {
        // retrieve token Id from DB
        return '';
    }

    private function validateTokenId(string $tokenId) // throw exception on any error
    {}

    /* Redirects */
    private function redirectToLogin()
    {
        $this->redirect(__BASE__ . '/qsys/login?redir=' . $_SERVER['PHP_SELF']);
    }

    private function redirectToDashboard()
    {
        $this->redirect(__BASE__ . '/qsys/dashboard/');
    }

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
}

?>