<?php E_STRICT;
session_start();

require_once('../../../../path.php');

require_once(__FILE_ROOT__ . '/qmis/php/classes/qmisproperApp.php');

$app = new ProPER_App();

$app->run('new-process');
?>
