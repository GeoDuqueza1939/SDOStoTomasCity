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
    <div class="app">
<?php
if (isset($_SESSION['user']))
{
    if (isset($_REQUEST['a']) && $_REQUEST['a'] == 'logout' || !isset($_COOKIE['user']))
    {
        $redirectToLogin = true;
        require_once(__FILE_ROOT__ . '/php/secure/process_signout.php');
    }
    else
    {
        // MODE: operation
        // User is signed in
        echo "OK<br>";
        require_once(__FILE_ROOT__ . '/php/snippets/signout_interface.php');
    }
}
else
{
    // MODE: Signed out
    echo('NO USER<br>');
    
    if ($requiresSignIn)
    {
        // redirect to login
        header('Location: /login?src=' . $_SERVER['PHP_SELF']);
    }
    else
    {
?>
        <a href="<?php echo('/login?src=' . $_SERVER['PHP_SELF']);?>">Click to sign-in</a>
<?php
    }
}
        // display a page with a login link/button
?>
    <ul>
        <li><a href="/sergs">Service Record Generation System</a></li>
        <li><a href="/opms">Online Performance Management System</a></li>
        <li><a href="/mpasis">Merit Promotion and Selection Information System</a></li>
    </ul>
<?php
require_once(__FILE_ROOT__ . '/php/snippets/html_tail.php');
?>
    </div>
</body>
</html>
