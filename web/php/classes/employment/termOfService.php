<?php
require_once(__FILE_ROOT__ . '/php/classes/dbObject.php');

class TermOfService extends dbObject
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