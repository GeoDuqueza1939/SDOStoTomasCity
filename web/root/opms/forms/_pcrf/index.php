<?php E_STRICT;
session_start();

define('__ROOT__', '/home/geovaniduqueza1939/Code/GitHub/SDOStoTomasCity/web');
require_once(__ROOT__ . '/php/enums/pagetypes.php');
require_once(__ROOT__ . '/php/secure/validateUser.php');

$requiresSignIn = true;
$pageTitle = 'IPCRF/OPCRF | OPMS | Sto. Tomas City SDO';
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
        <h2>Individual/Office Performance Commitment and Review Form</h2>

        <section class="pcrf-ratee-info">
            <span class="pcrf-ratee-name"><?php echo $_SESSION['user']['given_name'] . ' ' . (isset($_SESSION['user']['spouse_name']) ? $_SESSION['user']['family_name'] . ' ' . $_SESSION['user']['spouse_name'] : $_SESSION['user']['middle_name'] . ' ' . $_SESSION['user']['family_name']) . (isset($_SESSION['user']['ext_name']) ? ', ' . $_SESSION['user']['ext_name'] : '');?></span>
            <span class="pcrf-ratee-position"><?php echo 'x';?></span>
            <span class="pcrf-ratee-workplace"><?php echo 'y';?></span>
            <span class="pcrf-rating-period"><?php echo 'z';?></span>
        </section>

        <section class="pcrf-rater-info">
            
        </section>
    </main>

<?php
require_once(__ROOT__ . '/php/snippets/footer_full.php');
require_once(__ROOT__ . '/php/snippets/html_tail.php');
?>
    </div>
</body>
</html>