<?php
function returnConnection()
{
    $servername = 'localhost';
	$dbname = 'SDOStoTomas';
	$dbuser = 'root';
	$dbpass = 'admin';

	try {
		// $conn = new mysqli($servername, $dbuser, $dbpass, $dbname);
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $dbuser, $dbpass);

		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch (PDOException $e) {
		die("Connection failed: " . $e->getMessage());
	}
	// if ($conn->connect_error)
	// 	die(json_encode(new ajaxResponse('Error', 'Connection failed: ' . $conn->connect_error)));

    return $conn;
}
?>