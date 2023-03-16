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
    public function add(); // Add to database
    public function addFromJson($Json); // Add to database from JSON; Useful in extracting data send from clients
    public function retrieve($primaryKey); // Retrieve from database
    public function save(); // Update changes to database
    public function delete(); // Remove from database; AVOID USING THIS!!!
    public function to_array(); // Useful in jsonSerialize
}

abstract class dbObject implements JsonSerializable, dbObjectInterface
{
    abstract public function getDBObjectStatus() : dbObjectStatus;

    abstract protected function setDBObjectStatus(dbObjectStatus $status);
}

class Person extends dbObject
{
    private dbObjectStatus $dbObjstatus = dbObjectStatus::Unlinked;

    public ?DatabaseConnection $dbconn = null;
    private $table = 'Person';
    private $criteria = ''; // update once the dbObject is linked
    private $fieldValueStr = ''; // update everytime a field is modified or the dbObject is saved

    protected $id = -1; // PRIMARY KEY
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
        $this->dbObjstatus = dbObjectStatus::Unlinked;
        $this->criteria = "WHERE id = '$this->id'";
    }

    public function add($givenName = null, $middleName = null, $familyName = null, $spouseName = null, $extName = null) // should only add if dbObject is unlinked
    {
        if ($this->dbObjstatus == dbObjectStatus::Unlinked)
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
    
            $this->id = (int)$this->dbconn->insert($this->table, "($fieldStr)", "($valueStr)");
    
            if (is_null($this->dbconn->lastException) && $this->id > 0) // insert to database is successful
            {
                $this->retrieve($this->id);
            }
            else
            {
                $this->id = -1;
            }
        }

        return $this->id;
    }

    public function addFromJson($Json)
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

    public function retrieve($id) // should only retrieve if dbObject is unlinked
    {
        if ($this->dbObjstatus == dbObjectStatus::Unlinked)
        {
            $this->criteria = "WHERE id = '$id'";
    
            $dbResults = $this->dbconn->select($this->table, "*", $this->criteria);

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
    
                $this->dbObjstatus = dbObjectStatus::Linked;
        
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    public function save() // should only save/update to database if dbObject is edited
    {
        if ($this->dbObjstatus == dbObjectStatus::Edited)
        {
            $this->dbconn->update($this->table, $this->fieldValueStr, $this->criteria);

            if (is_null($this->dbconn->lastException))
            {
                $this->dbObjstatus = dbObjectStatus::Linked;
                return true;
            }
        }

        return false;
    }

    public function delete() // should only delete from database if dbObject is linked but not edited
    {
        if ($this->dbObjstatus == dbObjectStatus::Linked)
        {
            $this->dbconn->delete($this->table, $this->criteria);

            return is_null($this->dbconn->lastException);
        }
        else
        {
            return false;
        }
    }

    protected function setField(&$field, $value)
    {
        if ($this->dbObjstatus == dbObjectStatus::Linked || $this->dbObjstatus == dbObjectStatus::Edited)
        {
            $field = $value;

            $this->dbObjstatus = dbObjectStatus::Edited;

            return true;
        }

        return false;
    }

    public function setGivenName($name)
    {
        if ($this->setField($this->givenName, $name))
        {
            $this->fieldValueStr .= ($this->fieldValueStr == '' ? '' : ', ') . "given_name='$name'";

            return true;
        }

        return false;
    }

    public function setMiddleName($name)
    {
        if ($this->setField($this->middleName, $name))
        {
            $this->fieldValueStr .= ($this->fieldValueStr == '' ? '' : ', ') . "middle_name='$name'";

            return true;
        }

        return false;
    }

    public function setFamilyName($name)
    {
        if ($this->setField($this->familyName, $name))
        {
            $this->fieldValueStr .= ($this->fieldValueStr == '' ? '' : ', ') . "family_name='$name'";

            return true;
        }

        return false;
    }

    public function setSpouseName($name)
    {
        if ($this->setField($this->spouseName, $name))
        {
            $this->fieldValueStr .= ($this->fieldValueStr == '' ? '' : ', ') . "spouse_name='$name'";

            return true;
        }

        return false;
    }

    public function setExtName($name)
    {
        if ($this->setField($this->extName, $name))
        {
            $this->fieldValueStr .= ($this->fieldValueStr == '' ? '' : ', ') . "ext_name='$name'";

            return true;
        }

        return false;
    }

    public function setBirthDate($date) // should be a PHP date object
    {
        if ($this->setField($this->birthDate, $date))
        {
            $this->fieldValueStr .= ($this->fieldValueStr == '' ? '' : ', ') . "birth_date='$date'";

            return true;
        }

        return false;
    }

    public function setBirthPlace($address) // TO IMPLEMENT AFTER IMPLEMENTING ADDRESS CLASS
    {}

    public function getDBObjectStatus() : dbObjectStatus
    {
        return $this->dbObjstatus;
    }

    protected function setDBObjectStatus(dbObjectStatus $status)
    {
        $this->dbObjstatus = $status;
    }

    public function to_array() // always update when new properties are added
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

    public function jsonSerialize()
    {
        return $this->to_array();
    }

    // protected function self()
    // {
    //     $me = $this;

    //     return $me;
    // }

    public function __destruct()
    {
        // $this->save();
    }
}

class Employee extends Person
{
    private dbObjectStatus $dbObjstatus = dbObjectStatus::Unlinked;

    // private ?DatabaseConnection $dbconn = null;
    private $table = 'Employee';
    private $criteria = ''; // update once the dbObject is linked
    private $fieldValueStr = ''; // update everytime a field is modified or the dbObject is saved

    private $employeeId = null;
    private $isTemporaryEmpNo = false;

    public function __construct($dbconn)
    {    
        parent::__construct($dbconn);

        // DEBUG
        echo ("<br>In /sergs/.php/sergs-classes.php:<br>");
        // var_dump();
        // DEBUG
    }

    public function add($employeeId = null, $givenName = null, $middleName = null, $familyName = null, $spouseName = null, $extName = null)
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked && !is_null($employeeId))
        {
            parent::add($givenName, $middleName, $familyName, $spouseName, $extName);
    
            if ($this->id > 0)
            {
                $this->employeeId = $this->dbconn->insert($this->table, "(employeeId)", "($employeeId)");
            }

            if (is_null($this->dbconn->lastException) && !is_null($this->employeeId)) // insert to database is successful
            {
                $this->retrieve($this->employeeId);
            }
            else
            {
                $this->employeeId = null;
            }            
        }

        if (!is_null($this->employeeId))
        {
            $this->setDBObjectStatus(dbObjectStatus::Linked);
        }

        return $this->employeeId;
    }

    public function addFromJson($Json)
    {
        $value = json_decode($Json);

        return $this->add(
            trim($value['employeeId']),
            trim($value['givenName']),
            trim($value['middleName']),
            trim($value['familyName']),
            trim($value['spouseName']),
            trim($value['extName'])
        );
    }

    public function retrieve($empId) // also retrieve person using Person.id
    {        
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked)
        {
            $this->criteria = "WHERE employeeId = '$empId'";

            $dbResults = $this->dbconn->select($this->table, "*", $this->criteria);
            // // DEBUG
            // var_dump($this->dbconn->lastSQLStr);
            // // DEBUG

            $this->setDBObjectStatus(dbObjectStatus::Linked);

            if (is_null($this->dbconn->lastException) && is_array($dbResults) && count($dbResults) > 0)
            {

                // echo("<br>Test:$empId<br>");
                // var_dump(parent::getDBObjectStatus());
                // var_dump($this->getDBObjectStatus());
                // var_dump($dbResults);
                // echo($this->dbconn->lastSQLStr);
                
                if (parent::retrieve($dbResults[0]['personId']))
                {
                    $this->employeeId = $dbResults[0]['employeeId'];
                    $this->isTemporaryEmpNo = (bool)$dbResults[0]['is_temporary_empno'];
                    
                    return true;
                }
                else
                {
                    return false;
                }
            }    
        }
        else
        {
            return false;
        }
    }

    public function save()
    {
        // var_dump($this->getDBObjectStatus());
        // var_dump(parent::getDBObjectStatus());
        
        if ($this->getDBObjectStatus() == dbObjectStatus::Edited || parent::getDBObjectStatus() == dbObjectStatus::Edited)
        {
            if (parent::getDBObjectStatus() == dbObjectStatus::Edited)
            {
                echo("<br>Saving parent...<br>");
                if (!parent::save())
                {
                    echo("<br>Parent not saved!<br>");
                    return false;
                }
                
                echo("<br>Parent saved!<br>");
            }
            
            echo("<br>Preparing to save child...<br>");
            if ($this->getDBObjectStatus() == dbObjectStatus::Edited)
            {
                echo("<br>Saving child...<br>");
                $this->dbconn->update($this->table, $this->fieldValueStr, $this->criteria);
            }
            
            if (is_null($this->dbconn->lastException))
            {
                echo("<br>Child saved!<br>");
                $this->setDBObjectStatus(dbObjectStatus::Linked);
                return true;
            }
        }
        echo("<br>Child not saved!<br>");

        return false;
    }

    public function setEmployeeId($employeeId)
    {
        if ($this->setField($this->employeeId, $employeeId))
        {
            $this->fieldValueStr .= ($this->fieldValueStr == '' ? '' : ', ') . "employeeId='$employeeId'";
            $this->criteria = "WHERE employeeId = '$employeeId'";
            $this->setDBObjectStatus(dbObjectStatus::Edited);

            return true;
        }

        return false;
    }

    public function setIsTempId($isTemp)
    {
        if ($this->setField($this->isTemporaryEmpNo, $isTemp))
        {
            $this->fieldValueStr .= ($this->fieldValueStr == '' ? '' : ', ') . 'is_temporary_empno="' . (int)$isTemp . '"';
            $this->setDBObjectStatus(dbObjectStatus::Edited);

            return true;
        }

        return false;
    }

    public function getParentDBObjectStatus() : dbObjectStatus
    {
        return parent::getDBObjectStatus();
    }

    public function getDBObjectStatus() : dbObjectStatus
    {
        return $this->dbObjstatus;
    }

    protected function setDBObjectStatus(dbObjectStatus $status)
    {
        $this->dbObjstatus = $status;
    }

    public function to_array()
    {
        return [
            'employeeId' => $this->employeeId,
            'isTemporaryEmpNo' => $this->isTemporaryEmpNo,
            'person' => parent::to_array()
        ];
    }

    // protected function self()
    // {
    //     return $this;
    // }

    // public function getParent()
    // {
    //     return parent::self();
    // }

    public function __destruct()
    {
        // parent::save();
        // $this->save();
    }
}

class User extends Employee
{}

class Location
{}

class Address
{}

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