<?php E_STRICT;

define('__ROOT__', '/home/geovaniduqueza1939/Code/GitHub/SDOStoTomasCity/web');
require_once(__ROOT__ . '/php/classes/db.php');

function getValidCredentials(string $username, string $password): array
{
    require_once(__ROOT__ . '/sergs/php/db-ddl.php');
    require_once(__ROOT__ . '/php/secure/dbcreds.php');

    $dbconn = new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $dbname, $ddl);

    $srcTable = '(SELECT given_name, middle_name, family_name, spouse_name, ext_name, birth_date, birth_place, employeeId, is_temporary_empno FROM Person INNER JOIN Employee ON Person.id=Employee.personId) as E INNER JOIN User ON E.employeeId=User.employeeId';

    $fields = 'given_name, middle_name, family_name, spouse_name, ext_name, birth_date, birth_place, E.employeeId as employeeId, is_temporary_empno, username, sergs_access_level, opms_access_level';

    $dbResults = $dbconn->select($srcTable, $fields, "WHERE username='$username' AND password='" . hash('ripemd320', $password) ."'");

    $dbconn = null;

    return (count($dbResults) == 0 ? null : $dbResults[0]);
}
?>