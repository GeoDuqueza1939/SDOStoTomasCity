<?php
function returnConnection()
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
		die("Connection failed: " . $e->getMessage());
	}
	// if ($conn->connect_error)
	// 	die(json_encode(new ajaxResponse('Error', 'Connection failed: ' . $conn->connect_error)));

    return $conn;
}

class DatabaseConnection
{
	private $conn = null;
	private $dbtype = "";
	private $servername = "";
	private $username = "";
	private $password = "";
	private $dbname = "";
	public $lastException = null;
	private $lastConnStr = "";
	private $lastSQLStr = "";
	private $lastInsertId = -1;

	public function __construct($dbtype, $servername, $username, $password, $dbname)
	{
		$this->dbtype = $dbtype;
		$this->servername = $servername;
		$this->username = $username;
		$this->password = $password;
		$this->dbname = $dbname;

		if ($this->dbExists())
		{
			// CHECK IF ALL TABLES EXIST
		}
		elseif ($this->dbServerExists())
		{
			$this->constructDB();
			$this->constructTables();
		}
		else
		{
			$this->lastException = new Exception("Can't connect to database server.");
		}
	}

	private function connectToStr($connStr)
	{
		if ($this->isConnected())
		{
			$this->lastException = new Exception("Connection already exists.");

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

	public function connect()
	{
		$connStr = "$this->dbtype:";

		switch ($this->dbtype)
		{
			case "mysql":
				$connStr .= "host=$this->servername;dbname=$this->dbname";

				break;
			case "sqlite":
				$connStr .= "$this->dbname";
				break;
			default:
				return false;
		}

		return $this->connectToStr($connStr);
	}

	public function connectToServer() // won't connect to database; useful for creating database on the fly
	{
		if ($this->dbtype == "mysql")
		{
			$connStr = "mysql:host=$this->servername";

			return $this->connectToStr($connStr);
		}

		return false;
	}

	public function testConnect()
	{
		$test = $this->connect();
		$this->disconnect();
		return $test;
	}

	public function disconnect()
	{
		$this->clearLastException();
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
			// CREATE DB HERE; ADD ANY NECESSARY EXCEPTIONS
		}
		else
		{
			$this->lastException = new Exception("Can't construct database.");
		}
	}

	private function constructTables()
	{
		if ($this->connect())
		{
			// CREATE TABLES HERE; ADD ANY NECESSARY EXCEPTIONS
			// $this->lastException = new Exception("Problems were encountered during table creation.");
		}
		else
		{
			$this->lastException = new Exception("Can't create tables.");
		}
	}

	public function select($table, $fieldStr, $criteriaStr)
	{
		return $this->executeQuery("SELECT $fieldStr FROM $table" . ($criteriaStr == "" ? "" : " $criteriaStr"));
	}

	public function insert($table, $fieldStr, $valueStr)
	{	
		return $this->executeStatement("INSERT INTO $table ($fieldStr) VALUES ($valueStr)");
	}

	public function update($table, $fieldValueStr, $criteriaStr)
	{
		return $this->executeStatement("UPDATE $table SET $fieldValueStr" . ($criteriaStr == "" ? "" : " $criteriaStr"));
	}

	public function delete($table, $criteriaStr)
	{
		return $this->executeStatement("DELETE FROM $table" . ($criteriaStr == "" ? "" : " $criteriaStr"));
	}

	public function executeQuery($sql) // SHOULD BE USED ONLY FOR COMPLEX SELECT STATEMENTS
	{
		if (preg_match("/(INSERT|UPDATE|DELETE|CREATE)/i", $sql))
		{
			$this->lastException = new Exception("Operation not allowed.");
			return null; // do nothing for non-select statements
		}
		else
		{
			try
			{
				$this->connect();

				$query = $this->conn->prepare($sql);
				$query->execute();
				$query->setFetchMode(PDO::FETCH_ASSOC);

				$results = $query->fetchAll();

				$this->clearLastException();
			}
			catch (PDOException $e)
			{
				$this->lastException = $e;

				$results = null;
			}
			finally
			{
				$this->disconnect();

				return $results;
			}
		}
	}

	public function executeStatement($sql)
	{
		try
		{
			$query = $this->conn->prepare($sql);
			$query->execute(); // VERIFY IF CORRECT CODE
			$query->setFetchMode(PDO::FETCH_ASSOC);

			$results = $query->fetchAll();

			$this->clearLastException();
		}
		catch (PDOException $e)
		{
			$this->lastException = $e;

			$results = null;
		}
		finally
		{
			$this->disconnect();

			return $results;
		}
	}

	private function clearLastException()
	{
		$this->lastException = null;
	}

	public function __destruct()
	{
		$this->disconnect();
	}
}
?>