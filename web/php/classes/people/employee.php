<?php
define('__ROOT__', '/home/geovaniduqueza1939/Code/GitHub/SDOStoTomasCity/web');
require_once(__ROOT__ . '/php/classes/people/person.php');

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
?>