<?php
include_once('../php/ajaxResponse.php');
include_once('db.php');

if (isset($_REQUEST['query']))
{
    $servername = 'localhost';
	$dbname = 'SDOStoTomas';
	$dbuser = 'root';
	$dbpass = 'admin';

	try
    {
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $dbuser, $dbpass);

		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch (PDOException $e)
    {
		die("Connection failed: " . $e->getMessage());
	}

    try {
        $sql = $conn->prepare($_REQUEST['query']);
        
        $sql->execute();
        
        $sql->setFetchMode(PDO::FETCH_ASSOC);

        $result = $sql->fetchAll();
    }
    catch (PDOException $e)
    {
        $result = 'Invalid query';
    }
    finally {
        echo json_encode(new ajaxResponse('Result', json_encode($result)));
        exit;
    }

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
            max-width: 100%;
        }

        #query {
            width: 30em;
            margin: 0.5em 0 1em;
            font-size: 1em;
            max-width: 100%;
        }

        #query-result {
            border: 2px inset;
            min-height: 2em;
            width: 30em;
            max-width: 100%;
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
        }
    </style>
</head>
<body>
    <div id="tester">
        <div id="query-tester">
            <form action="self" method="GET">
                <label for="query">Enter query:</label><br>
                <input type="text" name="query" id="query"><br>
                <div name="query-result" id="query-result">

                </div>
            </form>
        </div>
    </div>
</body>
<script>
"use strict";

document.getElementById("query").addEventListener("keyup", function(event) {
    var query = this.value;
    var resultBox = document.getElementById("query-result");
    
    postData("index.php", "query=" + query, function() {
        var response;
        var result;
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(this.responseText);

            if (response.type == "Result")
            {
                result = JSON.parse(response.content);
                // console.log(response.content);
                // console.log(result);
                if (result != "Invalid query" && result !==undefined && result !== null && result != "")
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

    });


    // resultBox.innerHTML = ;
});
</script>
</html>