<?php
session_start();

require_once('php/RAcELApp.php');

$app = new RAcEL_App();

$app->run();
?>