<?php E_STRICT;
session_start();

require_once('../../path.php');
require_once(__WEB_ROOT__ . '/qsys/php/classes/qsysApp.php');

$app = new QSys_App();

$app->run('qmgr');

?>