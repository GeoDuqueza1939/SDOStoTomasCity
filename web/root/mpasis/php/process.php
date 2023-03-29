<?php E_STRICT;
session_start();

class ajaxResponse
{
    public function __construct($type, $content)
    {
        $this->type = $type;
        $this->content = $content;
    }
}

$basedir = '/home/geovaniduqueza1939/Code/GitHub/SDOStoTomasCity/web';

define('__FILE_ROOT__', $basedir);
define('__WEB_ROOT__', "$basedir/root");

require_once(__FILE_ROOT__ . '/php/classes/db.php');
require_once(__FILE_ROOT__ . '/php/secure/dbcreds.php');

// TEST ONLY !!!!!!!!!!!!!
if (isset($_REQUEST['test']))
{
    echo(json_encode(new ajaxResponse('Info','test reply')));
}
// TEST ONLY !!!!!!!!!!!!!

if (isset($_SESSION['user']))
{
    if ($_REQUEST['q'] == 'login') // UNUSED
    {
        echo json_encode(new ajaxResponse('User', json_encode(array('Username'=>$_SESSION['user'], 'UserId'=>1 * $_SESSION['user_id']))));
	}
    elseif ($_REQUEST['a'] == 'logout') // UNUSED
    {
        session_unset();
		session_destroy();
		echo json_encode(new ajaxResponse('Success', 'Signed out.'));
    }
    elseif (isset($_REQUEST['a']))
    {
        $dbconn = new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $dbname, []);

        switch($_REQUEST['a'])
        {
            case 'fetch':
                switch($_REQUEST['f'])
                {
                    case 'user':
                        $dbResults = $dbconn->executeQuery('SELECT username, personId, sergs_access_level, opms_access_level, mpasis_access_level FROM `SDOStoTomas`.`Temp_User`' . (isset($_REQUEST['k']) && trim($_REQUEST['k']) == 'all' ? '' : ' WHERE username LIKE "' . trim($_REQUEST['k']) . '";'));
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        break;
                }
                break;
            case 'addTempUser':
                $person = json_decode($_REQUEST['person'], true);
                $tempUser = json_decode($_REQUEST['tempUser'], true);

                if (isset($person['given_name']))
                {
                    $fieldStr = '';
                    $valueStr = '';

                    foreach ($person as $key => $value) {
                        $valueStr .= (trim($fieldStr) == '' ? '': ', ') . "'$value'";
                        $fieldStr .= (trim($fieldStr) == '' ? '': ', ') . $key;
                    }

                    // $personId = $dbconn->insert('Person', "($fieldStr)", "($valueStr)");
                    $personId = 1;

                    if (is_null($dbconn->lastException))
                    {
                        if (isset($tempUser['username']))
                        {
                            $fieldStr = '';
                            $valueStr = '';
                            
                            $tempUser['personId'] = $personId;

                            if (isset($tempUser['password']))
                            {
                                $tempUser['password'] = trim(hash('ripemd320', $tempUser['password']));
                            }

                            echo $tempUser['password'];

                            foreach ($tempUser as $key => $value) {
                                $valueStr .= (trim($fieldStr) == '' ? '': ', ') . "'$value'";
                                $fieldStr .= (trim($fieldStr) == '' ? '': ', ') . $key;
                            }

                            $dbconn->insert('Temp_User', "($fieldStr)", "($valueStr)");

                            if (is_null($dbconn->lastException))
                            {
                                echo(new ajaxResponse('Success', 'User successfully created'));
                                return;
                            }
                            else
                            {
                                echo(new ajaxResponse('Error', 'Exception encountered in inserting user details'));
                                return;
                            }
                        }
                        else
                        {
                            echo(new ajaxResponse('Error', 'Username is required'));
                            return;
                        }
                    }
                    else
                    {
                        echo(new ajaxResponse('Error', 'Exception encountered in inserting personal details'));
                        return;
                    }
                }
                else
                {
                    echo(new ajaxResponse('Error', 'Given Name is required'));
                    return;
                }

                // var_dump(array_keys($person));
                // var_dump(array_keys($tempUser));

                // echo("x");
                // $dbconn->insert('Temp_User', $_REQUEST['dbflds'], $_REQUEST['dbvals']);

                // if (is_null($dbconn->lastException))
                // {
                //     echo(new ajaxResponse('Success', 'Successfully inserted data with id=' . $dbconn->lastInsertId));
                // }
                // else
                // {
                //     echo(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
                // }

                break;
        }
    }
}
?>