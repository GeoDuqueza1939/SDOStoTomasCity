<?php
require_once(__FILE_ROOT__ . '/php/classes/dbObject.php');

class Workplace extends dbObject
{
    private const WORKPLACETABLE = 'Workplace';

    protected $id = -1; // PRIMARY KEY (auto-increment; can't be changed in DB)
    private ?Institution $institution = null;
    private ?Address $address = null;

    public function __construct($dbconn)
    {
        $this->dbconn = $dbconn;
        $this->setDBObjectStatus(dbObjectStatus::Unlinked);
        $this->criteriaStr = "WHERE id = '$this->id'";
    }

    protected function initialize()
    {
        $this->criteriaStr = '';
        $this->updateStr = '';
    
        $this->id = -1;
        $this->institution = null;
        $this->address = null;
    }

    public function add($institutionId = null): mixed
    {
        
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked)
        {
            // retrieve a workplace with the same institution id
            $dbResults = $this->dbconn->select(self::WORKPLACETABLE, '*', "WHERE institutionId = $institutionId");

            if (is_null($this->dbconn->lastException) && is_array($dbResults) && count($dbResults) > 0)
            {
                $this->retrieve($dbResults[0]['id']);
            }
            else // if none is retrieved, add a new workplace with the institution id
            {
                $this->institution = new Institution($this->dbconn);
                $this->institution->retrieve($institutionId);

                $this->id = $this->dbconn->insert(self::WORKPLACETABLE, '(institutionId)', "('$institutionId')");

                $this->retrieve($this->id);
            }

            if ($this->id <= 0)
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
            $value['institutionId']
        );
    }

    public function retrieve($key): bool
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked && !is_null($key) && $key != '' & $key > 0)
        {
            $this->criteriaStr = "WHERE id = '$key'";

            $dbResults = $this->dbconn->select(self::WORKPLACETABLE, '*', $this->criteriaStr);

            if (is_null($this->dbconn->lastException) && is_array($dbResults) && count($dbResults) > 0)
            {
                $this->id = $dbResults[0]['id'];
                $this->institution = new Institution($this->dbconn);
                $this->address = new Address($this->dbconn);

                $this->institution->retrieve($dbResults[0]['institutionId']);
                $this->address->retrieve($dbResults[0]['addressId']);

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
            $this->dbconn->update(self::WORKPLACETABLE, $this->updateStr, $this->criteriaStr);

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
            $this->dbconn->delete(self::WORKPLACETABLE, $this->criteriaStr);

            $this->initialize(); // should unlink and reinitialize regardless of the success of deletion

            return is_null($this->dbconn->lastException);
        }

        return false;
    }

    public function setInstitution($institutionId) // should be an institutionId that exists
    {
        $bakInstitution = $this->institution;

        $this->institution = new Institution($this->dbconn);
        $this->institution->retrieve($institutionId);

        if ($this->institution->getDBObjectStatus() == dbObjectStatus::Linked)
        {
            $this->dbconn->update(self::WORKPLACETABLE, "institutionId = $institutionId", "WHERE id = $this->id");

            if (is_null($this->dbconn->lastException))
            {
                return true;
            }
        }

        $this->institution = $bakInstitution;
        return false;
    }

    // REVIEW THE FOLLOWING CODE AND ASCERTAIN WHETHER USING AN ADDRESS ID WOULD BE BETTER
    public function setAddress($addressText) // find a similar address first before adding a new one; if similar address is found, the original address should be deleted if without references
    {
        $bakAddress = $this->address;

        $this->address = new Address($this->dbconn);
        $this->address->add($addressText);

        if ($this->address->getDBObjectStatus() == dbObjectStatus::Linked)
        {
            $bakAddress->delete();

            return ($bakAddress->getDBObjectStatus() == dbObjectStatus::Unlinked);
        }

        return false;
    }

    public function to_array(): array
    {
        return [
            'id' => $this->id,
            'institution' => $this->institution->to_array(),
            'address' => $this->address->to_array()
        ];
    }
}
?>
