<?php E_STRICT;

require_once(__FILE_ROOT__ . '/php/classes/app.php');
require_once(__FILE_ROOT__ . '/php/traits/jsmsgdisplay.php');
require_once(__FILE_ROOT__ . '/php/enums/pagetypes.php');
require_once(__FILE_ROOT__ . '/php/audit/log.php');
require_once(__FILE_ROOT__ . '/php/secure/validateUser.php');

class MPASIS_App extends App
{
    use JsMsgDisplay;
    private $jsTailScripts = '';
    private $jsTailScriptCount = 0;


    public function __construct()
    {
        $this->setName("Merit Promotion and Selection Information System");
        $this->setDynamic(true);
        
        require_once(__FILE_ROOT__ . '/php/secure/dbcreds.php');

        $this->addDBConn(new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $ismdbname));
        require_once(__FILE_ROOT__ . '/sergs/php/db-ddl.php');
        $this->addDBConn(new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $dbname, $ddl));
    }

    protected function getDB_ISCreAMS()
    {
        return $this->getDBConn(0);
    }

    protected function getDB_SDO()
    {
        return $this->getDBConn(1);
    }

    public function run()
    {
        $requiresSignIn = true;
        $pageTitle = $this->getName() . ' | Department of Education | Sto. Tomas City SDO';
        $pageType = PageType::MPASIS;
        // $addDebug = false;
        $addDebug = true;
?>
<!DOCTYPE html>
<html lang="en">
<?php require_once(__FILE_ROOT__ . '/php/snippets/html_head.php');?>
<body>
    <div id="mpasis" class="app">
<?php
if (isValidUserSession())
{
    if (isset($_REQUEST['a']) && $_REQUEST['a'] == 'logout' || !isset($_COOKIE['user']))
    {
        $redirectToLogin = true;
        require_once(__FILE_ROOT__ . '/php/secure/process_signout.php');
    }
    // elseif (isset($_COOKIE['user']))
    // {
    //     setcookie('user', $_POST['unm'], time() + 50, '/'); // EXPIRE IN 500 SECONDS
    // }
}
else
{
                // echo('NO USER<br>');
                ?>
<!DOCTYPE html>
<html>
<head>
<title>SDO Sto. Tomas City | Online Services</title>
<style>
@keyframes logospin {
    0% {transform: rotateY(0deg)};
    12.5% {transform: rotateY(45deg)};
    25% {transform: rotateY(90deg)};
    37.5% {transform: rotateY(135deg)};
    50% {transform: rotateY(180deg)};
    62.5% {transform: rotateY(225deg)};
    75% {transform: rotateY(270deg)};
    87.5% {transform: rotateY(315deg)};
    100% {transform: rotateY(0deg)};
}

.no-user-scrim {
    position: fixed;
    top: 0.5em;
    bottom: 0.5em;
    left: 0.5em;
    right: 0.5em;
    background-color: navy;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
}

.sdo-logo {
    background-image: url('/images/logo-depedstotomas.webp');
    background-size: contain;
    width: 80%;
    height: 80%;
    background-repeat: no-repeat;
    background-position: center;
    animation: logospin 4s infinite linear;
    transform: rotateY(360deg);
}
</style>
</head>
<body><div class="no-user-scrim"><div class="sdo-logo"></div></div></body>
</html>
                <?php

    if ($requiresSignIn)
    {
        // header('Location: /login?app=mpasis&src=' . $_SERVER['PHP_SELF']);
        ?><script>window.location.replace("<?php echo('/login?app=mpasis&src=' . $_SERVER['PHP_SELF']); ?>");</script><?php
    }
}

require_once(__FILE_ROOT__ . '/php/snippets/header_full.php'); // general header
require_once(__FILE_ROOT__ . '/php/snippets/nav_full.php'); // general nav

?>
    <main>
        <section id="main-dashboard">
            <h2>Dashboard</h2>
            
            <h3>Summary</h3>
            <ul>
                <li><b>Available Positions:</b> <?php echo count($this->getDB_SDO()->select('Position', '*', 'WHERE filled=FALSE')); ?></li>
                <li><b>Applications Entered:</b> <?php echo count($this->getDB_SDO()->select('Job_Application', '*', ''));?></li>
                <li><b>Unique Applicants:</b> <?php echo count($this->getDB_SDO()->executeQuery('SELECT Person.personId FROM Job_Application INNER JOIN Person ON Job_Application.personId=Person.personId GROUP BY personId'));?></li>
            </ul>

            <h3>Applications</h3>
            <ul>
                <li><b>Shortlisted Applications:</b> 0</li>
                <li><b>Disqualified Applications:</b> 0</li>
                <li><b>Applications Under Processing:</b> 0</li>
            </ul>
        </section>
    </main>
<?php
require_once(__FILE_ROOT__ . '/php/snippets/footer_full.php');        
require_once(__FILE_ROOT__ . '/php/snippets/html_tail.php');
?>
    </div>
</body>
<script src="/mpasis/js/mpasisApp.js"></script>
</html>
<?php
    } // function run()
}
?>