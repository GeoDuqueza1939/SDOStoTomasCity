<?php E_STRICT;
session_start();

require_once('../../../path.php');

require_once(__FILE_ROOT__ . '/sergs/php/classes/sergsApp.php');

$app = new SeRGS_App();

$app->run('my-requests');
?>
