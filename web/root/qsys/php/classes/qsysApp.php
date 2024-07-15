<?php E_STRICT;

require_once(__FILE_ROOT__ . '/php/classes/app.php');
require_once(__FILE_ROOT__ . '/php/traits/jsmsgdisplay.php');

class QSys_App extends App
{
    use JsMsgDisplay;

    public function __construct()
    {
        $this->setName('Queuing System');
        $this->setDynamic(true);

        require_once(__FILE_ROOT__ . '/php/secure/dbcreds.php');

        $this->addDBConn(new DatabaseConnection($dbtype, $servername, 'root', '', 'SDO_QSys'));

        $this->setupEnums();
    }

    public function run($pageId = 'dashboard')
    {
        if ($pageId !== 'login' && $pageId !== 'queue_screen')
        {
            if (!$this->isValidLogin())
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

    private function isValidLogin()
    {
        return true;
    }

    private function redirectToLogin()
    {
        $this->jsRedirect(__BASE__ . '/qsys/login?src=' . $_SERVER['PHP_SELF']);
    }

    private function redirectToDashboard()
    {
        $this->jsRedirect(__BASE__ . '/qsys/dashboard/');
    }

    private function setupEnums()
    {}

    private function generateDashboardUI()
    { 
        $this->htmlHead('Dashboard'); ?>

        <?php $this->htmlTail();
    }

    private function generateQueueManagerUI()
    { 
        $this->htmlHead('Queue Manager'); ?>

        <?php $this->htmlTail();
    }

    private function generateQueueScreenUI()
    { 
        $this->htmlHead('Queue Screen'); ?>

        <?php $this->htmlTail();
    }

    private function generateLoginUI()
    { 
        $this->htmlHead('Sign In'); ?>
<section class="login">
    <span class="institutional-logo-container"><img class="institutional-logo" src="<?php echo(__BASE__ . '/images/logo-depedstotomas.webp'); ?>" alt="SDO Logo" <?php // TEMP ?>style="max-width: 3in;"<?php // TEMP ?> /></span>
    <form id="login-form" name="login-form" method="post">
        <h1>Q<i>S</i><i>y</i><i>s</i> Login</h1>
        <div class="textbox-ex"><label for="usr">Username</label> <input id="usr" name="usr" type="text" placeholder="Username" required autofocus></div>
        <div class="textbox-ex"><label for="pw">Password</label> <input id="pw" name="pw" type="password" placeholder="Password" required></div>
        <div class="checkbox-ex"><input id="remember-user" name="remember-user" type="checkbox"> <label for="remember-user">Remember me</label></div>
        <div class="button-group-ex">
            <span class="button-ex"><button id="sign-in" name="sign-in" type="submit">Sign In</button></span>
            <span class="button-ex"><button id="redir" name="redir" form="redir-qscreen" value="<?php echo($_SERVER['PHP_SELF']); ?>">Queue Screen</button></span>
        </div>
    </form>
    <form id="redir-qscreen" name="redir-qscreen" action="<?php echo(__BASE__); ?>/qsys/queue" method="get"></form>
</section>
        <?php $this->htmlTail();
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
<div class="app qsys">
<?php
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
}

?>