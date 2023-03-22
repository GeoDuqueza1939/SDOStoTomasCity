<?php
define('__ROOT__', '/home/geovaniduqueza1939/Code/GitHub/SDOStoTomasCity/web');
require_once(__ROOT__ . '/php/classes/dbObject.php');

class Appointment extends dbObject
{


    public function add(): mixed
    {}

    public function addFromJson($Json): mixed
    {}

    public function retrieve($key): bool
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
}
?>