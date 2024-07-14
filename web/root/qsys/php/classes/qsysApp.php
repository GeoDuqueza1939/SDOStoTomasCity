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
        $this->generateHTMLHead('Dashboard');
?>

<?php
        $this->generateHTMLTail();
    }

    private function generateQueueManagerUI()
    { 
        $this->generateHTMLHead('Queue Manager');
?>

<?php
        $this->generateHTMLTail();
    }

    private function generateQueueScreenUI()
    { 
        $this->generateHTMLHead('Queue Screen');
?>

<?php
        $this->generateHTMLTail();
    }

    private function generateLoginUI()
    { 
        $this->generateHTMLHead('Sign In');
?>
<section class="login">
    <span class="institutional-logo-container"><img class="institutional-logo" src="<?php echo(__BASE__ . '/images/logo-depedstotomas.webp'); ?>" alt="SDO Logo" /></span>
    <form class="login-form">

    </form>
</section>
<?php
        $this->generateHTMLTail();
    }

    private function generateHTMLHead($subtitle = NULL)
    { ?><!DOCTYPE html>
<html lang="en-PH">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<title><?php echo(is_null($subtitle) ? $this->getName() : 'QSys' | $subtitle);?></title>
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

    private function generateHTMLTail()
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