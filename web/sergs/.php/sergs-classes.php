<?php
$baseDir = '/var/www/html';
require_once("$baseDir/php/db.php");
require_once("$baseDir/sergs/.php/db-ddl.php");

enum dbObjectStatus
{
    case Unlinked; // newly created dbObject; SHOULD NOT ALLOW ANY EDITS TO PRIVATE DATA!!!
    case Linked; // successfully added or retrieved dbObject
    case Edited; // object that has been edited and needs to be saved/updated in database
}

interface dbObjectInterface
{
    public function add() : mixed; // Add to database; return PRIMARY KEY
    public function addFromJson($Json) : mixed; // Add to database from JSON; Useful in extracting data send from clients; return PRIMARY KEY
    public function retrieve($primaryKey) : bool; // Retrieve from database
    public function save() : bool; // Update changes to database
    public function delete() : bool; // Remove from database; AVOID USING THIS!!!
    public function to_array() : array; // Useful in jsonSerialize
}

abstract class dbObject implements JsonSerializable, dbObjectInterface
{
    public ?DatabaseConnection $dbconn = null; // dbObjects shall share one database connection
    private dbObjectStatus $dbObjstatus = dbObjectStatus::Unlinked;
    protected $criteriaStr = ''; // update once the dbObject is linked; USE ONLY FOR DIRECT CHILDREN OF dbObject
    protected $updateStr = ''; // update everytime a field is modified or the dbObject is saved; USE ONLY FOR DIRECT CHILDREN OF dbObject

    protected function initialize()
    {}

    public function getDBObjectStatus() : dbObjectStatus
    {
        return $this->dbObjstatus;
    }

    protected function setDBObjectStatus(dbObjectStatus $status)
    {
        $this->dbObjstatus = $status;
    }

    public function jsonSerialize(): mixed
    {
        return $this->to_array();
    }
}

class Person extends dbObject
{
    private const PERSONTABLE = 'Person';
    private $personCriteriaStr = ''; // update once the dbObject is linked
    private $personUpdateStr = ''; // update everytime a field is modified or the dbObject is saved

    protected $id = -1; // PRIMARY KEY (auto-increment; can't be changed in DB)
    private $givenName = null;
    private $middleName = null;
    private $familyName = null;
    private $spouseName = null;
    private $extName = null;
    private $birthDate = null;
    private $birthPlace = null;

    public function __construct($dbconn)
    {
        $this->dbconn = $dbconn;
        $this->setDBObjectStatus(dbObjectStatus::Unlinked);
        $this->personCriteriaStr = "WHERE id = '$this->id'";
    }

    protected function initialize()
    {
        $this->personCriteriaStr = '';
        $this->personUpdateStr = '';
    
        $this->id = -1;
        $this->givenName = null;
        $this->middleName = null;
        $this->familyName = null;
        $this->spouseName = null;
        $this->extName = null;
        $this->birthDate = null;
        $this->birthPlace = null;

        $this->setDBObjectStatus(dbObjectStatus::Unlinked);
    }

    public function add($givenName = null, $middleName = null, $familyName = null, $spouseName = null, $extName = null) : mixed
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked)
        {
            $fieldStr = '';
            $valueStr = '';

            foreach (['given_name'=>$givenName, 'middle_name'=>$middleName, 'family_name'=>$familyName, 'spouse_name'=>$spouseName, 'ext_name'=>$extName] as $fieldName=>$value)
            {
                if ($value != null && is_string($value) && trim($value) != '')
                {
                    $fieldStr .= ($fieldStr == '' ? '' : ', ') . "$fieldName";
                    $valueStr .= ($valueStr == '' ? '' : ', ') . "\"$value\"";
                }
            }

            if ($fieldStr == '')
            {
                throw new Exception("Unable to add person with no name.", 1);
            }

            $this->id = (int)$this->dbconn->insert(self::PERSONTABLE, "($fieldStr)", "($valueStr)");

            if (is_null($this->dbconn->lastException) && $this->id > 0) // insert to database is successful
            {
                $this->retrieve($this->id); // will also update dbObject status to linked
            }
            else
            {
                $this->id = -1;
            }
        }

        return $this->id;
    }

    public function addFromJson($Json) : mixed
    {
        $value = json_decode($Json);

        return $this->add(
            trim($value['givenName']),
            trim($value['middleName']),
            trim($value['familyName']),
            trim($value['spouseName']),
            trim($value['extName'])
        );
    }

    public function retrieve($key) : bool
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked)
        {
            $this->personCriteriaStr = "WHERE id = '$key'";

            $dbResults = $this->dbconn->select(self::PERSONTABLE, "*", $this->personCriteriaStr);

            if (is_null($this->dbconn->lastException) && is_array($dbResults) && count($dbResults) > 0)
            {
                $this->id = $dbResults[0]['id'];
                $this->givenName = $dbResults[0]['given_name'];
                $this->middleName = $dbResults[0]['middle_name'];
                $this->familyName = $dbResults[0]['family_name'];
                $this->spouseName = $dbResults[0]['spouse_name'];
                $this->extName = $dbResults[0]['ext_name'];
                $this->birthDate = $dbResults[0]['birth_date'];
                $this->birthPlace = $dbResults[0]['birth_place'];
    
                $this->setDBObjectStatus(dbObjectStatus::Linked);
        
                return true;
            }
        }

        return false;
    }

    public function save($resetStatus = true) : bool
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Edited)
        {
            $this->dbconn->update(self::PERSONTABLE, $this->personUpdateStr, $this->personCriteriaStr);

            if (is_null($this->dbconn->lastException)) // no error in DB update
            {
                if ($resetStatus)
                {
                    $this->setDBObjectStatus(dbObjectStatus::Linked);
                    $this->personUpdateStr = ''; // clear update string
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
            $this->dbconn->delete(self::PERSONTABLE, $this->personCriteriaStr);

            $this->initialize(); // should unlink and reinitialize regardless of the success of deletion

            return is_null($this->dbconn->lastException);
        }

        return false;
    }

    private function setField(&$field, $dbFieldName, $value)
    {
        // DEBUG
        echo "<br>setField in Person<br>";
        // DEBUG

        if (($this->getDBObjectStatus() == dbObjectStatus::Linked || $this->getDBObjectStatus() == dbObjectStatus::Edited) && $field != $value)
        {
            $field = $value;

            if ($this->getDBObjectStatus() == dbObjectStatus::Linked)
            {
                $this->setDBObjectStatus(dbObjectStatus::Edited);
                $this->personUpdateStr = ''; // clear update string
            }

            $this->personUpdateStr .= ($this->personUpdateStr == '' ? '' : ', ') . "$dbFieldName='$value'";

            return true;
        }

        return false;
    }

    public function setGivenName($name)
    {
        return $this->setField($this->givenName, 'given_name', $name);
    }

    public function setMiddleName($name)
    {
        return $this->setField($this->middleName, 'middle_name', $name);
    }

    public function setFamilyName($name)
    {
        return $this->setField($this->familyName, 'family_name', $name);
    }

    public function setSpouseName($name)
    {
        return $this->setField($this->spouseName, 'spouse_name', $name);
    }

    public function setExtName($name)
    {
        return $this->setField($this->extName, 'ext_name', $name);
    }

    public function setBirthDate($date) // should be a PHP date object
    {
        return $this->setField($this->birthDate, 'birth_date', $date);
    }

    public function setBirthPlace($address) // TO IMPLEMENT AFTER IMPLEMENTING ADDRESS CLASS
    {}

    public function to_array() : array
    {
        return [
            'id' => $this->id,
            'givenName' => $this->givenName,
            'middleName' => $this->middleName,
            'familyName' => $this->familyName,
            'spouseName' => $this->spouseName,
            'extName' => $this->extName,
            'birthDate' => $this->birthDate,
            'birthPlace' => $this->birthPlace,
        ];
    }

    // public function jsonSerialize() : mixed
    // {
    //     return $this->to_array();
    // }

    public function __destruct()
    {}
}

class Employee extends Person
{
    private const EMPLOYEETABLE = 'Employee';
    private $employeeCriteriaStr = ''; // update once the dbObject is linked
    private $employeeUpdateStr = ''; // update everytime a field is modified or the dbObject is saved

    protected $employeeId = null; // PRIMARY KEY
    private $isTemporaryEmpNo = 1;

    public function __construct($dbconn)
    {   
        parent::__construct($dbconn);
        $this->setDBObjectStatus(dbObjectStatus::Unlinked);
        $this->employeeCriteriaStr = "WHERE employeeId = '$this->employeeId'";
    }

    protected function initialize()
    {
        parent:: initialize();
        
        $this->employeeCriteriaStr = '';
        $this->employeeUpdateStr = '';
        
        $this->employeeId = null;
        $this->isTemporaryEmpNo = 1;
        
        $this->setDBObjectStatus(dbObjectStatus::Unlinked);
    }
    
    public function add($employeeId = null, $givenName = null, $middleName = null, $familyName = null, $spouseName = null, $extName = null) : mixed
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked && !is_null($employeeId))
        {
            if ($employeeId == null || trim($employeeId) == '')
            {
                throw new Exception("Unable to add an employee without an employee ID.", 1);
            }

            parent::add($givenName, $middleName, $familyName, $spouseName, $extName);
            
            if ($this->id > 0) // person details is added
            {
                $this->employeeId = $this->dbconn->insert(self::EMPLOYEETABLE, "(employeeId, personId)", "('$employeeId', '$this->id')");
            }
            
            if (is_null($this->dbconn->lastException) && !is_null($this->employeeId)) // insert to database is successful
            {
                $this->retrieve($this->employeeId);
            }
            // else
            // {
                // $this->employeeId = null; // IS THIS EVEN NECESSARY?
            // }            
        }
        
        return $this->employeeId;
    }
    
    public function addFromJson($Json) : mixed
    {
        $value = json_decode($Json);

        return $this->add(
            trim($value['employeeId']),
            trim($value['person']['givenName']),
            trim($value['person']['middleName']),
            trim($value['person']['familyName']),
            trim($value['person']['spouseName']),
            trim($value['person']['extName'])
        );
    }
    
    public function retrieve($key): bool
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked)
        {
            $this->employeeCriteriaStr = "WHERE employeeId = '$key'";

            $dbResults = $this->dbconn->select(self::EMPLOYEETABLE, "*", $this->employeeCriteriaStr);

            if (is_null($this->dbconn->lastException) && is_array($dbResults) && count($dbResults) > 0)
            {
                if (parent::retrieve($dbResults[0]['personId'])) // will also set dbObject status to linked when successful
                {
                    $this->employeeId = $dbResults[0]['employeeId'];
                    $this->isTemporaryEmpNo = (bool)$dbResults[0]['is_temporary_empno'];
                    
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
            $this->dbconn->update(self::EMPLOYEETABLE, $this->employeeUpdateStr, $this->employeeCriteriaStr);

            if (is_null($this->dbconn->lastException))
            {
                if ($resetStatus)
                {
                    $this->employeeCriteriaStr = "WHERE employeeId = '$this->employeeId'";
                    $this->employeeUpdateStr = ''; // clear the string of field-value pairs in this object

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
            $this->dbconn->delete(self::EMPLOYEETABLE, $this->employeeCriteriaStr);
            
            $this->initialize(); // should unlink and reinitialize regardless of the success of deletion
            
            return is_null($this->dbconn->lastException);
        }
        
        return false;
    }
    
    private function setField(&$field, $dbFieldName, $value)
    {
        // DEBUG
        echo "<br>setField in Employee<br>";
        // DEBUG

        if (($this->getDBObjectStatus() == dbObjectStatus::Linked || $this->getDBObjectStatus() == dbObjectStatus::Edited) && $field != $value)
        {
            $field = $value;

            if ($this->getDBObjectStatus() == dbObjectStatus::Linked)
            {
                $this->setDBObjectStatus(dbObjectStatus::Edited);
                $this->employeeUpdateStr = ''; // clear update string
            }

            $this->employeeUpdateStr .= ($this->employeeUpdateStr == '' ? '' : ', ') . "$dbFieldName='$value'";

            return true;
        }
        
        return false;
    }
    
    public function setEmployeeId($employeeId) // update PRIMARY KEY
    {
        return $this->setField($this->employeeId, 'employeeId', $employeeId);
    }
    
    public function setIsTempId($isTemp)
    {
        return $this->setField($this->isTemporaryEmpNo, 'is_temporary_empno', (int)$isTemp);
    }
    
    public function to_array() : array
    {
        return [
            'employeeId' => $this->employeeId,
            'isTemporaryEmpNo' => $this->isTemporaryEmpNo,
            'person' => parent::to_array()
        ];
    }
}

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

class MapCoordinates
{
    public ?float $latitude = null;
    public ?float $longitude = null;
}

class Location extends dbObject
{
    private const LOCATIONTABLE = 'Location';

    protected $id = -1; // PRIMARY KEY (auto-increment; can't be changed in DB)
    private $name = null;
    private $typeIndex = 0;
    private ?MapCoordinates $coordinates = null;
    private $broadLocation = [];

    public function __construct($dbconn)
    {
        $this->dbconn = $dbconn;
        $this->setDBObjectStatus(dbObjectStatus::Unlinked);
        $this->criteriaStr = "WHERE id = '$this->id'";
        $this->coordinates = new MapCoordinates();
    }

    protected function initialize()
    {
        $this->criteriaStr = '';
        $this->updateStr = '';
    
        $this->id = -1;
        $this->name = null;
        $this->typeIndex = 0;
        $this->coordinates = null;
        $this->broadLocation = [];
    }

    public function add($name = null, $typeIndex = 0): mixed
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked)
        {
            $fieldStr = '';
            $valueStr = '';

            foreach (['name'=>$name, 'location_type'=>$typeIndex] as $fieldName=>$value)
            {
                if ($value != null && is_string($value) && trim($value) != '')
                {
                    $fieldStr .= ($fieldStr == '' ? '' : ', ') . "$fieldName";
                    $valueStr .= ($valueStr == '' ? '' : ', ') . "\"$value\"";
                }
            }

            if ($fieldStr == '')
            {
                throw new Exception("Unable to add location with no name.", 1);
            }

            $this->id = (int)$this->dbconn->insert(self::LOCATIONTABLE, "($fieldStr)", "($valueStr)");

            if (is_null($this->dbconn->lastException) && $this->id > 0) // insert to database is successful
            {
                $this->retrieve($this->id); // will also update dbObject status to linked
            }
            else
            {
                $this->id = -1;
            }
        }

        return $this->id;
    }

    public function addFromJson($Json): mixed
    {
        $value = json_decode($Json);

        return $this->add(
            trim($value['name']),
            trim($value['location_type'])
        );
    }

    public function retrieve($key, $retrieveBroadLocation = true): bool
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked)
        {
            $this->criteriaStr = "WHERE id = '$key'";

            $dbResults = $this->dbconn->select(self::LOCATIONTABLE, "*", $this->criteriaStr);

            if (is_null($this->dbconn->lastException) && is_array($dbResults) && count($dbResults) > 0)
            {
                $this->id = $dbResults[0]['id'];
                $this->name = $dbResults[0]['name'];
                $this->typeIndex = $dbResults[0]['location_type'];
                $this->coordinates->latitude = $dbResults[0]['latitude'];
                $this->coordinates->longitude = $dbResults[0]['longitude'];
    
                if ($retrieveBroadLocation)
                {
                    $dbResults = $this->dbconn->select('Broad_Location', 'broad_locationId', "WHERE id = '$this->id'");

                    if (is_null($this->dbconn->lastException) && is_array($dbResults) && count($dbResults) > 0)
                    {
                        foreach ($dbResults as $value)
                        {
                            $location = new Location($this->dbconn);
                            $location->retrieve($value);

                            if ($location->getDBObjectStatus() == dbObjectStatus::Linked)
                            {
                                $this->addBroadLocation($location);
                            }
                        }
                    }
                }    

                $this->setDBObjectStatus(dbObjectStatus::Linked);
        
                return true;
            }
        }

        return false;
    }

    public function save($resetStatus = true): bool
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Edited)
        {
            $this->dbconn->update(self::LOCATIONTABLE, $this->updateStr, $this->criteriaStr);

            if (is_null($this->dbconn->lastException)) // no error in DB update
            {
                if ($resetStatus)
                {
                    $this->setDBObjectStatus(dbObjectStatus::Linked);
                    $this->updateStr = ''; // clear update string
                }

                return true;
            }
        }

        return false;
    }

    public function delete(): bool
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Linked)
        {
            $this->dbconn->delete(self::LOCATIONTABLE, $this->criteriaStr);

            $this->initialize(); // should unlink and reinitialize regardless of the success of deletion

            return is_null($this->dbconn->lastException);
        }

        return false;
    }

    private function setField(&$field, $dbFieldName, $value)
    {
        // DEBUG
        echo "<br>setField in Location<br>";
        // DEBUG

        if (($this->getDBObjectStatus() == dbObjectStatus::Linked || $this->getDBObjectStatus() == dbObjectStatus::Edited) && $field != $value)
        {
            $field = $value;

            if ($this->getDBObjectStatus() == dbObjectStatus::Linked)
            {
                $this->setDBObjectStatus(dbObjectStatus::Edited);
                $this->updateStr = ''; // clear update string
            }

            $this->updateStr .= ($this->updateStr == '' ? '' : ', ') . "$dbFieldName='$value'";

            return true;
        }

        return false;
    }

    public function setLocationName($locationName)
    {
        return $this->setField($this->name, 'name', $locationName);
    }

    public function setLocationType($typeIndex)
    {
        return $this->setField($this->typeIndex, 'location_type', $typeIndex);
    }

    public function setLatitude($latitude)
    {
        if (is_null($this->coordinates))
        {
            $this->coordinates = new MapCoordinates();
        }

        return $this->setField($this->coordinates->latitude, 'latitude', $latitude);
    }

    public function setLongitude($longitude)
    {
        if (is_null($this->coordinates))
        {
            $this->coordinates = new MapCoordinates();
        }

        return $this->setField($this->coordinates->longitude, 'longitude', $longitude);
    }

    public function addBroadLocation($location) // $location is a Location object
    {
        array_push($this->broadLocation, $location);
    }

    public function to_array(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'latitude' => $this->coordinates->latitude,
            'longitude' => $this->coordinates->longitude
        ];
    }
}

class Address extends dbObject
{
    private const ADDRESSTABLE = 'Address';

    protected $id = -1; // PRIMARY KEY (auto-increment; can't be changed in DB)
    private ?string $addressText = null;
    private array $location = [];
    public bool $includeProvince = true;
    public bool $includeCountry = false;

    public function __construct($dbconn)
    {
        $this->dbconn = $dbconn;
        $this->setDBObjectStatus(dbObjectStatus::Unlinked);
        $this->criteriaStr = "WHERE id = '$this->id'";
    }

    public function initialize()
    {
        $this->criteriaStr = '';
        $this->updateStr = '';
    
        $this->id = -1;
        $this->addressText = null;
        $this->location = [];
    }

    public function add($addressText = null): mixed
    {
        // store addressText into database and get id

        // split $addressText into segments using commas as separators

        // search database for locations that match the segments

            // if a location is found, add it to the $location array member

            // if location is not found, create a new location using the name

        // add an address-location pairing for each location found or created

        // retrieve the address entry, the address-location pairings, and the locations paired

    }

    public function addFromJson($Json): mixed
    {
        $value = json_decode($Json);

        return $this->add(
            trim($value['text'])
        );
    }

    public function retrieve($primaryKey): bool
    {
        return false;
    }

    public function save(): bool
    {
        return false;
    }

    public function delete(): bool
    {
        return false;
    }

    public function to_array(): array
    {
        return [];
    }

    private function sortLocations() // sort location from smallest unit to largest unit
    {}

    public function to_string($rawText = false): string // $rawText pertains to the address text initially inputted.
    {
        return '';
    }
}

class Institution
{}

class Workplace
{}

class Appointment
{}

class Leave
{}

class TermOfService
{}
?>