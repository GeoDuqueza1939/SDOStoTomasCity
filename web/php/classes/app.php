<?php E_STRICT;

require_once(__FILE_ROOT__ . '/php/classes/db.php');

abstract class App
{
    private $name = '';
    private $dynamic = false;
    protected $dbconns = [];

    abstract public function run();

    protected function setName(string $appName)
    {
        if (is_null($appName) || (is_string($appName) && trim($appName) == ''))
        {
            throw new Exception('App name cannot be null or empty string.');
        }

        $this->name = $appName;
    }

    public function getName()
    {
        return $this->name;
    }

    protected function setDynamic(bool $setting)
    {
        $this->dynamic = $setting;
    }

    public function isDynamic()
    {
        return $this->dynamic;
    }

    protected function addDBConn(DatabaseConnection $dbconn)
    {
        array_push($this->dbconns, $dbconn);
    }

    protected function getDBConn(int $index): ?DatabaseConnection
    {
        return (is_null($this->dbconns) ? null : $this->dbconns[$index]);
    }
}
?>