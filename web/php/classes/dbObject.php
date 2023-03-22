<?php
define('__ROOT__', '/home/geovaniduqueza1939/Code/GitHub/SDOStoTomasCity/web');
require_once(__ROOT__ . '/php/classes/db.php');

enum dbObjectStatus
{
    case Unlinked; // newly created dbObject; SHOULD NOT ALLOW ANY EDITS TO PRIVATE DATA!!!
    case Linked; // successfully added or retrieved dbObject
    case Edited; // object that has been edited and needs to be saved/updated in database
}

interface dbObjectInterface
{
    public function add() : mixed; // Add to database; return PRIMARY KEY
    public function addFromJson($Json) : mixed; // Add to database from JSON; Useful in extracting data send from clients; return PRIMARY KEY
    public function retrieve($primaryKey) : bool; // Retrieve from database
    public function save() : bool; // Update changes to database
    public function delete() : bool; // Remove from database; AVOID USING THIS!!!
    public function to_array() : array; // Useful in jsonSerialize
}

abstract class dbObject implements JsonSerializable, dbObjectInterface
{
    public ?DatabaseConnection $dbconn = null; // dbObjects shall share one database connection
    private dbObjectStatus $dbObjstatus = dbObjectStatus::Unlinked;
    protected $criteriaStr = ''; // update once the dbObject is linked; USE ONLY FOR DIRECT CHILDREN OF dbObject
    protected $updateStr = ''; // update everytime a field is modified or the dbObject is saved; USE ONLY FOR DIRECT CHILDREN OF dbObject

    protected function initialize()
    {}

    public function getDBObjectStatus() : dbObjectStatus
    {
        return $this->dbObjstatus;
    }

    protected function setDBObjectStatus(dbObjectStatus $status)
    {
        $this->dbObjstatus = $status;
    }

    public function jsonSerialize(): mixed
    {
        return $this->to_array();
    }
}
?>