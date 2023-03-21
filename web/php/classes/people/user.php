<?php
$baseDir = '/home/geovaniduqueza1939/Code/GitHub/SDOStoTomasCity/web';
require_once("$baseDir/php/classes/people/employee.php");

class AccessLevels
{
    public $sergs = -1;
    public $romas = -1;
}

class User extends Employee
{
    private const USERTABLE = 'User';
    private $userCriteriaStr = ''; // update once the dbObject is linked
    private $userUpdateStr = ''; // update everytime a field is modified or the dbObject is saved

    protected $username = ''; // PRIMARY KEY
    private $password = '';
    private $accessLevels = null;

    public function __construct($dbconn)
    {
        parent::__construct($dbconn);
        $this->setDBObjectStatus(dbObjectStatus::Unlinked);
        $this->userCriteriaStr = "WHERE username = '$this->username'";
    }

    protected function initialize()
    {
        parent::initialize();

        $this->userCriteriaStr = '';
        $this->userUpdateStr = '';
    
        $this->username = null;
        $this->password = null;
        $this->accessLevels = null;
    }

    public function add($username = null, $employeeId = null, $givenName = null, $middleName = null, $familyName = null, $spouseName = null, $extName = null): mixed
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked && !is_null($employeeId))
        {
            if ($username == null || trim($username) == '')
            {
                throw new Exception("Unable to add a user without a username.", 1);
            }

            parent::add($employeeId, $givenName, $middleName, $familyName, $spouseName, $extName);

            if (!is_null($this->employeeId))
            {
                $this->username = $this->dbconn->insert(self::USERTABLE, "(username)", "($username)");
            }

            if (is_null($this->dbconn->lastException) && !is_null($this->username)) // insert to database is successful
            {
                $this->retrieve($this->employeeId);
            }
        }

        return $this->username;
    }

    public function addFromJson($Json): mixed
    {
        $value = json_decode($Json);

        return $this->add(
            trim($value['username']),
            trim($value['employee']['employeeId']),
            trim($value['employee']['person']['givenName']),
            trim($value['employee']['person']['middleName']),
            trim($value['employee']['person']['familyName']),
            trim($value['employee']['person']['spouseName']),
            trim($value['employee']['person']['extName'])
        );
    }

    public function retrieve($key): bool
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked)
        {
            $this->userCriteriaStr = "WHERE employeeId = '$key'";

            $dbResults = $this->dbconn->select(self::USERTABLE, "*", $this->username);

            if (is_null($this->dbconn->lastException) && is_array($dbResults) && count($dbResults) > 0)
            {
                if (parent::retrieve($dbResults[0]['employeeId'])) // will also set dbObject status to linked when successful
                {
                    $this->username = $dbResults[0]['username'];
                    $this->password = $dbResults[0]['password'];

                    $this->accessLevels = new AccessLevels();
                    $this->accessLevels->sergs = (isset($dbResults[0]['sergs_access_level']) && is_numeric($dbResults[0]['sergs_access_level']) && $dbResults[0]['sergs_access_level'] > 0 ? $dbResults[0]['sergs_access_level'] : -1);
                    $this->accessLevels->romas = (isset($dbResults[0]['romas_access_level']) && is_numeric($dbResults[0]['romas_access_level']) && $dbResults[0]['romas_access_level'] > 0 ? $dbResults[0]['romas_access_level'] : -1);
                    
                    return true;
                }
            }
        }

        return false;
    }

    public function save($resetStatus = true): bool
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Edited)
        {
            parent::save(false);

            // may fail in updating, but employee should still push through with updates no matter what
            $this->dbconn->update(self::USERTABLE, $this->userUpdateStr, $this->userCriteriaStr);

            if (is_null($this->dbconn->lastException))
            {
                if ($resetStatus)
                {
                    $this->userCriteriaStr = "WHERE username = '$this->username'";
                    $this->userUpdateStr = ''; // clear the string of field-value pairs in this object

                    $this->setDBObjectStatus(dbObjectStatus::Linked); // should still update this manually
                }

                return true;
            }
        }

        return false;
    }
    
    public function delete() : bool
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Linked)
        {
            $this->dbconn->delete(self::USERTABLE, $this->userCriteriaStr);
            
            $this->initialize(); // should unlink and reinitialize regardless of the success of deletion
            
            return is_null($this->dbconn->lastException);
        }
        
        return false;
    }
    
    private function setField(&$field, $dbFieldName, $value)
    {
        // DEBUG
        echo "<br>setField in User<br>";
        // DEBUG

        if (($this->getDBObjectStatus() == dbObjectStatus::Linked || $this->getDBObjectStatus() == dbObjectStatus::Edited) && $field != $value)
        {
            $field = $value;

            if ($this->getDBObjectStatus() == dbObjectStatus::Linked)
            {
                $this->setDBObjectStatus(dbObjectStatus::Edited);
                $this->userUpdateStr = ''; // clear update string
            }

            $this->userUpdateStr .= ($this->userUpdateStr == '' ? '' : ', ') . "$dbFieldName='$value'";

            return true;
        }
        
        return false;
    }

    public function setUsername($username)
    {
        return $this->setField($this->username, 'username', $username);
    }

    public function setPassword($password)
    {
        return $this->setField($this->password, 'password', $password); // SHOULD BE HASHED IN FULL IMPLENTATION!!!!!!!!!!!!!!!!!!!
    }

    public function setSergsAccessLevel($accessLevel)
    {
        return $this->setField($this->accessLevels->sergs, 'sergs_access_level', $accessLevel);
    }

    public function setRomasAccessLevel($accessLevel)
    {
        return $this->setField($this->accessLevels->romas, 'romas_access_level', $accessLevel);
    }

    public function to_array(): array
    {
        return [
            'username' => $this->username,
            'password' => $this->password,
            'employee' => parent::to_array(),
            'accessLevels' => [
                'sergs_access_level' => $this->accessLevels->sergs,
                'romas_access_level' => $this->accessLevels->romas
            ]
        ];
    }
}
?>