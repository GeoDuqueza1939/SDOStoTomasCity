<?php E_STRICT;

require_once(__FILE_ROOT__ . '/php/classes/db.php');
require_once(__FILE_ROOT__ . '/php/audit/log.php');

function getValidCredentials(string $username, string $password)
{
    require(__FILE_ROOT__ . '/sergs/php/db-ddl.php');
    require(__FILE_ROOT__ . '/php/secure/dbcreds.php');

    $dbconn = new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $dbname, $ddl);

    $join = '(SELECT given_name, middle_name, family_name, spouse_name, ext_name, birth_date, birth_place, employeeId, is_temporary_empno FROM `SDOStoTomas`.`Person` INNER JOIN `SDOStoTomas`.`Employee` ON Person.personId=Employee.personId) as E INNER JOIN `SDOStoTomas`.`User` ON E.employeeId=User.employeeId';

    $fields = 'given_name, middle_name, family_name, spouse_name, ext_name, birth_date, birth_place, E.employeeId as employeeId, is_temporary_empno, username, sergs_access_level, opms_access_level';

    // $dbResults = $dbconn->select($join, $fields, "WHERE username='$username' AND password='" . hash('ripemd320', $password) ."'"); // THIS FIRES AN ERROR
    $dbResults = $dbconn->executeStatement("SELECT $fields FROM $join WHERE username='$username' AND password='" . hash('ripemd320', $password) ."'");

    if (is_null($dbconn->lastException))
    {
        if (is_null($dbResults) || count($dbResults) == 0)
        {
            $join = '`SDOStoTomas`.`Person` INNER JOIN `SDOStoTomas`.`Temp_User` ON Person.personId=Temp_User.personId';
    
            $fields = 'given_name, middle_name, family_name, spouse_name, ext_name, birth_date, birth_place, username, sergs_access_level, opms_access_level, mpasis_access_level';
    
            $dbResults = $dbconn->executeStatement("SELECT $fields FROM $join WHERE username='$username' AND password='" . hash('ripemd320', $password) ."'");

            if (is_null($dbconn->lastException) && count($dbResults) > 0)
            {
                $dbResults[0]["is_temporary_user"] = true;
            }
            else
            {
                $dbResults = null;
            }
        }
        elseif (count($dbResults) > 0)
        {
                $dbResults[0]["is_temporary_user"] = false;
        }
        else
        {
            $dbResults = null;
        }
    }
    else
    {
        $dbResults = null;
    }
    if (isset($_REQUEST['app']))
    {
        if (is_null($dbResults))
        {
            logAction($_REQUEST['app'], 23, array(
                "username_op"=>$username
            ));
        }
        else
        {
            logAction($_REQUEST['app'], 22, array(
                ($dbResults[0]["is_temporary_user"] ? 'temp_' : '') . "username"=>$username
            ));
        }
    }

    $dbconn = null; // unnecessary

    // return (count($dbResults) == 0 ? null : $dbResults[0]);
    return (is_null($dbResults) ? null : $dbResults[0]);
}
?>