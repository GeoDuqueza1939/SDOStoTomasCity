<?php E_STRICT;
session_start();

require_once('../path.php');

require_once(__FILE_ROOT__ . '/mpasis/php/classes/mpasisApp.php');

$app = new MPASIS_App();

$app->run();

?>