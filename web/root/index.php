<?php E_STRICT;
session_start();

require_once('path.php');

require_once(__FILE_ROOT__ . '/php/enums/pagetypes.php');

$requiresSignIn = false;
$pageTitle = 'Department of Education | Sto. Tomas City SDO';
$pageType = PageType::Landing;
$addDebug = true;
$isSignedIn = false;

?>
<!DOCTYPE html>
<html lang="en">
<?php require_once(__FILE_ROOT__ . '/php/snippets/html_head.php');?>
<body>
    <div class="app landing">
<?php E_STRICT;

require_once(__FILE_ROOT__ . '/php/snippets/header_full.php');

if (isset($_SESSION['user']))
{
    if (isset($_REQUEST['a']) && $_REQUEST['a'] == 'logout' || !isset($_COOKIE['user']))
    {
        $redirectToLogin = true;
        require_once(__FILE_ROOT__ . '/php/secure/process_signout.php');
    }
    else // MODE: operation (User is signed in)
    {
        $isSignedIn = true;
        require_once(__FILE_ROOT__ . '/php/snippets/signout_interface.php');
    }
}
elseif ($requiresSignIn) // MODE: Signed out; redirect to login
{
    // header('Location: ' . __BASE__ . '/login?src=' . $_SERVER['PHP_SELF']);
    ?><script>window.location.replace("<?php echo(__BASE__ . '/login?src=' . $_SERVER['PHP_SELF'] . __BASE__); ?>");</script><?php
}
else // MODE: Signed out; display a page with a login link/button
{
    require_once(__FILE_ROOT__ . '/php/snippets/signin_interface.php');
}
?>
        <section>
            <div class="welcome">Welcome to the SDO Sto. Tomas City's Online Services.</div>
            <div class="please-select">Please select the service that you need<?php echo($isSignedIn ? "" : " or you may login to continue"); ?>.</div>

            <ul class="card-link">
                <li><a href="<?php echo(__BASE__); ?>/sergs">Service Record Generation System</a></li>
                <li><a href="<?php echo(__BASE__); ?>/opms">Online Performance Management System</a></li>
                <li><a href="<?php echo(__BASE__); ?>/mpasis">Merit Promotion and Selection Information System</a></li>
            </ul>
        </section>
        
        <?php require_once(__FILE_ROOT__ . '/php/snippets/html_tail.php'); ?>
    </div>
</body>
</html>
