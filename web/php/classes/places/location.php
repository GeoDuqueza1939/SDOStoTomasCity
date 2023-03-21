<?php
$baseDir = '/var/www/html';
require_once("$baseDir/php/classes/dbObject.php");

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
?>