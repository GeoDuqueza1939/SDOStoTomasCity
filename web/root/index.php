<?php E_STRICT;
session_start();

require_once('path.php');

require_once(__FILE_ROOT__ . '/php/enums/pagetypes.php');

$requiresSignIn = false;
$pageTitle = 'Department of Education | Sto. Tomas City SDO';
$pageType = PageType::Landing;
$addDebug = true;

?>
<!DOCTYPE html>
<html lang="en">
<?php require_once(__FILE_ROOT__ . '/php/snippets/html_head.php');?>
<body>
    <div class="app landing">
        <header>
            <div>
                <div>
                    <span class="header-logo">
                        <img src="/images/logo-depedstotomas.webp" alt="Logo (DEPED-Sto. Tomas City SDO)" />
                    </span>
                    <span class="header-text">
                        <span class="header-text-deped">Department of Education</span>
                        <span class="header-text-sdo">Schools Division of Sto. Tomas City</span>
                    </span>
                </div>
            </div>
        </header>
<?php
if (isset($_SESSION['user']))
{
    if (isset($_REQUEST['a']) && $_REQUEST['a'] == 'logout' || !isset($_COOKIE['user']))
    {
        // $redirectToLogin = true;
        require_once(__FILE_ROOT__ . '/php/secure/process_signout.php');
    }
    else
    {
        // MODE: operation
        // User is signed in

        require_once(__FILE_ROOT__ . '/php/snippets/signout_interface.php');
?>
        <div class="welcome">Welcome to the SDO Sto. Tomas City's Online Services.</div>
        <div class="please-select">Please select the service that you need.</div>
<?php
    }
}
else
{
    // MODE: Signed out
    
    if ($requiresSignIn)
    {
        // redirect to login
        header('Location: /login?src=' . $_SERVER['PHP_SELF']);
    }
    else
    {
        // display a page with a login link/button
        require_once(__FILE_ROOT__ . '/php/snippets/signin_interface.php');
?>

        <div class="welcome">Welcome to the SDO Sto. Tomas City's Online Services.</div>
        <div class="please-select">Please select the service that you need or you may login to continue.</div>
<?php
    }
}?>
        <ul class="card-link">
            <li><a href="/sergs">Service Record Generation System</a></li>
            <li><a href="/opms">Online Performance Management System</a></li>
            <li><a href="/mpasis">Merit Promotion and Selection Information System</a></li>
        </ul>
<?php require_once(__FILE_ROOT__ . '/php/snippets/html_tail.php'); ?>
    </div>
</body>
</html>
