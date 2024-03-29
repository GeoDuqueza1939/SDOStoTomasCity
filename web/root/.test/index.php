<?php
require_once('../path.php');

function rrmdir($dir) {
    if (is_dir($dir)) {
        $objects = scandir($dir);
        foreach ($objects as $object) {
            if ($object != "." && $object != "..") {
                if (filetype($dir."/".$object) == "dir") rrmdir($dir."/".$object); else unlink($dir."/".$object);
            }
        }
        reset($objects);
        rmdir($dir);
    }
}

function testOther()
{
    $addressText = "Block 19 Lot 15 Phase IV Mt. Claire Village, Sta. Anastacia, Sto. Tomas City, Batangas";
    $locationStr = null;
    preg_match_all("/[\w\-\s\.\d]+/i", $addressText, $locationStr);
    var_dump($locationStr[0]);
    echo("<br>");
    $new = array_map(function ($value) {
        return trim($value);
    }, $locationStr[0]);
    var_dump($new);
    exit;
    
    require_once(__FILE_ROOT__ . '/php/classes/ajaxResponse.php');
    require_once(__FILE_ROOT__ . '/php/classes/db.php');
    require_once(__FILE_ROOT__ . '/sergs/php/db-ddl.php');
    require_once(__FILE_ROOT__ . '/sergs/.php/sergs-classes.php');
    
    // DEBUG
    $dbconn = new DatabaseConnection("mysql", "localhost", "root", "admin", "SDOStoTomas", $ddl);
    $employee = new Employee($dbconn);
    // // // $employee->add("Juan");
    $employee->retrieve('B3129848');
    $employee->setBirthDate('1979-11-29');
    $employee->setMiddleName('Culambo');
    // // var_dump($employee->getParentDBObjectStatus());
    // // var_dump($employee->getDBObjectStatus());
    $employee->save();
    echo($employee->dbconn->lastSQLStr);
    $employee->setEmployeeId('B3129847');
    $employee->setFamilyName('Melor');
    $employee->save();
    echo($employee->dbconn->lastSQLStr);
    $employee->setIsTempId(true);
    $employee->save();
    echo($employee->dbconn->lastSQLStr);
    
    // // echo "<br>In /.test/index.php:<br>";
    echo json_encode($employee);
    
    echo "<br><hr><br>";
    
    $person = new Person($dbconn);
    $person->retrieve(2);
    // $person->setMiddleName('Colambo');
    // $person->setFamilyName('Miller');
    // $person->setBirthDate('1989-11-29');
    // $person->save();
    // var_dump($person->getDBObjectStatus());
    echo json_encode($person);
    
    exit;
    // DEBUG
}

function hashMyPassword()
{   
    require_once(__FILE_ROOT__ . '/php/classes/db.php');
    require_once(__FILE_ROOT__ . '/sergs/php/db-ddl.php');

    $dbconn = new DatabaseConnection("mysql", "localhost", "root", "admin", "SDOStoTomas", $ddl);

    if ($dbconn->testConnect())
    {
        $pass = trim(hash('ripemd320', '1234'));
        $sql = 'UPDATE User SET password="' . $pass . '" WHERE username="GeoTheDuke"';

        $dbconn->executeStatement($sql);

        if (!is_null($dbconn->lastException))
        {
            echo "$pass<br>";
            echo $dbconn->lastException->getMessage();
        }
    }

    $dbconn = null;

    exit;
}

// testOther();
// hashMyPassword();

// rrmdir("C:/XAMPP/htdocs-local/images");
// exit;

require_once(__FILE_ROOT__ . '/php/classes/ajaxResponse.php');
require_once(__FILE_ROOT__ . '/php/classes/db.php');
require_once(__FILE_ROOT__ . '/sergs/php/db-ddl.php');
require_once(__FILE_ROOT__ . '/sergs/.php/sergs-classes.php');
// die();

if (isset($_POST['query']))
{
    $dbconn = new DatabaseConnection("mysql", "localhost", "root", "admin", "SDOStoTomas", $ddl);

    if ($dbconn->testConnect())
    {
        $result = ($_REQUEST["forced"] == "1" ? $dbconn->executeStatement($_REQUEST['query']) : $dbconn->executeQuery($_REQUEST['query']));        

        if (!is_null($dbconn->lastException))
        {
            $result = $dbconn->lastException->getMessage();
        }
        elseif (preg_match("/(INSERT|UPDATE|DELETE|CREATE|ALTER)/i", $_REQUEST['query']) && $_REQUEST["forced"] == "1")
        {
            $result = "Operation completed.";
            // $result = json_encode($dbconn);
        }
    }
    else
    {
        $result = "Invalid query . $dbconn->lastException->getMessage()";
    }

    echo json_encode(new ajaxResponse('Result', json_encode($result)));

    if ($dbconn->isConnected())
    {
        $dbconn->disconnect();
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tester Page</title>
    <script src="../js/ajax.js"></script>
    <!-- <script src="../js/types.js"></script> -->
    <script src="../js/elements.js"></script>
    <style>
        * {
            box-sizing: border-box;
        }

        #tester {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            overflow: auto;
        }

        #query-tester {
            margin-top:-2em;
            max-width: 100%;
        }

        #query {
            width: 30em;
            margin: 0;
            font-size: 1em;
            max-width: 100%;
        }

        #auto-query, [for=auto-query] {
            margin: 0 0 1em;
        }

        #query-result {
            border: 2px inset;
            min-height: 2em;
            width: 30em;
            max-width: 100%;
            max-height: 30em;
            background-color: lightgrey;
            overflow: auto;
            padding: 0.5em;
            font-size: 1em;
        }

        #query-result table {
            border: 1px solid black;
            border-collapse: collapse;
        }

        #query-result table > * > * > * {
            border: 1px solid black;
            padding: 0 0.25em;
        }

        #query-result table th {
            background-color: gray;
            color: white;
            text-shadow: 1px 1px black;
        }

        #query-result table td {
            background-color: white;
        }
    </style>
</head>
<body>
    <div id="tester">
        <div id="query-tester">
            <form method="GET">
                <label for="query">Enter query:</label><br>
                <input type="text" name="query" id="query"><br>
                <button type="button" name="execute-query" id="execute-query" default>Execute</button>
                <button type="button" name="execute-query-forced" id="execute-query-forced" default>Execute (Force)</button>
                <input type="checkbox" name="auto-query" id="auto-query"> <label for="auto-query">Automatic execution</label><br>
                <div name="query-result" id="query-result"></div>
            </form>
        </div>
    </div>
</body>
<script>
"use strict";

function displayResult(response)
{
    var result = null;
    var resultBox = document.getElementById("query-result");

    if (response.type == "Result")
    {
        result = JSON.parse(response.content);
        // console.log(response.content);
        // console.log(result);
        if (result != "Invalid query" && result !==undefined && result !== null && result != "" && Array.isArray(result) && result.length > 0)
        {
            resultBox.innerHTML = "";
            var table = createElementEx(NO_NS, "table", resultBox);
            var el = createElementEx(NO_NS, "tr", createElementEx(NO_NS, "thead", table));
            
            Object.keys(result[0]).forEach((value)=>{
                addText(value, createElementEx(NO_NS, "th", el));
            });
            el = createElementEx(NO_NS, "tbody", table);
            result.forEach(row=>{
                var tr = createElementEx(NO_NS, "tr", el);
                Object.values(row).forEach(value=>{
                    addText(value, createElementEx(NO_NS, "td", tr));
                });
            });
        }
        else
        {
            resultBox.innerHTML = result;
        }
    }
    else
    {
        resultBox.innerHTML = "NO RESULTS FOUND";
    }
}

function executeQuery(event) {
    var query = document.getElementById("query").value;

    postData("index.php", "query=" + query + "&forced=" + (event.target == document.getElementById("execute-query-forced") ? "1" : "0"), function() {
        var response;
        var result;
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(this.responseText);

            displayResult(response);
        }

    });
}

document.getElementById("query").addEventListener("keyup", function(event) {
    if (document.getElementById("auto-query").checked)
    {
        executeQuery(event);
    }
});

document.getElementById("execute-query").addEventListener("click", executeQuery);
document.getElementById("execute-query-forced").addEventListener("click", executeQuery);

document.getElementById("auto-query").addEventListener("change", ()=>{
    document.getElementById("execute-query").disabled = document.getElementById("auto-query").checked;
});

<?php
if (isset($_GET['query']))
{
    $dbconn = new DatabaseConnection("mysql", "localhost", "root", "admin", "SDOStoTomas", $ddl);

    if ($dbconn->testConnect())
    {
        $result = $dbconn->executeQuery($_REQUEST['query']);
        
        if (!is_null($dbconn->lastException))
        {
            $result = $dbconn->lastException->getMessage();
        }
    }
    else
    {
        $result = "Invalid query . $dbconn->lastException->getMessage()";
    }

    echo "
        document.getElementById('query').value = '" . $_REQUEST['query'] . "';
        displayResult(". json_encode(new ajaxResponse('Result', json_encode($result))) .");
    ";

    if ($dbconn->isConnected())
    {
        $dbconn->disconnect();
    }
    // exit;
}
?>
</script>
</html>