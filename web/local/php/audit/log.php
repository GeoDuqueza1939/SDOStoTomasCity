<?php E_STRICT;
require_once(__FILE_ROOT__ . '/php/classes/db.php');

function logAction($app, $actionIndex, $paramObj = [])
{
    require(__FILE_ROOT__ . '/sergs/php/db-ddl.php');
    require(__FILE_ROOT__ . '/php/secure/dbcreds.php');
    
    $dbconn = new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $dbname, $ddl);

    switch ($app) {
        case 'mpasis':
            $table = "MPASIS_History";
            $fieldStr = 'mpasis_action';
            $valueStr = "'$actionIndex'";

            foreach ($paramObj as $key => $value) {
                $fieldStr .= ', ' . $key;
                $valueStr .= ', ' . "'$value'";
            }

            $fieldStr = "($fieldStr)";
            $valueStr = "($valueStr)";

            $dbconn->insert($table, $fieldStr, $valueStr);

            break;
        default:
            break;
    }

    $dbconn = null;
}
?>