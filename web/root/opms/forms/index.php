<?php E_STRICT;
session_start();

define('__ROOT__', '/home/geovaniduqueza1939/Code/GitHub/SDOStoTomasCity/web');
require_once(__ROOT__ . '/php/enums/pagetypes.php');
require_once(__ROOT__ . '/php/secure/validateUser.php');

$requiresSignIn = true;
$pageTitle = 'Online Forms | OPMS | Sto. Tomas City SDO';
$pageType = PageType::OPMS;
$addDebug = true;
?>
<!DOCTYPE html>
<html lang="en">
<?php require_once(__ROOT__ . '/php/snippets/html_head.php');?>
<body>
    <div id="opms" class="app">
<?php
if (isset($_SESSION['user']))
{
    if (isset($_REQUEST['a']) && $_REQUEST['a'] == 'logout' || !isset($_COOKIE['user']))
    {
        require_once(__ROOT__ . '/php/secure/process_signout.php');
    }
}
elseif ($requiresSignIn)
{
    // redirect to login
    header('Location: /login?src=' . $_SERVER['PHP_SELF']);
}

require_once(__ROOT__ . '/opms/php/snippets/header_full.php');
require_once(__ROOT__ . '/opms/php/snippets/nav_full.php');

// HTML Content ?>
    <main>
        <h2>Performance Management Forms</h2>
        <p>Welcome to the Online Performance Management System!</p>
        <p>Please select the form tat you need to use:</p>
        <ul>
            <li><a href="/opms/forms/_pcrf/">IPCRF/OPCRF</a></li>
            <li><a href="/opms/forms/sat/">SAT</a></li>
            <li><a href="/opms/forms/pmcf/">PMCF</a></li>
        </ul>
    </main>

<?php
require_once(__ROOT__ . '/php/snippets/footer_full.php');
require_once(__ROOT__ . '/php/snippets/html_tail.php');
?>
    </div>
</body>
</html>