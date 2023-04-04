<?php
function returnConnection() // KEEP THIS FUNCTION FOR FUTURE USE!!!
{
    $servername = 'localhost';
	$dbname = 'SDOStoTomas';
	$dbuser = 'root';
	$dbpass = 'admin';

	try {
		// $conn = new mysqli($servername, $dbuser, $dbpass, $dbname);
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $dbuser, $dbpass);

		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch (PDOException $e) {
		die('Connection failed: ' . $e->getMessage());
	}
	// if ($conn->connect_error)
	// 	die(json_encode(new ajaxResponse('Error', 'Connection failed: ' . $conn->connect_error)));

    return $conn;
}

class DatabaseConnection
{
	private $conn = null;
	private $dbtype = '';
	private $servername = '';
	private $username = '';
	private $password = '';
	private $dbname = '';
	private $ddl = [];
	public $lastException = null;
	public $lastConnStr = '';
	public $lastSQLStr = '';
	public $lastInsertId = -1;

	public function __construct($dbtype, $servername, $username, $password, $dbname, array $ddl = [])
	{
		$this->dbtype = $dbtype;
		$this->servername = $servername;
		$this->username = $username;
		$this->password = $password;
		$this->dbname = $dbname;

		// print('DBNAME: ' . $this->dbname . '<br><br>');

		$this->setDDL($ddl);
		
		if ($this->dbExists())
		{
			$this->constructTables(); // will create any missing tables
		}
		elseif ($this->dbServerExists())
		{
			$this->constructDB();
			$this->constructTables();
		}
		else
		{
			$this->lastException = new Exception('Can\'t connect to database server.');
		}
	}

	public function setDDL(array $ddlArr)
	{
		$this->ddl = $ddlArr;
	}

	private function connectToStr($connStr)
	{
		// print($connStr . '<br><br>');

		if ($this->isConnected())
		{
			$this->lastException = new Exception('Connection already exists.');

			return false;
		}

		try
		{
			$this->conn = new PDO($connStr, $this->username, $this->password);

			$this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
		catch (PDOException $e)
		{
			$this->lastException = $e;

			return false;
		}

		$this->clearLastException();
		$this->lastConnStr = $connStr;
		
		return true;
	}

	public function connect() // avoid using this manually
	{
		$connStr = "$this->dbtype:";

		switch ($this->dbtype)
		{
			case 'mysql':
				$connStr .= "host=$this->servername;dbname=$this->dbname";
				break;
			case 'sqlite':
				$connStr .= "$this->dbname";
				break;
			default:
				return false;
		}

		return $this->connectToStr($connStr);
	}

	public function connectToServer() // won't connect to database; useful for creating database on the fly; avoid using this manually
	{
		if ($this->dbtype == 'mysql')
		{
			return $this->connectToStr("mysql:host=$this->servername");
		}

		return false;
	}

	public function testConnect()
	{
		$test = $this->connect();
		$this->disconnect();
		return $test;
	}

	public function disconnect($keepException = false)
	{
		if (!$keepException) {
			$this->clearLastException();
		}

		if ($this->isConnected())
		{
			$this->conn = null;
		}
	}

	public function isConnected()
	{
		return (!is_null($this->conn));
	}

	public function dbServerExists()
	{
		$stat = true;
		$backupConn = $this->conn;

		if ($this->connectToServer())
		{
			$this->disconnect();
		}
		else
		{
			$stat = false;
		}

		$this->conn = $backupConn;
		return $stat;
	}

	public function dbExists()
	{
		$stat = true;
		$backupConn = $this->conn;

		if ($this->dbServerExists() && $this->connect())
		{
			$this->disconnect();
		}
		else
		{
			$stat = false;
		}

		$this->conn = $backupConn;
		return $stat;
	}

	private function constructDB()
	{
		if ($this->connectToServer())
		{
			$this->executeStatement("CREATE DATABASE `$this->dbname`");
		}
		else
		{
			$this->lastException = new Exception('Can\'t construct database.');
		}
	}

	private function constructTables()
	{
		if ($this->connectToServer())
		{
			$errMsg = '';
			
			$tables = Array_keys($this->ddl);
			
			foreach ($tables as $table)
			{
				if (!$this->tableExists($table)) {
					$this->executeStatement($this->ddl[$table]);
					
					if (!is_null($this->lastException))
					{
						$errMsg += ($errMsg == '' ? "Problems were encountered during the creation of the following tables: $key" : "; $key");
					}
				}
			}

			if ($errMsg != '')
			{
				$this->lastException = new Exception($errMsg);
			}
		}
		else
		{
			$this->lastException = new Exception('Can\'t create tables.');
		}
	}

	private function tableExists($tableName)
	{
		return count($this->executeStatement("SHOW TABLE STATUS FROM `$this->dbname` WHERE NAME = '$tableName';")) > 0;
	}

	public function select($table, $fieldStr, $criteriaStr)
	{
		$sql = "SELECT $fieldStr FROM `$this->dbname`.`$table`" . ($criteriaStr == '' ? '' : " $criteriaStr") . ';';

		$results = $this->executeQuery($sql);

		// // DEBUG
		// echo "<br>In /php/db.php:<br>";
		// var_dump($results);
		// // DEBUG

		return $results;
	}

	public function insert($table, $fieldStr, $valueStr) // include parentheses for both field list and value lists
	{	
		$this->executeStatement("INSERT INTO `$this->dbname`.`$table` $fieldStr VALUES $valueStr");

		return $this->lastInsertId;
	}

	public function update($table, $fieldValueStr, $criteriaStr)
	{
		return $this->executeStatement("UPDATE `$this->dbname`.`$table` SET $fieldValueStr" . ($criteriaStr == '' ? '' : " $criteriaStr"));
	}

	public function delete($table, $criteriaStr)
	{
		return $this->executeStatement("DELETE FROM `$this->dbname`.`$table`" . ($criteriaStr == '' ? '' : " $criteriaStr"));
	}

	public function executeQuery($sql) // SHOULD BE USED ONLY FOR SELECT STATEMENTS
	{

		if (preg_match('/(INSERT|UPDATE|DELETE|CREATE|ALTER)/i', $sql))
		{
			$this->lastException = new Exception('Operation not allowed.');
			return null; // do nothing for non-select statements
		}
		else
		{
			return $this->executeStatement($sql);
		}
	}

	public function executeStatement($sql)
	{
		$keepException = false;

		try
		{
			$this->connect();

			$query = $this->conn->prepare($sql);
			$query->execute(); // VERIFY IF BEST ALTERNATIVE STATEMENT
			$this->lastInsertId = $this->conn->lastInsertId();
			$query->setFetchMode(PDO::FETCH_ASSOC);

			$results = $query->fetchAll();

			$this->clearLastException();
		}
		catch (PDOException $e)
		{
			$this->lastException = $e;

			$keepException = true;

			$results = null;
		}
		finally
		{
			$this->lastSQLStr = $sql;
			$this->disconnect($keepException);

			return $results;
		}
	}

	public function isForeignKeyCheckOn() // GLOBAL ONLY
	{
		return ($this->executeQuery('SELECT @@GLOBAL.foreign_key_checks;')[0]['@@GLOBAL.foreign_key_checks'] == '1');
	}

	public function disableForeignKeyCheck()
	{
		return $this->setForeignKeyCheck("OFF");
	}

	public function enableForeignKeyCheck()
	{
		return $this->setForeignKeyCheck("ON");
	}

	public function setForeignKeyCheck(string $setting = "ON") // GLOBAL ONLY
	{
		return $this->executeStatement("SET @@GLOBAL.foreign_key_checks=$setting;");
	}

	private function clearLastException()
	{
		$this->lastException = null;
	}

	public function __destruct()
	{
		$this->enableForeignKeyCheck();
		$this->disconnect();
	}

	////// TEMPORARY ONLY!!!!!!
	public function getDBName()
	{
		return $this->dbname;
	}
}
?>