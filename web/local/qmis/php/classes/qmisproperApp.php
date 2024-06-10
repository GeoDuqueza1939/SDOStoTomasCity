<?php E_STRICT;

require_once(__FILE_ROOT__ . '/php/classes/app.php');
require_once(__FILE_ROOT__ . '/php/traits/jsmsgdisplay.php');
require_once(__FILE_ROOT__ . '/php/enums/pagetypes.php');
require_once(__FILE_ROOT__ . '/php/audit/log.php');
// require_once(__FILE_ROOT__ . '/php/secure/validateUser.php');
// require_once(__FILE_ROOT__ . '/php/secure/sdp.php');

class ProPER_App extends App
{
    use JsMsgDisplay;
    
    private $enum = array();
    private $jsTailScripts = '';
    private $jsTailScriptCount = 0;
    private $multipleStatus = '';
    protected $error = false;

    public function __construct()
    {
        $this->setName("Process Planner, Encoder, and Reviewer (QMIS-ProPER)");
        $this->setDynamic(true);
        		
        require_once(__FILE_ROOT__ . '/php/secure/dbcreds.php');
		
        $this->addDBConn(new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $ismdbname));
        $this->addDBConn(new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $dbname));

        $this->setupEnums();
    }
    
    private function setupEnums()
    {
        $this->enum['appointmentStatus'] = $this->getDB_SDO()->select('ENUM_Emp_Appointment_Status', '*') ?? [];
        $this->enum['positions'] = $this->getDB_SDO()->select('Position', 'plantilla_item_number, position_title, parenthetical_title, salary_grade, place_of_assignment, filled') ?? [];
        $this->enum['position_titles'] = array_values(array_map(function($row) { return $row['position_title']; }, $this->getDB_SDO()->select('Position', 'position_title', 'GROUP BY position_title') ?? []));
        $this->enum['salaryGrade'] = $this->getDB_SDO()->select('Salary_Table', 'salary_grade, step_increment, salary, effectivity_date'/*, 'WHERE effectivity_date >= "2023-01-01"'*/) ?? [];
    }

    private function writeJSEnums()
    { ?>

<script><?php
        foreach ($this->enum as $key => $value)
        { ?>

SeRGS_App.enum["<?php echo($key); ?>"] = <?php echo(json_encode($value)); ?>;<?php
        } ?>

</script><?php
    }

    private function getDB_ISCreAMS()
    {
        return $this->getDBConn(0);
    }

    private function getDB_SDO()
    {
        return $this->getDBConn(1);
    }

    private function getUserAccessLevel()
    {
        // return (isset($_SESSION['user']) && isset($_SESSION['user']['qmisproper_access_level']) ? $_SESSION['user']['qmisproper_access_level'] : 0);
        return (isset($_SESSION['user']) && isset($_SESSION['user']['qmisproper_access_level']) ? $_SESSION['user']['qmisproper_access_level'] : 10); // ALLOW NO SIGN IN FOR NOW
    }

    private function validateUserSession($requiresSignIn)
    {
        
    }

    private function sendResponse($type, $content) // "Success", "Info", "Error", "Text", "Username", "JSON", "DataRows", "DataRow", "User", "Entries", "Entry", "UI"
    {
        $response = [
            'type'=>$type,
            'content'=>$content
        ];

        echo(json_encode($response));
    }

    public function runAPI()
    {
        $requiresSignIn = false;

        $this->validateUserSession($requiresSignIn);
		
        if (isset($_REQUEST['a']))
        {
            switch ($_REQUEST['a'])
            {
                case 'add':
                    if (isset($_REQUEST['add']))
                    {
                        $this->sendResponse('Error', 'CODE STUB (ACTION: ADD)!!!');
                    }
                    else
                    {
                        $this->sendResponse('Error', 'Nothing to add');
						die();
                    }
                    break;
                case 'update':
                    if (isset($_REQUEST['update']))
                    {
                        switch ($_REQUEST['update'])
                        {
                            case 'pswd':
                                if (isset($_REQUEST['data'])) // CHANGE TO `POST` IN PROD
                                {
                                    $data = json_decode($_REQUEST['data'], true); // CHANGE TO `POST` IN PROD
         
                                    echo(changePassword($this->getDB_SDO(), $data)); // uses old ajaxResponse; CONVERT TO $this->sendResponse() LATER ON
                                    exit();
                                }
                                else
                                {
                                    $this->sendResponse('Error', 'Invalid update request');
									die();
                                }
                                break;
                            case 'user':
                                if (isset($_REQUEST['user']) && isset($_REQUEST['person'])) // CHANGE TO `POST` IN PROD
                                {
                                    echo(updateUser($this->getDB_SDO(), json_decode($_REQUEST['user'], true), json_decode($_REQUEST['person'], true)));
                                    exit();
                                }
								die();
                                break;
                            default:
                                $this->sendResponse('Error', 'Unknown update keyword');
								die();
                                break;
                        }
                    }
                    else
                    {
                        $this->sendResponse('Error', 'Nothing to update');
						die();
                    }
                    break;
                default:
                    $this->sendResponse('Error', 'Unknown action');
					die();
                    break;
            }
        }
        else
        {
            $this->sendResponse('Error', 'Unknown request');
            die();
        }
    }

    public function run($pageId = "dashboard")
    {
        $requiresSignIn = true;
        $pageTitle = $this->getName() . ' | Department of Education | Sto. Tomas City SDO';
        $pageType = PageType::QMISPROPER;
        // $addDebug = false;
        $addDebug = true;

        $this->validateUserSession($requiresSignIn);
?>
<!DOCTYPE html>
<html lang="en">
<?php require_once(__FILE_ROOT__ . '/php/snippets/html_head.php');?>
<script src="<?php echo(__BASE__); ?>/qmis/proper/js/qmisproperApp.js"></script><?php
        if ($pageId !== 'print')
        {
            $this->writeJSEnums();
        } ?>

<body>
<div id="qmis-proper" class="app<?php echo(is_string($pageId) && trim($pageId) !== '' ? " $pageId" : ''); ?>">
<?php
        if ($pageId !== 'print')
        {
            require_once(__FILE_ROOT__ . '/php/snippets/header_full.php'); // general header
            // require_once(__FILE_ROOT__ . '/php/snippets/nav_full.php'); // general nav
?>
    <nav id="navbar">
        <button id="nav-toggle"><span class="material-icons-round">menu</span></button>
        <a id="nav-logo-link" href="https://www.depedstotomascity.com.ph/" title="DepEd-Sto. Tomas City SDO"><img src="<?php echo(__BASE__); ?>/images/logo-depedstotomas.webp" alt="Logo-Department of Education, Sto. Tomas City SDO" id="nav-logo" /></a>
        <ul id="nav">
<?php
    // $ISId = ($pageType === PageType::SERGS ? 2 : ($pageType === PageType::OPMS ? 3 : ($pageType === PageType::MPASIS ? 4 : 1)));
    // $dbResults = $this->getDBConn(0)->select('Nav', '*', "WHERE information_systemId = $ISId AND type = 1 AND parent_nav = 0 ORDER BY nav_index");
    $dbResults = [
        ['nav_text'=>'SDO Services Home', 'url'=>'/', 'nav_index'=>1, 'nav_html_id'=>'sdo-home', 'icon_tag'=>'<span class="material-icons-round">home</span>', 'access_level'=>0, 'nav_children'=>[]],
        ['nav_text'=>'Dashboard', 'url'=>'/qmis/proper/', 'nav_index'=>2, 'nav_html_id'=>'dashboard', 'icon_tag'=>'<span class="material-icons-round">dashboard</span>', 'access_level'=>0, 'nav_children'=>[]],
        ['nav_text'=>'Processes', 'url'=>'/qmis/proper/processes', 'nav_index'=>3, 'nav_html_id'=>'processes', 'icon_tag'=>'<span class="material-symbols-rounded">step</span>', 'access_level'=>0, 'nav_children'=>[
            ['nav_text'=>'Manage Processes', 'url'=>'/qmis/proper/processes', 'nav_index'=>4, 'nav_html_id'=>'processes', 'icon_tag'=>null, 'access_level'=>0, 'nav_children'=>[]],
            ['nav_text'=>'New Process', 'url'=>'/qmis/proper/processes/new', 'nav_index'=>5, 'nav_html_id'=>'new-process', 'icon_tag'=>null, 'access_level'=>0, 'nav_children'=>[]],
        ]],
        ['nav_text'=>'Organizational Units', 'url'=>'/qmis/proper/org_units', 'nav_index'=>6, 'nav_html_id'=>'org-units', 'icon_tag'=>'<span class="material-icons-round">schema</span>', 'access_level'=>0, 'nav_children'=>[]],
        ['nav_text'=>'Processing Staff', 'url'=>'/qmis/proper/proc_staff', 'nav_index'=>7, 'nav_html_id'=>'proc-staff', 'icon_tag'=>'<span class="material-icons-round">supervisor_account</span>', 'access_level'=>0, 'nav_children'=>[]],
        ['nav_text'=>'External Stakeholders', 'url'=>'/qmis/proper/ext_stakeholders', 'nav_index'=>8, 'nav_html_id'=>'ext-stakeholders', 'icon_tag'=>'<span class="material-icons-round">diversity_2</span>', 'access_level'=>0, 'nav_children'=>[]],
    ];
    
    $accessLevel = (isset($_SESSION['user']) && isset($_SESSION['user']['qmisproper_access_level']) ? $_SESSION['user']['qmisproper_access_level'] : 10); // ALLOW NO SIGN IN FOR NOW

    if (is_null($this->getDBConn(0)->lastException))
    {
        foreach($dbResults as $navItem)
        {
            if ($navItem['access_level'] <= $accessLevel)
            {
                // $id = $navItem['nav_itemId'];
                $icon = $navItem['icon_tag'];
                $text = trim($navItem['nav_text']);
                $url = __BASE__ . trim($navItem['url']);
                $navId = trim($navItem['nav_html_id']);
    
                echo('            <li' . (isset($navId) && $navId != '' ? " id=\"$navId\"" : '') . '>');
                echo((isset($url) && $url != '' ? "<a href=\"$url\">" : ''));
                echo("$icon $text");
                echo((isset($url) && $url != '' ? '</a>' : ''));
    
                // $dbResults2 = $this->getDBConn(0)->select('Nav', '*', "WHERE information_systemId = $ISId AND type = 1 AND parent_nav = $id ORDER BY nav_index");
                $dbResults2 = $navItem['nav_children'];

                if (is_null($this->getDBConn(0)->lastException) && count($dbResults2) > 0)
                {
                    echo(" <span class=\"nav-dropdown-icon\">&#xe5cf;</span>\n                <ul>\n");
                    foreach($dbResults2 as $navItem2)
                    {
                        if ($navItem2['access_level'] <= $accessLevel)
                        {
                            // $id = $navItem2['nav_itemId'];
                            $text = trim($navItem2['nav_text']);
                            $url = __BASE__ . trim($navItem2['url']);
                            $navId = trim($navItem2['nav_html_id']);
        
                            echo('                    <li' . (isset($navId) && $navId != '' ? " id=\"$navId\"" : '') . '>');
                            echo((isset($url) && $url != '' ? "<a href=\"$url\">" : ''));
                            echo($text);
                            echo((isset($url) && $url != '' ? '</a>' : ''));
                            echo("</li>\n");
                        }
                    }
                    echo("                </ul>\n            ");
                }
    
                echo("</li>\n");
            }
        }
    }
    else
    {
        // ERROR
        if (!is_null($this->getDBConn(0)->lastException))
            var_dump($this->getDBConn(0)->lastException->getMessage());
		else
			var_dump($this->getDBConn(0)->lastException);
    }
?>
        </ul>
    </nav>
<?php
        }
?>
    <main>
<?php
        if ($this->getUserAccessLevel() > 0)
        {
            switch ($pageId)
            {
                case "dashboard":
                    $this->generateDashboardUI();
                    break;
                case "processes":
                    $this->generateProcessesUI();
                    break;
                case "new-process":
                    $this->generateProcessUI();
                    break;
                case "edit-process":
                    $this->generateProcessUI(1, $_GET['processId']);
                    break;
                case "org-units":
                case "proc-staff":
                case "ext-stakeholders":
                case "print":
                case "account":
                case "my-account":
                case "other-account":
                default:
                    $this->generateTempUI($pageId);
                    break;
            }
        }
        else
        { 
            $this->generateForbidden();
        }
?>

    </main><?php
        if ($pageId !== 'print')
        {
            require_once(__FILE_ROOT__ . '/php/snippets/footer_full.php');
        }

        require_once(__FILE_ROOT__ . '/php/snippets/html_tail.php'); ?>

</div>
</body>
<script>
"use strict";

let app = new SeRGS_App(document.getElementById("sergs"));

var pageRun; // HACK
var loadData; // HACK

if (pageRun !== null && pageRun !== undefined && ElementEx.type(pageRun) === "function")
{
    pageRun(app);
}
[app.getActiveView()].forEach(view=>{
    if (view !== null && view !== undefined)
    {
        // console.log(view);
    }
});
if (loadData !== null && loadData !== undefined && ElementEx.type(loadData) === "function")
{
    loadData();
}
<?php echo($this->jsTailScripts); ?>
</script>
</html>
<?php
    } // function run()

    private function generateDashboardUI()
    {
        $accessLevel = $this->getUserAccessLevel();

        if ($accessLevel < 1)
        {
            $this->generateForbidden();
            return;
        }
        ?>
        <section id="main-dashboard">
            <h2>Dashboard</h2>

            <form id="redir-requests">
                <input type="hidden" name="redir" value="<?php echo(__BASE__); ?>/sergs/requests/">
            </form>
            <form id="redir-new-request">
                <input type="hidden" name="redir" value="<?php echo(__BASE__); ?>/sergs/requests/new_request/">
            </form>
            <form id="redir-request-list">
                <input type="hidden" name="redir" value="<?php echo(__BASE__); ?>/sergs/requests/request_list/">
                <input type="hidden" name="req" value="user">
            </form>
            <form id="redir-my-service-record">
                <input type="hidden" name="redir" value="<?php echo(__BASE__); ?>/sergs/sr/my_service_record/">
            </form>

            <div class="div-ex dashboard-contents">
<?php
        
        if ($accessLevel < 9 && $accessLevel > 1)
        { ?>
                <div class="div-ex dashboard-stats-requests-processed">
                    <h4 class="label-ex">Total Requests Processed <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                    <!-- By me: 0 [<a href="<?php echo(__BASE__); ?>/sergs/requests/">View All</a>]<br> -->
                    By me: 0 <button type="submit" form="redir-requests" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post">View All</button><br>
                    By everyone: 0
                </div>
                
                <div class="div-ex dashboard-stats-average-processing-time">
                    <h4 class="label-ex">My Average Processing Time <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                    Encoding/Updating: 0 minutes<br>
                    Certification: 0 minutes<br>
                    Approval: 0 minutes<br>
                    All: 0 minutes
                </div>
                
                <div class="div-ex dashboard-recent-for-encode">
                    <h4 class="label-ex">Service Record Requests for Encoding/Updating <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                    <div class="dashboard-item-contents">
                        <!-- None to show [<a href="<?php echo(__BASE__); ?>/sergs/requests/new_request/" title="Transact a request">Transact</a>]<br> -->
                        None to show <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Transact a request">Transact</button>
                    </div>
                </div><?php
        }

        if ($accessLevel < 9 && $accessLevel > 2)
        { ?>
                <div class="div-ex dashboard-recent-for-certify">
                    <h4 class="label-ex">Service Record Requests for Certification <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                    <div class="dashboard-item-contents">
                        <!-- None to show [<a href="<?php echo(__BASE__); ?>/sergs/requests/new_request/" title="Transact a request">Transact</a>]<br> -->
                        None to show <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Transact a request">Transact</button>
                    </div>
                </div>
                
                <div class="div-ex dashboard-recent-for-approval">
                    <h4 class="label-ex">Service Record Requests for Approval <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                    <div class="dashboard-item-contents">
                        <!-- None to show [<a href="<?php echo(__BASE__); ?>/sergs/requests/new_request/" title="Transact a request">Transact</a>]<br> -->
                        None to show <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Transact a request">Transact</button>
                    </div>
                </div><?php
        }
        
        if ($accessLevel < 9 && $accessLevel > 1)
        { ?>
                <div class="div-ex dashboard-recent-for-release">
                    <h4 class="label-ex">Service Record Requests for Releasing <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                    <div class="dashboard-item-contents">
                        <!-- None to show [<a href="<?php echo(__BASE__); ?>/sergs/requests/new_request/" title="Transact a request">Transact</a>]<br> -->
                        None to show <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Transact a request">Transact</button>
                    </div>
                </div><?php
        } ?>

                <div class="div-ex dashboard-my-service-record-info">
                    <h4 class="label-ex">My Service Record <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                    <div class="dashboard-item-contents">
                        <!-- Not available [<a href="<?php echo(__BASE__); ?>/sergs/requests/new_request/" title="Request for encoding/updating of my service record">Request</a>]<br> -->
                        Not available <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Request for encoding/updating of my service record">Request</button><br>
                        <!-- Available [<a href="<?php echo(__BASE__); ?>/sergs/sr/my_service_record/" title="View my service record">View</a>] [<a href="<?php echo(__BASE__); ?>/sergs/requests/new_request/" title="Request for a service record update">Update</a>]<br> -->
                        <!-- Available <button type="submit" form="redir-my-service-record" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="View my service record">View</button> <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Request for a service record update">Update</button> -->
                    </div>
                </div>

                <div class="div-ex dashboard-my-requests-history">
                    <h4 class="label-ex">My Requests History <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                    <div class="dashboard-item-contents">
                        <!-- None to show [<a href="<?php echo(__BASE__); ?>/sergs/requests/new_request/">Transact</a>]<br> -->
                        None to show
                        <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Request encoding/updating of Service Record">Request</button>
                        <button type="submit" form="redir-request-list" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="View my requests">View</button>
                    </div>
                </div>
            </div>
        </section><?php
    }

    private function generateProcessesUI()
    {
        $accessLevel = $this->getUserAccessLevel();

        if ($accessLevel < 1)
        {
            $this->generateForbidden();
            return;
        }

        ?>
        <section id="main-processes">
            <h2>Processes</h2>
            <form id="processes-form" name="processes-form">
                <span class="button-group-ex span-ex"><span class="button-ex" title="Add new process"><button type="submit" id="new-process" name="new-process" title="Add new process" form="processes-form" formmethod="post" formaction="<?php echo(__BASE__); ?>/qmis/proper/processes/new/">New</button></span> <span class="button-ex" title="Import a process from CSV file"><button type="button" id="import-process" title="Import a process from CSV file" form="processes-form">Import</button></span> <span class="button-ex" title="Manage processes"><button type="button" id="manage-processes" title="Manage processes" form="processes-form">Manage</button></span></span>
            </form>
            <div class="table-ex">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Owners/Handlers</th>
                            <th>Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="4">Nothing to show</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
<?php
    }

    private function generateProcessUI($mode = 0, $processId = null)
    {
        $accessLevel = $this->getUserAccessLevel();

        if ($accessLevel < 1)
        {
            $this->generateForbidden();
            return;
        }

        ?>
        <section id="main-process">
            <h2><?php echo($mode === 0 ? 'New Process' : 'Process Details'); ?></h2>
            <?php
                if ($mode === 0)
                { ?>
            <form class="data-form-ex">
                <span class="textbox-ex"><label for="process_name">Process Name:</label> <input id="process_name" name="process_name" type="text"></span><br>
                <span class="textbox-ex"><label for="process_owner">Process Name:</label> <input id="process_name" name="process_owner" type="text"></span><br>
            </form>
                <?php
                }
                else
                { ?>
            <div class="display-ex">
                <span class="textbox-ex"><label for="process_name">Process Name:</label> <input id="process_name" name="process_name" type="text"></span><br>
                <span class="textbox-ex"><label for="process_owner">Process Name:</label> <input id="process_name" name="process_owner" type="text"></span><br>
            </div><?php 
                } ?>
            <span class="button-group-ex span-ex"><span class="button-ex" title="Add new procedure"><button type="button" id="new-procedure" title="Add new procedure" form="processes-form">New Procedure</button></span> <span class="button-ex" title="Import procedures from CSV file"><button type="button" id="import-procedures" title="Import a procedures from CSV file" form="processes-form">Import</button></span> <span class="button-ex" title="Manage procedures"><button type="button" id="manage-processes" title="Manage procedures" form="processes-form">Manage</button></span></span>
            <div class="table-ex">
                <table>
                    <thead>
                        <tr>
                            <th>ProcId</th>
                            <th>Souce</th>
                            <th>Input</th>
                            <th>Activity</th>
                            <th>Responsibility</th>
                            <th>Output</th>
                            <th>Client</th>
                            <th>Control</th>
                            <th>Manage/Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="9">Nothing to show. Click [New Procedure] to add new process activities.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
<?php
    }

    private function generatePrintUI()
    {
        $errorMsg = '';
        $personId = '';
        $employee = null;
        $procs = [];
        $dbResults = null;

        ?>
        <section id="main-print">
            <div class="button-group-ex print-controls">
                <span class="print-reminder"><b>NOTE:</b> Please set ALL margins in the print settings to 0.</span>
                <span class="button-ex print-button" title="Open Print Dialog" onclick="window.print();">
                    <button type="button" title="Print"><span class="material-icons-round">print</span><span class="hidden">Print</span></button>
                </span>
                <span class="button-ex close-button" title="Close Tab/Window">
                    <button type="button" title="Close Tab/Window" onclick="window.close();"><span class="material-symbols-rounded">tab_close</span><span class="hidden">Close</span></button>
                </span>
            </div><?php

        if ($errorMsg === 'Access level is insufficient')
        {
            $this->generateForbidden();
            return;
        }
        elseif ($errorMsg !== '')
        {
            $this->jsErrorMsgBox($errorMsg);
            return;
        } ?>
            <section id="qcp-print">
                <header id="qcp-header">
                    <h1><img class="deped-logo" src="<?php echo(__BASE__); ?>/images/Department_of_Education.svg" alt="logo:Department of Education" />
                        <span class="header-rp">Republic of the Philippines</span>
                        <span class="header-deped">Department of Education</span>
                        <span class="header-region">Region IV-A CALABARZON</span>
                        <span class="header-sdo">Schools Division Office of Sto. Tomas City</span>
                    </h1>
                    <h2>Quality Control Process</h2>

                    </div>
                </header>

                <table class="pager">
                    <thead><tr><td></td></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <main id="sr-content">
                                    <div class="div-ex sr-table-wrapper">
                                        <table class="table-ex sr-table" id="sr-table-view">
                                            <thead>
                                                <tr>
                                                    <th data-header-name="source">Source of Inputs</th>
                                                    <th data-header-name="input">Inputs</th>
                                                    <th data-header-name="activity">Activity</th>
                                                    <th data-header-name="proc_staff">Responsible Staff</th>
                                                    <th data-header-name="output">Outputs</th>
                                                    <th data-header-name="recepient">Customer</th>
                                                    <th data-header-name="controls">Controls</th>
                                                </tr>
                                            </thead>
                                            <tbody><?php
        if (is_null($procs) || count($procs) === 0)
        { ?>

                                                <tr>
                                                    <td colspan="7">Not available.</td>
                                                </tr><?php
        }
        else
        {
            $this->generateSRTableRows($procs);
        } ?>

                                            </tbody>
                                        </table>

                                        <div class="div-ex sr-signatories"><!-- TEMP -->
                                            <span class="span-ex encoder">
                                                <span class="name">Name of Encoder</span>
                                                <span class="position">Position</span>
                                            </span>
                                            <span class="span-ex reviewer">
                                                <span class="name">Name of Reviewer</span>
                                                <span class="position">Position</span>
                                            </span>
                                            <span class="span-ex approver">
                                                <span class="name">Name of Approver</span>
                                                <span class="position">Position</span>
                                            </span>
                                        </div>

                                        <div class="div-ex sr-timestamp">
                                            <span class="span-ex">
                                                <span class="label">Generated on:</span>
                                                <span class="datetimestamp"><?php date_default_timezone_set("Asia/Manila"); echo(date('M d, Y g:i A')); ?></span>
                                            </span>
                                        </div>
                                    </div>
                                </main>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot><tr><td></td></tr></tfoot>
                </table>

                <footer id="qcp-footer">
                    <div class="div-ex content">
                        <img class="matatag-bagongpilipinas-logo" src="<?php echo(__BASE__); ?>/images/logo-depedmatatag-bagongpilipinas.png" alt="logo:DepEd MATATAG - Bagong Pilipinas" />
                        <img class="sdo-logo" src="<?php echo(__BASE__); ?>/images/logo-depedstotomas.webp" alt="logo:Department of Education" />
                        <p><b>Address:</b><!--<span class="material-icons-round">pin_drop</span>--> Brgy. Poblacion IV, Sto. Tomas City, Batangas</p>
                        <p><b>Telephone No.:</b><!--<span class="material-icons-round">phone</span>--> (043) 702-8674</p>
                        <p><b>Email Address:</b><!--<span class="material-icons-round">alternate_email</span>--> <a href="mailto:sdo.santotomas@deped.gov.ph">sdo.santotomas@deped.gov.ph</a></p>
                        <p><b>Website:</b><!--<span class="material-icons-round">language</span>--> <a href="https://depedstotomascity.com.ph">depedstotomascity.com.ph</a></p>
                        <table class="doc-info">
                            <tbody>
                                <tr>
                                    <td>Doc. Ref. Code</td>
                                    <td></td>
                                    <td>Rev</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Effectivity</td>
                                    <td></td>
                                    <td>Page</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <img class="sdo-motto" src="<?php echo(__BASE__); ?>/images/logo-tawagko-transparent-cropped.png" alt="logo:Tomasino Ako, Wagi Ang Gawi Ko" />
                    </div>
                </footer>
            </section>
            <script src="<?php echo(__BASE__); ?>/sergs/js/sergsprint.js"></script>
        </section><?php
    }

    private function generateTempUI($pageId)
    { ?>
        <section id="main-<?php echo $pageId;?>" class="under-construction">
            <h2><span class="material-icons-round orange" style="font-weight: bold; vertical-align: middle;">construction</span> <?php echo strtoupper($pageId[0]) . substr($pageId, 1);?> <span class="material-icons-round orange" style="font-weight: bold; vertical-align: middle;">engineering</span></h2>
            <p class="center"><em>This page is under construction. Please bear with us.</em></p>
        </section><?php
    }

    private function generateForbidden()
    { ?>
        <section id="main-forbidden">
            <h2><span class="material-icons-round red" style="font-weight: bold; vertical-align: middle;">block</span> Unauthorized Access <span class="material-icons-round red" style="font-weight: bold; vertical-align: middle;">front_hand</span></h2>
            <p class="center">Your user access level is not allowed to access this interface.</p>
            <p class="center">Click <a href="?a=logout" title="Sign out">here to sign out</a> or <a href="<?php echo(__BASE__); ?>/" title="SDO Services Home">here to return to SDO Services Home</a>.</p>
            <p class="center">Thank you.</p>
        </section><?php
    }

    private function br()
    {
        ?><br><?php
    }

    private function displayStatusMessages()
    {
        if (trim($this->multipleStatus) !== '')
        {
            if ($this->error)
            {
                echo('<span class="failure"><span class="material-icons-round">error</span>');
                echo('No changes will be made to the database while errors are found.');
                echo('</span>');
                echo('<hr>');
            }
            echo($this->multipleStatus . '<hr>');
        }
    }

    private function generateDBFieldValueStr($values, $filter = null) // returns an associative array of field string, value string, and field-value pair string for use in DB select, insert, and update operations; destructuring syntax may be used to extract the strings using the keys 'fieldStr', 'valueStr', and 'fieldValueStr'; does not include parenthesis for field and value strings;
    {
        $fieldValueStr = '';
        $fieldStr = '';
        $valueStr = '';
        
        if (is_null($filter) || !is_callable($filter))
        {
            $filter = function($k, $v) {return true;};
        }
    
        foreach ($values as $key=>$value)
        {
            if ($filter($key, $value))
            {
                $valueStr .= ($fieldStr == '' ? '' : ', ') . (is_string($value) && !$value == '' ? "'" : '') . ($value == '' || is_null($value) ? 'NULL' : $value) . (is_string($value) && !$value == '' ? "'" : '');
                $fieldStr .= ($fieldStr == '' ? '' : ', ') . $key;
                $fieldValueStr .= ($fieldValueStr == '' ? '' : ', ') . $key . '=' . (is_string($value) ? "'" : '') . (is_null($value) ? 'NULL' : $value) . (is_string($value) ? "'" : '');
            }
        }
    
        return array('fieldStr'=>$fieldStr, 'valueStr'=>$valueStr, 'fieldValueStr'=>$fieldValueStr);
    }

    private function jsRedirect($url)
    { ?>
<script>
window.location.replace("<?php echo($url); ?>");
</script><?php 
    }
}
?>