<?php
require_once(__FILE_ROOT__ . '/php/classes/dbObject.php');

class Institution extends dbObject
{
    private const INSTITUTIONTABLE = 'Institution';

    protected $id = -1; // PRIMARY KEY (auto-increment; can't be changed in DB)
    private $name = null;
    private ?Institution $umbrellaInstitution = null;
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
        $this->name = null;
        $this->umbrellaInstitution = null;
        $this->address = null;
    }

    public function add($institutionName = null): mixed
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked)
        {
            if (!is_null($institutionName) && $institutionName != '')
            {
                $this->id = $this->dbconn->insert(self::INSTITUTIONTABLE, 'text', "'$institutionName'");
    
                if (is_null($this->dbconn->lastException) && $this->id > 0)
                {
                    $this->retrieve($this->id);
                }
                else
                {
                    $this->id = -1;
                }
            }
            else
            {
                throw new Exception("Unable to add an institution with an empty name.", 1);
            }
        }

        return $this->id;
    }

    public function addFromJson($Json): mixed
    {
        $value = json_decode($Json);

        return $this->add(
            trim($value['name'])
        );
    }

    public function retrieve($key): bool
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked && !is_null($key) && $key != '' & $key > 0)
        {
            $this->criteriaStr = "WHERE id = '$key'";

            $dbResults = $this->dbconn->select(self::INSTITUTIONTABLE, "*", $this->criteriaStr);

            if (is_null($this->dbconn->lastException) && is_array($dbResults) && count($dbResults) > 0)
            {
                $this->id = $dbResults[0]['id'];
                $this->name = $dbResults[0]['name'];
                $this->umbrellaInstitution = new Institution($this->dbconn);
                $this->address = new Address($this->dbconn);

                $this->umbrellaInstitution->retrieve($dbResults[0]['umbrella_institutionId']);
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
            $this->dbconn->update(self::INSTITUTIONTABLE, $this->updateStr, $this->criteriaStr);

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
            $this->dbconn->delete(self::INSTITUTIONTABLE, $this->criteriaStr);

            $this->initialize(); // should unlink and reinitialize regardless of the success of deletion

            return is_null($this->dbconn->lastException);
        }

        return false;
    }

    private function setField(&$field, $dbFieldName, $value)
    {
        // DEBUG
        echo "<br>setField in Institution<br>";
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

    public function setInstitutionName($name)
    {
        return $this->setField($this->name, 'name', $name);
    }

    public function setUmbrellaInstitution($institutionId) // should be an institutionId that exists
    {
        $bakUmbrellaInstitution = $this->umbrellaInstitution;

        $this->umbrellaInstitution = new Institution($this->dbconn);
        $this->umbrellaInstitution->retrieve($institutionId);

        if ($this->umbrellaInstitution->getDBObjectStatus() == dbObjectStatus::Linked)
        {
            $this->dbconn->update(self::INSTITUTIONTABLE, "umbrella_institutionId = $institutionId", "WHERE id = $this->id");

            if (is_null($this->dbconn->lastException))
            {
                return true;
            }
        }

        $this->umbrellaInstitution = $bakUmbrellaInstitution;
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
            'name' => $this->name,
            'umbrella_institution' => $this->umbrellaInstitution->to_array(),
            'address' => $this->address->to_array(),
        ];
    }
}
?>
