<?php E_STRICT;
session_start();

$basedir = '/home/geovaniduqueza1939/Code/GitHub/SDOStoTomasCity/web';

define('__ROOT__', $basedir); // INCLUDED FOR COMPATIBILITY ONLY
define('__FILE_ROOT__', $basedir);
define('__WEB_ROOT__', "$basedir/root");

require_once(__FILE_ROOT__ . '/mpasis/php/classes/mpasisApp.php');

$app = new MPASIS_App();

$app->run();

?>