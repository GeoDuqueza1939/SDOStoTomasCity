<?php E_STRICT;

define('__ROOT__', '/home/geovaniduqueza1939/Code/GitHub/SDOStoTomasCity/web');
require_once(__ROOT__ . '/php/classes/db.php');

function isValidCredentials(string $username, string $password): bool
{
    require_once(__ROOT__ . '/sergs/php/db-ddl.php');
    require_once(__ROOT__ . '/php/secure/dbcreds.php');

    $dbconn = new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $dbname, $ddl);

    $dbResults = $dbconn->select('User', 'username', "WHERE username='$username' AND password='" . hash('ripemd320', $password) ."'");

    $dbconn = null;

    return count($dbResults) > 0;
}
?>