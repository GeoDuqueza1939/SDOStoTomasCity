<?php E_STRICT;
session_start();

class ajaxResponse// implements JsonSerializable
{
	// private $type; // possible values: "Success", "Info", "Error", "Text", "Username", "JSON", "DataRows", "DataRow", "User", "Entries", "Entry"
	// private $content;
	
	public function __construct($type, $content)
	{
		$this->type = $type;
		$this->content = $content;
	}
	
	// public function get_type()
	// {
	// 	return $this->type;
	// }
	
	// public function get_content()
	// {
	// 	return $this->content;
	// }
	
	// public function to_array()
	// {
    //     return array(
    //         "type"=>$this->type,
    //         "content"=>$this->content
    //     );
	// }
	
	// // override to allow json_encode() to convert an instance of this class
	// public function jsonSerialize ()
	// { 
	// 	return $this->to_array();
    // }
};
require_once('../../path.php');

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
                    case 'tempuser':
                        $dbResults = $dbconn->executeQuery('SELECT given_name, middle_name, family_name, spouse_name, ext_name, username, sergs_access_level, opms_access_level, mpasis_access_level FROM SDOStoTomas.Person INNER JOIN SDOStoTomas.Temp_User ON Person.id=Temp_User.personId' . (isset($_REQUEST['k']) && trim($_REQUEST['k']) == 'all' ? '' : ' WHERE Temp_User.username LIKE "' . trim($_REQUEST['k']) . '";'));
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        break;
                    case 'positionCategory':
                        $dbResults = $dbconn->select('Position_Category', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        break;
                    case 'educLevel':
                        $dbResults = $dbconn->select('ENUM_Educational_Attainment', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        break;
                    case 'specEduc':
                        $dbResults = $dbconn->select('Specific_Education', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        break;
                    case 'civilStatus':
                        $dbResults = $dbconn->select('ENUM_Civil_Status', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        break;
                    case 'disability':
                        $dbResults = $dbconn->select('Disability', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        break;
                    case 'ethnicGroup':
                        $dbResults = $dbconn->select('Ethnic_Group', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        break;
                    case 'religion':
                        $dbResults = $dbconn->select('Religion', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        break;
                    case 'eligibilities':
                        $dbResults = $dbconn->select('Eligibility', '*', '');
    
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
            case 'add':
                if (isset($_REQUEST['eligibilities']))
                {
                    $eligibilities = json_decode($_REQUEST['eligibilities'], true);
    
                    $errMsg = '';
                    $valueStr = '';
    
                    foreach ($eligibilities as $eligibility)
                    {
                        $valueStr .= ($valueStr == '' ? '' : ', ') . '("' . $eligibility['name'] . '","' . $eligibility['description'] . '")';
                    }
    
                    $dbconn->insert('Eligibility', '(name, description)', $valueStr);
    
                    if (is_null($dbconn->lastException))
                    {
                        // echo(json_encode(new ajaxResponse('Success', $_REQUEST['eligibilities'])));
                        echo(json_encode(new ajaxResponse('Success', 'Eligibility successfully added')));
                    }
                    else
                    {
                        echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                    }
                    
                }
                if (isset($_REQUEST['specEducs']))
                {
                    $specEducs = json_decode($_REQUEST['specEducs'], true);
                    
                    $errMsg = '';
                    $valueStr = '';
                    
                    foreach ($specEducs as $specEduc)
                    {
                        
                        $valueStr .= ($valueStr == '' ? '' : ', ') . '("' . $specEduc['specific_education'] . '","' . $specEduc['description'] . '")';
                    }
    
                    $dbconn->insert('Specific_Education', '(specific_education, description)', $valueStr);
    
                    if (is_null($dbconn->lastException))
                    {
                        echo(json_encode(new ajaxResponse('Success', 'Specific course/education successfully added')));
                    }
                    else
                    {
                        echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                    }
                    
                }
                elseif (isset($_REQUEST['positions']))
                {
                    $positions = json_decode($_REQUEST['positions'], true);

                    foreach($positions as $position)
                    {
                        $fieldStr = '';
                        $valueStr = '';

                        
                        foreach($position as $key => $value)
                        {
                            if ($key != 'required_eligibility')
                            {
                                $valueStr .= ($fieldStr == '' ? '' : ', ') . "'$value'";
                                $fieldStr .= ($fieldStr == '' ? '' : ', ') . $key;
                            }
                        }
                        $fieldStr = '(' . $fieldStr . ')';
                        $valueStr = '(' . $valueStr . ')';

                        // foreach($position['required_eligibility'] as $reqElig)
                        // {
                        //     echo($reqElig);
                        //     echo("x");
                        // }

                        $dbconn->insert('Position', $fieldStr, $valueStr);

                        if (is_null($dbconn->lastException))
                        {
                            foreach($position['required_eligibility'] as $reqElig)
                            {
                                $dbconn->insert('Required_Eligibility', '(plantilla_item_number, eligibilityId)', '("' . $position['plantilla_item_number'] . '", "' . $reqElig . '")');

                                if (!is_null($dbconn->lastException))
                                {
                                    echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '\nLast SQL Statement: ' . $dbconn->lastSQLStr)));
                                    return;        
                                }
                            }
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '\nLast SQL Statement: ' . $dbconn->lastSQLStr)));
                            return;
                        }
                    }
                    
                    echo(json_encode(new ajaxResponse('Success', 'Successfully added Position details!')));
                    
                    return;
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

                    $personId = $dbconn->insert('Person', "($fieldStr)", "($valueStr)");
                    // $personId = 1;

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

                            foreach ($tempUser as $key => $value) {
                                $valueStr .= (trim($fieldStr) == '' ? '': ', ') . "'$value'";
                                $fieldStr .= (trim($fieldStr) == '' ? '': ', ') . $key;
                            }

                            $dbconn->insert('Temp_User', "($fieldStr)", "($valueStr)");

                            if (is_null($dbconn->lastException))
                            {
                                echo(json_encode(new ajaxResponse('Success', 'User successfully created')));
                                return;
                            }
                            else
                            {
                                echo(json_encode(new ajaxResponse('Error', 'Exception encountered in inserting user details')));
                                return;
                            }
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', 'Username is required')));
                            return;
                        }
                    }
                    else
                    {
                        echo(json_encode(new ajaxResponse('Error', 'Exception encountered in inserting personal details')));
                        return;
                    }
                }
                else
                {
                    echo(json_encode(new ajaxResponse('Error', 'Given Name is required')));
                    return;
                }

                break;
            case 'getSalaryFromSG':
                $salaryGrade = $_REQUEST['sg'];

                $dbResults = $dbconn->select('Salary_Table', 'salary', 'WHERE salary_grade="' . $salaryGrade . '" AND step_increment=1 AND effectivity_date="2023/1/1"');
                
                if (is_null($dbconn->lastException))
                {
                    echo(json_encode(new ajaxResponse('Salary', $dbResults[0]['salary'])));
                }
                else
                {
                    echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                }

                break;
        }
    }
}
?>