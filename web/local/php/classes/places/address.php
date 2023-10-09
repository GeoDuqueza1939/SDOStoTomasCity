<?php
require_once(__FILE_ROOT__ . '/php/classes/dbObject.php');
require_once(__FILE_ROOT__ . '/php/classes/places/location.php');

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

    protected function initialize()
    {
        $this->criteriaStr = '';
        $this->updateStr = '';
    
        $this->id = -1;
        $this->addressText = null;
        $this->location = [];
    }

    public function add($addressText = null, $storeAll = false): mixed
    {
        $dbResults = $this->dbconn->select(self::ADDRESSTABLE, '*', "WHERE text = '$addressText'");
        if (is_array($dbResults) && count($dbResults) > 0)
        {
            $this->retrieve($dbResults[0]['id']);
        }

        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked)
        {
            // store addressText into database and get id
            $this->id = $this->dbconn->insert(self::ADDRESSTABLE, 'text', "'$addressText'");

            if (is_null($this->dbconn->lastException) && $this->id > 0)
            {
                // split $addressText into segments using commas as separators
                $locationStrs = null;
                preg_match_all("/[\w\-\s\.\d]+/i", $addressText, $locationStrs);

                $locationStrs = array_map(function ($value) { return trim($value); }, $locationStrs[0]);
                
                // search database for locations that match the segments
                foreach($locationStrs as $locationStr)
                {
                    $newLocation = null;

                    $dbResults = $this->dbconn->select('Location', '*', "WHERE name = '$locationStr'");

                    if (is_null($this->dbconn->lastException) && is_array($dbResults))
                    {
                        if (count($dbResults) > 0)
                        {
                            // if a location is found, add it to the $location array member
                            $newLocation = new Location($this->dbconn);
                            $newLocation->retrieve($dbResults[0]['id'], false);
                            if ($newLocation->getDBObjectStatus() == dbObjectStatus::Linked)
                            {
                                array_push($this->location, $newLocation);
                            }
                        }
                        elseif ($storeAll)
                        {
                            // if location is not found, create a new location using the name
                            $newLocation = new Location($this->dbconn);
                            $newLocation->add($locationStr);
                            if ($newLocation->getDBObjectStatus() == dbObjectStatus::Linked)
                            {
                                array_push($this->location, $newLocation);
                            }
                        }
                        
                        if (!is_null($newLocation))
                        {
                            // add an address-location pairing for each location found or created
                            foreach($this->location as $location)
                            {
                                $locationId = $location->to_array()['id'];
    
                                $this->dbconn->insert('SET_Address_Location', '(addressId, locationId)', "('$this->id', '$locationId')");
                            }
                        }
                    }
                    else
                    {
                        // do nothing; these are merely related locations anyway
                    }
                }
                
                // retrieve the address entry, the address-location pairings, and the locations paired
                $this->retrieve($this->id);
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
            trim($value['text'])
        );
    }

    public function retrieve($key): bool
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Unlinked)
        {
            $this->criteriaStr = "WHERE id = '$key'";

            $fromStr = '(SELECT Address.id AS id, text, locationId FROM Address INNER JOIN SET_Address_Location ON Address.id = SET_Address_Location.addressId) as AddressSet INNER JOIN Location ON AddressSet.locationId = Location.id';

            $fieldStr = 'AddressSet.id as id, text, locationId, name, location_type, latitude, longitude';

            $dbResults = $this->dbconn->select($fromStr, $fieldStr, $this->criteriaStr);

            if (is_null($this->dbconn->lastException) && is_array($dbResults) && count($dbResults) > 0)
            {
                $this->id = $dbResults[0]['id'];
                $this->addressText = $dbResults[0]['text'];
                foreach($dbResults as $dbResult)
                {
                    $newLocation = new Location($this->dbconn);
                    $newLocation->retrieve($dbResult['locationId'], false);
                    array_push($this->location, $newLocation);
                }

                $this->sortLocations();

                return true;
            }
        }

        return false;
    }

    public function save($resetStatus = true): bool
    {
        if ($this->getDBObjectStatus() == dbObjectStatus::Edited)
        {
            $this->dbconn->update(self::ADDRESSTABLE, $this->updateStr, $this->criteriaStr);

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
            $this->dbconn->delete(self::ADDRESSTABLE, $this->criteriaStr);

            $this->initialize(); // should unlink and reinitialize regardless of the success of deletion

            return is_null($this->dbconn->lastException);
        }

        return false;
    }

    public function setAddress($addressText): bool // TO IMPLEMENT!!!!!!!!!!!!!!!
    {
        return false;
    }

    public function to_array(): array
    {
        return [
            'id' => $this->id,
            'text' => $this->addressText,
            'location' => array_map(function($value) { return $value->to_array(); }, $this->location)
        ];
    }

    private function sortLocations() // sort location from smallest unit to largest unit
    {}

    public function to_string($rawText = false): string // $rawText pertains to the address text initially inputted.
    {
        if ($rawText)
        {
            return $this->addressText;
        }
        else
        {
            $addressText = '';

            $this->sortLocations();

            foreach ($this->location as $location)
            {
                $addressText .= ($addressText == '' ? '' : ', ') . $location->to_array()['name'];
            }
        }
    }
}
?>