<?php E_STRICT;

require_once(__FILE_ROOT__ . '/php/classes/db.php');
require_once(__FILE_ROOT__ . '/php/audit/log.php');

function getUserFetchQuery($includePassword = false)
{
    return
        'SELECT 
            username,
            given_name,
            middle_name,
            family_name,
            spouse_name,
            ext_name,
            birth_date,
            birth_place,
            All_User.employeeId,
            Person.personId,
            sergs_access_level,
            opms_access_level,
            mpasis_access_level,
            first_signin,
            pin,
            temp_user' . ($includePassword ? ', password' : '') . '
        FROM (
            SELECT username, personId, "" AS employeeId, sergs_access_level, opms_access_level, mpasis_access_level, first_signin, pin, TRUE AS is_temporary_user, 1 AS temp_user' . ($includePassword ? ', password' : '') . ' FROM SDOStoTomas.Temp_User
            UNION
            SELECT username, "" AS personId, employeeId, sergs_access_level, opms_access_level, mpasis_access_level, first_signin, pin, FALSE AS is_temporary_user, 0 AS temp_user' . ($includePassword ? ', password' : '') . ' FROM SDOStoTomas.User
        ) AS All_User
        LEFT OUTER JOIN SDOStoTomas.Employee ON All_User.employeeId=Employee.employeeId
        LEFT OUTER JOIN SDOStoTomas.Person ON All_User.personId=Person.personId OR Employee.personId=Person.personId';

}

function getValidCredentials(string $username, string $password)
{
    require(__FILE_ROOT__ . '/sergs/php/db-ddl.php');
    require(__FILE_ROOT__ . '/php/secure/dbcreds.php');

    $dbconn = new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $dbname, $ddl);

    $dbResults = $dbconn->executeQuery(getUserFetchQuery(true) . " WHERE username='$username' AND password='" . hash('ripemd320', $password) . "'");

    if (is_null($dbconn->lastException))
    {
        if (is_null($dbResults) || count($dbResults) == 0)
        {
            $dbResults = null;
        }
        elseif (count($dbResults) > 0)
        {
            for ($i = 0; $i < count($dbResults); $i++) {
                $dbResult = $dbResults[$i];
                $dbResults[$i]["is_temporary_user"] = ($dbResults[$i]['temp_user'] != 0);
                unset($dbResults[$i]["password"]);
            }
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

function isValidUserSession()
{
    return isset($_SESSION['user']) && isset($_COOKIE['user']) && isset($_SESSION['user']['username']) && isset(json_decode($_COOKIE['user'], true)['username']) && $_SESSION['user']['username'] == json_decode($_COOKIE['user'], true)['username'];
}

function userExists(DatabaseConnection $dbconn, $username, $isTempUser = false)
{
    return recordExists($dbconn, ($isTempUser ? 'Temp_' : '') . 'User', 'username', $username);
}

function employeeExists(DatabaseConnection $dbconn, $employeeId)
{
    return recordExists($dbconn, 'Employee', 'employeeId', $employeeId);
}

function addUser(DatabaseConnection $dbconn, $user, $person, $calledByUpdateUser = false)
{
    $isTempUser = $user['temp_user'];
    $username = $user['username'];

    $fieldStr = '';
    $valueStr = '';

    if (!$calledByUpdateUser && userExists($dbconn, $username, $isTempUser)) // if not called by updateUser method and username already exists, raise an error
    {
        return json_encode(new ajaxResponse('Error', 'Username already exists'));
    }
    elseif ($isTempUser) // insert person details and return the personId for use later
    {
        if (isset($person['given_name']))
        {
            foreach ($person as $key => $value) {
                $valueStr .= (trim($fieldStr) == '' ? '': ', ') . "'$value'";
                $fieldStr .= (trim($fieldStr) == '' ? '': ', ') . $key;
            }

            $user['personId'] = $dbconn->insert('Person', "($fieldStr)", "($valueStr)");

            if (!is_null($dbconn->lastException))
            {
                return json_encode(new ajaxResponse('Error', 'Exception encountered while inserting personal details'));
            }
        }
        else
        {
            return json_encode(new ajaxResponse('Error', 'Given Name is required for temporary user accounts'));
        }
    }
    elseif (!isset($user['employeeId']))
    {
        return json_encode(new ajaxResponse('Error', 'Employee ID is required for non-temporary user accounts'));
    }
    elseif (!employeeExists($dbconn, $user['employeeId'])) 
    {
        return json_encode(new ajaxResponse('Error', 'Employee ID doesn\'t exist'));
    }
    
    if (!isset($user['password']))
    {
        $user['password'] = '1234'; // DEFAULT PASSWORD FOR NEW ACCOUNTS
    }
    $user['password'] = trim(hash('ripemd320', $user['password']));
    $user['first_signin'] = true;

    $fieldStr = '';
    $valueStr = '';
    
    foreach ($user as $key => $value) {
        if ((($isTempUser && $key != 'employeeId') || $key != 'personId') && $key != 'temp_user')
        {
            $valueStr .= (trim($fieldStr) == '' ? '': ', ') . "'$value'";
            $fieldStr .= (trim($fieldStr) == '' ? '': ', ') . $key;
        }
    }

    $dbconn->insert(($isTempUser ? 'Temp_' : '') . 'User', "($fieldStr)", "($valueStr)");

    if (is_null($dbconn->lastException))
    {
        logAction('mpasis', ($isTempUser ? 16 : 10), array(
            ($_SESSION['user']["is_temporary_user"] ? 'temp_' : '') . "username"=>$_SESSION['user']['username'],
            ($isTempUser ? 'temp_' : '') . 'username_op'=>$user['username']
        ));
        return json_encode(new ajaxResponse('Success', ($isTempUser ? 'Temporary u' : 'U') . 'ser successfully created'));
    }
    else
    {
        die(json_encode(new ajaxResponse('Error', 'Exception encountered while inserting' . ($isTempUser ? ' temporary' : '') . ' user details<br><br>Last SQL query: ' . $dbconn->lastSQLStr . '<br><br>' . $dbconn->lastException->getMessage())));
    }
}

function updateUser(DatabaseConnection $dbconn, $user, $person)
{
    $isTempUser = $user['temp_user'];
    $username = $user['username'];
    $fieldValueStr = '';

    if (userExists($dbconn, $username, $isTempUser))
    {
        if (isset($user['personId']))
        {
            foreach ($person as $key => $value)
            {
                $fieldValueStr .= (trim($fieldValueStr) == '' ? '': ', ') . $key . '=' . (is_null($value) || $value == '' ? 'NULL' : "'$value'");
            }

            $dbconn->update('Person', $fieldValueStr, 'WHERE personId=\'' . $user['personId'] . '\'');

            if (!is_null($dbconn->lastException))
            {
                return json_encode(new ajaxResponse('Error', 'Exception encountered while updating personal details'));
            }
        }
        else
        {
            return json_encode(new ajaxResponse('Error', 'Person ID is required for updating user accounts'));
        }

        $fieldValueStr = '';

        foreach ($user as $key => $value) {
            if ($key != 'temp_user' && $key != ($isTempUser ? 'employeeId' : 'personId'))
            {
                $fieldValueStr .= (trim($fieldValueStr) == '' ? '' : ', ') . $key . '=' . (is_null($value) || $value == '' ? 'NULL' : "'$value'") . '';
            }
        }

        $dbconn->update(($isTempUser ? 'Temp_' : '') . 'User', $fieldValueStr, 'WHERE username=\'' . $user['username'] . '\'');

        if (is_null($dbconn->lastException))
        {
            logAction('mpasis', ($isTempUser ? 18 : 12), array(
                ($_SESSION['user']["is_temporary_user"] ? 'temp_' : '') . "username"=>$_SESSION['user']['username'],
                ($isTempUser ? 'temp_' : '') . 'username_op'=>$user['username']
            ));
            return json_encode(new ajaxResponse('Success', ($isTempUser ? 'Temporary u' : 'U') . 'ser successfully updated'));
        }
        else
        {
            return json_encode(new ajaxResponse('Error', 'Exception encountered while updating user details<br>' . $dbconn->lastSQLStr . '<br>' . $dbconn->lastException->getMessage()));
        }
    }
    else
    {
        return addUser($dbconn, $user, $person, true);
    }
}

function fetchUser(DatabaseConnection $dbconn, $username = '', $criteriaStr = 'all')
{
    $criteria = '';

    if (isset($username) && is_string($username) && trim($username) != "")
    {
        $criteria = " WHERE username='$username'";
    }
    elseif (isset($criteriaStr) && is_string($criteriaStr) && trim($criteriaStr) != "")
    {
        $criteria = $criteriaStr;
    }

    $dbResults = $dbconn->executeQuery(
        getUserFetchQuery() . $criteria . ';'
    );

    if (is_null($dbconn->lastException))
    {
        logAction('mpasis', 11, array(
            ($_SESSION['user']["is_temporary_user"] ? 'temp_' : '') . "username"=>$_SESSION['user']['username'],
            // ($isTempUser ? 'temp_' : '') . 'username_op'=>$user['username']
            'username_op'=>$criteria
        ));
        return $dbResults;
    }
    else
    {
        die(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
    }
}

function changePassword(DatabaseConnection $dbconn, $passwordDetails)
{
    $requireCurrentPassword = $passwordDetails['requireCurrentPassword'];
    $password = $passwordDetails['password'];
    $newPassword = $passwordDetails['new_password'];
    $user = $passwordDetails['user'];
    $username = $user['username'];
    
    if (isset($newPassword) && is_string($newPassword))
    {
        $newPassword = hash('ripemd320', $newPassword);
    }
    else
    {
        return json_encode(new ajaxResponse('Error', 'The new password is invalid'));
    }

    if ($requireCurrentPassword) // this is more secure
    {
        if (isset($password) && is_string($password))
        {
            $password = hash('ripemd320', $password);
        }
        else
        {
            return json_encode(new ajaxResponse('Error', 'The entered current password is invalid'));
        }

        $dbconn->update(($user['temp_user'] == 0 ? '' : 'Temp_') . 'User', "password='$newPassword', first_signin=0", "WHERE username='$username' AND password='$password'");
    }
    elseif (isset($_SESSION['user'])) // require a user to be logged in when current password is not required
    {
        $dbconn->update(($user['temp_user'] == 0 ? '' : 'Temp_') . 'User', "password='$newPassword', first_signin=0", "WHERE username='$username'");
    }
    else
    {
        // FORBIDDEN
        return json_encode(new ajaxResponse('Error', 'Password can only be changed when signed in'));
    }

    return json_encode(new ajaxResponse('Success', 'Password successfully updated!<br><br>You will now be signed out of your session.'));
}

function resetPassword(DatabaseConnection $dbconn)
{
    if (isset($_POST['username']))
    {
        $user = fetchUser($dbconn, $_POST['username'])[0];
        $isTempUser = ($user['temp_user'] || $user['temp_user'] != 0);

        $dbconn->update(($isTempUser ? 'Temp_' : '') . 'User', 'first_signin=TRUE, password="' . hash('ripemd320', '1234') . '"', 'WHERE username="' . $user['username'] . '"');

        if (is_null($dbconn->lastException))
        {
            logAction('mpasis', ($isTempUser ? 19 : 13), array(
                ($_SESSION['user']['is_temporary_user'] ? 'temp_' : '') . 'username'=>$_SESSION['user']['username'],
                ($isTempUser ? 'temp_' : '') . 'username_op'=>$user['username']
            ));
            return json_encode(new ajaxResponse('Success', $user['username'] . '\'s password has been successfully reset'));
        }
        else
        {
            return json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr));
        }
    }
}
?>