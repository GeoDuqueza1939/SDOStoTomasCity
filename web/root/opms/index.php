<?php E_STRICT;
session_start();

require_once('../path.php');

require_once(__FILE_ROOT__ . '/php/enums/pagetypes.php');
require_once(__FILE_ROOT__ . '/php/secure/validateUser.php');

$requiresSignIn = true;
$pageTitle = 'Online Performance Management System | Sto. Tomas City SDO';
$pageType = PageType::OPMS;
$addDebug = true;
?>
<!DOCTYPE html>
<html lang="en">
<?php require_once(__FILE_ROOT__ . '/php/snippets/html_head.php');?>
<body>
    <div id="opms" class="app home">
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
        // echo "OK<br>";
        // require_once(__FILE_ROOT__ . '/php/snippets/signout_interface.php');
    }
}
else
{
    // MODE: Signed out
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
        // redirect to login
        // header('Location: /login?src=' . $_SERVER['PHP_SELF']);
        ?><script>window.location.replace("<?php echo('/login?src=' . $_SERVER['PHP_SELF']); ?>");</script><?php
    }
}

require_once(__FILE_ROOT__ . '/opms/php/snippets/header_full.php');
require_once(__FILE_ROOT__ . '/opms/php/snippets/nav_full.php');

// HTML Content ?>
    <main>OPMS</main>

<?php
require_once(__FILE_ROOT__ . '/php/snippets/footer_full.php');
require_once(__FILE_ROOT__ . '/php/snippets/html_tail.php');
?>
    </div>
</body>
</html>