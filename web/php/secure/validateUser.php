<?php E_STRICT;

require_once(__FILE_ROOT__ . '/php/classes/db.php');

function getValidCredentials(string $username, string $password)
{
    require_once(__FILE_ROOT__ . '/sergs/php/db-ddl.php');
    require_once(__FILE_ROOT__ . '/php/secure/dbcreds.php');

    $dbconn = new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $dbname, $ddl);

    $join = '(SELECT given_name, middle_name, family_name, spouse_name, ext_name, birth_date, birth_place, employeeId, is_temporary_empno FROM `SDOStoTomas`.`Person` INNER JOIN `SDOStoTomas`.`Employee` ON Person.id=Employee.personId) as E INNER JOIN `SDOStoTomas`.`User` ON E.employeeId=User.employeeId';

    $fields = 'given_name, middle_name, family_name, spouse_name, ext_name, birth_date, birth_place, E.employeeId as employeeId, is_temporary_empno, username, sergs_access_level, opms_access_level';

    // $dbResults = $dbconn->select($join, $fields, "WHERE username='$username' AND password='" . hash('ripemd320', $password) ."'"); // THIS FIRES AN ERROR
    $dbResults = $dbconn->executeStatement("SELECT $fields FROM $join WHERE username='$username' AND password='" . hash('ripemd320', $password) ."'");

    if (is_null($dbResults) || count($dbResults) == 0)
    {
        $join = '`SDOStoTomas`.`Person` INNER JOIN `SDOStoTomas`.`Temp_User` ON Person.id=Temp_User.personId';

        $fields = 'given_name, middle_name, family_name, spouse_name, ext_name, birth_date, birth_place, username, sergs_access_level, opms_access_level, mpasis_access_level';

        $dbResults = $dbconn->executeStatement("SELECT $fields FROM $join WHERE username='$username' AND password='" . hash('ripemd320', $password) ."'");
    }

    $dbconn = null;

    return (count($dbResults) == 0 ? null : $dbResults[0]);
}
?>