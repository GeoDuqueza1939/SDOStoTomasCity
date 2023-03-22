<?php E_STRICT;
session_unset();
session_destroy();

// redirect to login page
header('Location: /login?src=' . $_SERVER['PHP_SELF']);
?>