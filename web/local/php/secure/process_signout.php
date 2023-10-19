<?php E_STRICT;
require_once(__FILE_ROOT__ . '/php/audit/log.php');

logAction('mpasis', 24, array(
    ($_SESSION['user']["is_temporary_user"] ? 'temp_' : '') . "username"=>$_SESSION['user']['username']
));

setcookie('user', json_encode($_SESSION['user']), -time() - 60 * 60 * 24, '/');
setcookie('PHPSESSID', json_encode($_SESSION['user']), -time() - 60 * 60 * 24, '/');
session_unset();
session_destroy();

// redirect to login page
if ($redirectToLogin)
{
    // header('Location: /login?src=' . $_SERVER['PHP_SELF']);
    ?><script>window.location.replace("<?php echo('/login?src=' . $_SERVER['PHP_SELF']); ?>");</script><?php
}
else
{
    // header('Location: ' . $_SERVER['PHP_SELF']);
    ?><script>window.location.replace("<?php echo($_SERVER['PHP_SELF']); ?>");</script><?php
}
?>