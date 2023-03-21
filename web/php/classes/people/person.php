<?php
$baseDir = '/var/www/html';
require_once("$baseDir/php/classes/dbObject.php");

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
?>