<?php E_STRICT;
// DEBUG: REPLACE CODE WITH APPROPRIATE HASHING PROCEDURES

$_SESSION['user'] = $userInfo;//$_POST['unm'];
// setcookie('user', $_POST['unm'], time() + 500, '/'); // EXPIRE IN 500 SECONDS
setcookie('user', $_POST['unm'], time() + 60 * 60 * 24, '/');
// setcookie('user', $_POST['unm']);

// clear post, get, and request superglobal
$url = $_REQUEST['src'] . (isset($_REQUEST['app']) ? '?app=' . $_REQUEST['app'] : '');
unset($_REQUEST['a']);
unset($_POST['a']);
unset($_GET['a']);

// redirect back to source URL
header('Location: ' . (trim($url) == '' ? '/' : $url));

// DEBUG
?>