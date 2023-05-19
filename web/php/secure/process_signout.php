<?php E_STRICT;
require_once(__FILE_ROOT__ . '/php/audit/log.php');

logAction('mpasis', 24, array(
    ($_SESSION['user']["is_temporary_user"] ? 'temp_' : '') . "username"=>$_SESSION['user']['username']
));

session_unset();
session_destroy();

// redirect to login page
if ($redirectToLogin)
{
    header('Location: /login?src=' . $_SERVER['PHP_SELF']);
}
?>