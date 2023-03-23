<?php E_STRICT;
session_start();

define('__ROOT__', '/home/geovaniduqueza1939/Code/GitHub/SDOStoTomasCity/web');
require_once(__ROOT__ . '/php/enums/pagetypes.php');
require_once(__ROOT__ . '/php/secure/validateUser.php');

$requiresSignIn = true;
$pageTitle = 'Service Record Generation System | Sto. Tomas City SDO';
$pageType = PageType::SERGS;
$addDebug = true;
?>
<!DOCTYPE html>
<html lang="en">
<?php require_once(__ROOT__ . '/php/snippets/html_head.php');?>
<body>
    <div id="sergs" class="app">
<?php
if (isset($_SESSION['user']))
{
    if (isset($_REQUEST['a']) && $_REQUEST['a'] == 'logout' || !isset($_COOKIE['user']))
    {
        require_once(__ROOT__ . '/php/secure/process_signout.php');
    }
    else
    {
        // MODE: operation
        // User is signed in
        // echo "OK<br>";
        require_once(__ROOT__ . '/php/snippets/signout_interface.php');
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
}

require_once(__ROOT__ . '/sergs/php/snippets/header_full.php');
require_once(__ROOT__ . '/sergs/php/snippets/nav_full.php');

// HTML Content ?>
    <main>SERGS</main>

<?php
require_once(__ROOT__ . '/php/snippets/footer_full.php');
require_once(__ROOT__ . '/php/snippets/html_tail.php');
?>
    </div>
</body>
</html>