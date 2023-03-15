<?php
require('../../php/db.php');
require('db-ddl.php');

interface dbObject
{
    public function add(); // Add to database
    public function addFromJson($Json); // Add to database from JSON; Useful in extracting data send from clients
    public function retrieve($primaryKey); // Retrieve from database
    public function save(); // Update changes to database
    public function delete(); // Remove from database; AVOID USING THIS!!!
}

class Person implements dbObject
{
    private ?DatabaseConnection $dbconn = null;
    private $id = -1;
    private $givenName = '';
    private $middleName = '';
    private $familyName = '';
    private $spouseName = '';
    private $extName = '';

    public function __construct($dbconn)
    {
        $this->dbconn = $dbconn;
    }

    public function add($givenName = '', $middleName = '', $familyName = '', $spouseName = '', $extName = '')
    {
        $table = 'Person';
        $fieldStr = '';
        $valueStr = '';

        foreach (['given_name'=>$givenName, 'middle_name'=>$middleName, 'family_name'=>$familyName, 'spouse_name'=>$spouseName, 'ext_name'=>$extName] as $fieldName=>$value)
        {
            if ($value != '')
            {
                $fieldStr .= ($fieldStr == '' ? '' : ', ') . "$fieldName";
                $valueStr .= ($valueStr == '' ? '' : ', ') . "\"$value\"";
            }
        }

        if ($fieldStr == '')
        {
            throw new Exception("Unable to add person with no name.", 1);
        }

        $this->id = (int)$this->dbconn->insert($table, "($fieldStr)", "($valueStr)");

        if ($this->id > 0) // insert to database is successful
        {
            $this->givenName = $givenName;
            $this->middleName = $middleName;
            $this->familyName = $familyName;
            $this->spouseName = $spouseName;
            $this->extName = $extName;
        }

        return $this->id;
    }

    public function addFromJson($Json)
    {
        $value = json_decode($Json);

        return $this->add(trim($value['givenName']), trim($value['middleName']), trim($value['familyName']), trim($value['spouseName']), trim($value['extName']));
    }

    public function retrieve($id)
    {}

    public function save()
    {}

    public function delete()
    {}

    public function setGivenName()
    {}

    public function setMiddleName()
    {}

    public function setFamilyName()
    {}

    public function setSpouseName()
    {}

    public function setExtName()
    {}

    public function __destruct()
    {}
}

class Employee extends Person
{}

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