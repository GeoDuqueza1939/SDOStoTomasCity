<?php E_STRICT;

require_once(__FILE_ROOT__ . '/php/classes/app.php');
require_once(__FILE_ROOT__ . '/php/enums/pagetypes.php');
require_once(__FILE_ROOT__ . '/php/audit/log.php');
require_once(__FILE_ROOT__ . '/php/secure/validateUser.php');

class SeRGS_App extends App
{
    private $enum = array();
    private $jsTailScripts = '';
    private $jsTailScriptCount = 0;
    private $multipleStatus = '';
    protected $error = false;

    public function __construct()
    {
        $this->setName("Service Record Generation System");
        $this->setDynamic(true);
        
        require_once(__FILE_ROOT__ . '/php/secure/dbcreds.php');
        
        $this->addDBConn(new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, 'ISCreAMS'));
        require_once(__FILE_ROOT__ . '/sergs/php/db-ddl.php');
        $this->addDBConn(new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $dbname, $ddl));

        $this->setupEnums();
        // $this->br();
        // die(json_encode($this->enum));
    }
    
    private function setupEnums()
    {
        $this->enum['appointmentStatus'] = $this->getDB_SDO()->select('ENUM_Emp_Appointment_Status', '*');
        $this->enum['positions'] = $this->getDB_SDO()->select('Position', 'plantilla_item_number, position_title, parenthetical_title, salary_grade, place_of_assignment, filled');
        $this->enum['position_titles'] = array_values(array_map(fn($row) => $row['position_title'], $this->getDB_SDO()->select('Position', 'position_title', 'GROUP BY position_title')));
        $this->enum['salaryGrade'] = $this->getDB_SDO()->select('Salary_Table', 'salary_grade, step_increment, salary, effectivity_date'/*, 'WHERE effectivity_date >= "2023-01-01"'*/);
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
        return (isset($_SESSION['user']) && isset($_SESSION['user']['sergs_access_level']) ? $_SESSION['user']['sergs_access_level'] : 0);
    }

    public function run($pageId = "dashboard")
    {
        $requiresSignIn = true;
        $pageTitle = $this->getName() . ' | Department of Education | Sto. Tomas City SDO';
        $pageType = PageType::SERGS;
        // $addDebug = false;
        $addDebug = true;

        if (isValidUserSession())
        {
            if (isset($_REQUEST['a']) && $_REQUEST['a'] == 'logout' || !isset($_COOKIE['user']))
            {
                $redirectToLogin = true;
                require_once(__FILE_ROOT__ . '/php/secure/process_signout.php');
            }
            elseif (isset($_REQUEST['a']) && $_REQUEST['a'] == 'refresh')
            {
                unset($_REQUEST['a']);
                header('Location: ' . $_SERVER['PHP_SELF']);
            }
            elseif (isset($_REQUEST['redir']))
            {
                header('Location: ' . $_REQUEST['redir']);
                unset($_REQUEST['redir']);
            }
        }
        else
        {
            echo('NO USER<br>');

            if ($requiresSignIn)
            {
                header('Location: /login?app=sergs&src=' . $_SERVER['PHP_SELF']);
            }
        }
?>
<!DOCTYPE html>
<html lang="en">
<?php require_once(__FILE_ROOT__ . '/php/snippets/html_head.php');?>
<script src="/sergs/js/sergs.js"></script><?php
        if ($pageId !== 'print')
        {
            $this->writeJSEnums();
        } ?>

<body>
<div id="sergs" class="app<?php echo(is_string($pageId) && trim($pageId) !== '' ? " $pageId" : ''); ?>">
<?php
        if ($pageId !== 'print')
        {
            require_once(__FILE_ROOT__ . '/php/snippets/header_full.php'); // general header
            require_once(__FILE_ROOT__ . '/php/snippets/nav_full.php'); // general nav
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
                case "sr":
                    $this->generateSRUI();
                    break;
                case "my-sr":
                    $this->generateMySRUI();
                    break;
                case "other-sr":
                    $this->generateOtherSRUI();
                    break;
                case "sr-encoding":
                    $this->generateSREncodingUI();
                    break;
                case "requests":
                    $this->generateRequestsUI();
                    break;
                case "request-list":
                    $this->generateRequestListUI();
                    break;
                case "new-request":
                    $this->generateNewRequestUI();
                    break;
                case "print":
                    $this->generatePrintUI();
                    break;
                case "archived":
                case "search-requests":
                case "system-logs":
                case "account":
                case "my-account":
                case "other-account":
                case "settings":
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
                <input type="hidden" name="redir" value="/sergs/requests/">
            </form>
            <form id="redir-new-request">
                <input type="hidden" name="redir" value="/sergs/requests/new_request/">
            </form>
            <form id="redir-request-list">
                <input type="hidden" name="redir" value="/sergs/requests/request_list/">
                <input type="hidden" name="req" value="user">
            </form>
            <form id="redir-my-service-record">
                <input type="hidden" name="redir" value="/sergs/sr/my_service_record/">
            </form>

            <div class="div-ex dashboard-contents">
<?php
        
        if ($accessLevel < 9 && $accessLevel > 1)
        { ?>
                <div class="div-ex dashboard-stats-requests-processed">
                    <h4 class="label-ex">Total Requests Processed <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                    <!-- By me: 0 [<a href="/sergs/requests/">View All</a>]<br> -->
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
                        <!-- None to show [<a href="/sergs/requests/new_request/" title="Transact a request">Transact</a>]<br> -->
                        None to show <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Transact a request">Transact</button>
                    </div>
                </div><?php
        }

        if ($accessLevel < 9 && $accessLevel > 2)
        { ?>
                <div class="div-ex dashboard-recent-for-certify">
                    <h4 class="label-ex">Service Record Requests for Certification <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                    <div class="dashboard-item-contents">
                        <!-- None to show [<a href="/sergs/requests/new_request/" title="Transact a request">Transact</a>]<br> -->
                        None to show <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Transact a request">Transact</button>
                    </div>
                </div>
                
                <div class="div-ex dashboard-recent-for-approval">
                    <h4 class="label-ex">Service Record Requests for Approval <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                    <div class="dashboard-item-contents">
                        <!-- None to show [<a href="/sergs/requests/new_request/" title="Transact a request">Transact</a>]<br> -->
                        None to show <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Transact a request">Transact</button>
                    </div>
                </div><?php
        }
        
        if ($accessLevel < 9 && $accessLevel > 1)
        { ?>
                <div class="div-ex dashboard-recent-for-release">
                    <h4 class="label-ex">Service Record Requests for Releasing <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                    <div class="dashboard-item-contents">
                        <!-- None to show [<a href="/sergs/requests/new_request/" title="Transact a request">Transact</a>]<br> -->
                        None to show <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Transact a request">Transact</button>
                    </div>
                </div><?php
        } ?>

                <div class="div-ex dashboard-my-service-record-info">
                    <h4 class="label-ex">My Service Record <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                    <div class="dashboard-item-contents">
                        <!-- Not available [<a href="/sergs/requests/new_request/" title="Request for encoding/updating of my service record">Request</a>]<br> -->
                        Not available <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Request for encoding/updating of my service record">Request</button><br>
                        <!-- Available [<a href="/sergs/sr/my_service_record/" title="View my service record">View</a>] [<a href="/sergs/requests/new_request/" title="Request for a service record update">Update</a>]<br> -->
                        <!-- Available <button type="submit" form="redir-my-service-record" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="View my service record">View</button> <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Request for a service record update">Update</button> -->
                    </div>
                </div>

                <div class="div-ex dashboard-my-requests-history">
                    <h4 class="label-ex">My Requests History <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                    <div class="dashboard-item-contents">
                        <!-- None to show [<a href="/sergs/requests/new_request/">Transact</a>]<br> -->
                        None to show
                        <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Request encoding/updating of Service Record">Request</button>
                        <button type="submit" form="redir-request-list" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="View my requests">View</button>
                    </div>
                </div>
            </div>
        </section><?php
    }

    private function generateSRUI()
    {
        $accessLevel = $this->getUserAccessLevel();

        if ($accessLevel < 1)
        {
            $this->generateForbidden();
            return;
        } ?>
        <section id="main-view">
            <h2>Service Record</h2>
            
            <div class="div-ex view-contents">
                <ul class="card-link">
                    <li><a href="/sergs/sr/my_service_record/">My Service Record</a></li> <?php
                if ($accessLevel < 9 && $accessLevel > 1)
                { ?>
                    <li><a href="/sergs/sr/other/">Other Service Record</a></li>
                    <li><a href="/sergs/sr/encoding/">Service Record Data Entry Form</a></li> <?php
                } ?>
                </ul>
            </div>
        </section><?php
    }

    private function generateMySRUI()
    {
        $accessLevel = $this->getUserAccessLevel();
        $sr = $this->retrieveSR($_SESSION['user']['personId']);
        
        if ($accessLevel < 1)
        {
            $this->generateForbidden();
            return;
        } ?>
        <section id="main-view-my-sr">
            <h2>My Service Record</h2>
            
            <div class="div-ex emp-info">
                <div class="div-ex emp-id" id="emp-name">
                    <span class="label-ex">Name:</span>
                    <?php echo($this->getFullName($_SESSION['user']['given_name'], $_SESSION['user']['middle_name'], $_SESSION['user']['family_name'], $_SESSION['user']['spouse_name'], $_SESSION['user']['ext_name'], true)); ?>
                </div>
                <div class="div-ex" id="sr-emp-birth-date">
                    <span class="label-ex">Birth Date:</span>
                    <?php echo($_SESSION['user']['birth_date']); ?>
                </div>
                <div class="div-ex" id="sr-emp-birth-date">
                    <span class="label-ex">Birth Place:</span>
                    <?php echo($_SESSION['user']['birth_place']); ?>
                </div>
                <div class="div-ex" id="sr-emp-birth-place">
                    <span class="label-ex">Emp. No.:</span>
                    <?php echo($_SESSION['user']['employeeId']); ?>
                </div>
            </div>

            <form id="sr-printer" name="sr-printer" method="GET" action="/sergs/print.php" target="_blank">
                <input type="hidden" name="a" value="print">
                <input type="hidden" name="print" value="sr">
                <input type="hidden" name="personId" value="<?php echo($_SESSION['user']['personId']); ?>">
            </form>

            <div class="button-group-ex sr-control-buttons">
                <span class="button-ex sr-print">
                    <button type="submit" form="sr-printer"><span class="material-icons-round">print</span><span class="hidden"><br>Print</span></button>
                </span>
            </div>

            <div class="div-ex sr-table-wrapper">
                <table class="table-ex sr-table" id="sr-table-view">
                    <thead>
                        <tr>
                            <th colspan="2" data-header-name="service">Service</th>
                            <th colspan="3" data-header-name="appointment">Record of Appointment</th>
                            <th data-header-name="office">Office</th>
                            <th rowspan="3" data-header-name="branch" data-contenteditable="true">Branch</th>
                            <th rowspan="3" data-header-name="lwop_count" data-contenteditable="true">Leave of Absence w/o Pay</th>
                            <th rowspan="3" data-header-name="separation_date" data-contenteditable="true">Date</th>
                        </tr>
                        <tr>
                            <th colspan="2" data-header-name="inclusive_date">(Inclusive Date)</th>
                            <th rowspan="2" data-header-name="designation" data-contenteditable="true">Designation</th>
                            <th rowspan="2" data-header-name="status" data-contenteditable="true">Status</th>
                            <th rowspan="2" data-header-name="salary" data-contenteditable="true">Salary</th>
                            <th rowspan="2" data-header-name="station" data-contenteditable="true">Station/Place</th>
                        </tr>
                        <tr>
                            <th data-header-name="date_start" data-contenteditable="true">From</th>
                            <th data-header-name="date_end" data-contenteditable="true">To</th>
                        </tr>
                    </thead>
                    <tbody><?php
        if (is_null($sr) || count($sr) === 0)
        { ?>

                        <tr>
                            <td colspan="9">Not available. To request a service record update, please click <a href="/sergs/requests/new_request/" title="Request for a service record">here</a>.</td>
                        </tr>
        <?php
        }
        else
        {
            $this->generateSRTableRows($sr);
        } ?>

                    </tbody>
                </table>
            </div>

            <span class="status-pane multiple" id="sr-status"><?php 
        $this->displayStatusMessages();

            ?>

            </span>
        </section>
        <script>
        "use strict";
        function pageRun(app = new App())
        {
            // let srTable = null, srTableWrapper = document.querySelector(".div-ex.sr-table-wrapper").uiEx;

            // srTable = new TableEx().setup(app.main);
            // srTable.table.classList.add("sr-table");
            // srTable.setupHeaders([{name:"service_date_range", text:"Service", subheaders:[{name:"service_date_range2", text:"(Inclusive Date)", subheaders:[{name:"service_date_from", text:"From"}, {name:"service_date_to", text:"To"}]}]}, {name:"appointment", text:"Record of Appointment", subheaders:[{name:"designation", text:"Designation"}, {name:"status", text:"Status"}, {name:"salary", text:"Salary"}]}, {name:"office", text:"Office", subheaders:[{name:"station", text:"Station/Place"}]}, {name:"branch", text:"Branch"}, {name:"lwop_count", text:"Leave of Absence w/o Pay"}, {name:"separation_date", text:"Date"}]);
            // srTableWrapper.addExContent(srTable);
        }
        </script>
    <?php
    }

    private function generateOtherSRUI()
    {
        $accessLevel = $this->getUserAccessLevel();
        $dbResults = null;
        $employee = null;
        $employees = $this->getDB_SDO()->executeQuery('SELECT Person.personId, given_name, middle_name, family_name, spouse_name, ext_name, birth_date, Address.address AS birth_place, employeeId, is_temporary_empno FROM Person INNER JOIN Employee ON Person.personId=Employee.personId LEFT JOIN Address ON Person.birth_place=Address.addressId WHERE Person.personId <> "' . $_SESSION['user']['personId'] . '";');
        $sr = [];

        if ($accessLevel < 2)
        {
            $this->generateForbidden();
            return;
        }

        if (isset($_REQUEST['a']))
        {
            switch ($_REQUEST['a'])
            {
                case 'fetch':
                    if (isset($_REQUEST['fetch']))
                    {
                        switch ($_REQUEST['fetch'])
                        {
                            case 'sr':
                                $employee = $this->filterEmployee($employees);

                                $sr = $this->retrieveSR($employee['personId']);

                                break;
                            default:
                                $this->jsErrorMsgBox('Unknown Fetch keyword.');
                                break;
                        }
                    }
                    else
                    {
                        $this->jsErrorMsgBox('Nothing to fetch.');
                    }
                    break;
                default:
                    $this->jsErrorMsgBox(('Unknown operation.'));
                    break;
            }
        } ?>
        <section id="main-other-sr">
            <h2>View Service Record</h2>
            
            <form id="sr-loader" name="sr-loader" method="GET">
                <input type="hidden" name="a" value="fetch">
                <input type="hidden" name="fetch" value="sr"><?php 
        if (!is_null($employee))
        { ?>

                <input type="hidden" name="employeeId" value="<?php echo($_REQUEST['employeeId']); ?>"><?php
        } ?>

            </form>

            <form id="sr-printer" name="sr-printer" method="GET" action="/sergs/print.php" target="_blank">
                <input type="hidden" name="a" value="print">
                <input type="hidden" name="print" value="sr"><?php 
        if (!is_null($employee))
        { ?>

                <input type="hidden" name="personId" value="<?php echo($employee['personId']); ?>"><?php
        } ?>

            </form>

            <div class="div-ex emp-info"><?php
        if (is_null($employee))
        { ?>

                <span class="drop-down-ex emp-id">
                    <label class="label-ex" for="employeeId">Employee ID/Name:</label>
                    <select id="employeeId" name="employeeId" form="sr-loader" onchange="SeRGS_App.morphAddEmployeeLoadSRButton(this, false);">
                        <option value="-1" class="non-option">- Select Employee -</option><?php    
                    if (is_null($this->getDB_SDO()->lastException))
                    {
                        foreach ($employees as $emp) { ?>

                        <option value="<?php echo($emp['employeeId']); ?>" data-birth-date="<?php echo(date('F j, Y', strtotime($emp['birth_date']))); ?>" data-birth-place="<?php echo($emp['birth_place']); ?>"<?php $selected = (isset($_REQUEST['a']) && $_REQUEST['a'] === 'fetch' && isset($_REQUEST['fetch']) && $_REQUEST['fetch'] === 'sr' && isset($_REQUEST['employeeId']) && $_REQUEST['employeeId'] === $emp['employeeId']); echo($selected ? ' selected': ''); ?>><?php
                                echo($emp['employeeId'] . ' &ndash; ' . $this->getFullName($emp['given_name'], $emp['middle_name'], $emp['family_name'], $emp['spouse_name'], $emp['ext_name'], true));
                            ?></option><?php
                        }
                    }
                    else
                    {
                        $this->jsErrorMsgBox('Error encountered retrieving employee records.');
                    }
                    ?>
                    </select>
                </span>

                <span class="button-ex" id="sr-load-sr">
                    <button type="submit" form="sr-loader" disabled>Load Service Record</button>
                </span><?php
        }
        else
        { ?>

                <div class="div-ex emp-id" id="emp-name">
                    <span class="label-ex">Employee Name:</span> <?php echo($this->getFullName($employee['given_name'], $employee['middle_name'], $employee['family_name'], $employee['spouse_name'], $employee['ext_name'], true)); ?>

                </div><?php
        } ?>

                <div class="div-ex" id="sr-emp-birth-date">
                    <span class="label-ex">Birth Date:</span> <?php echo(is_null($employee) ? '' : date('F j, Y', strtotime($employee['birth_date']))); ?>

                </div>
                <div class="div-ex" id="sr-emp-birth-place">
                    <span class="label-ex">Birth Place:</span> <?php echo(is_null($employee) ? '' : $employee['birth_place']); ?>

                </div><?php
        if (!is_null($employee))
        { ?>

                <div class="div-ex emp-id" id="emp-id">
                    <span class="label-ex">Employee ID:</span> <?php echo($employee['employeeId']); ?>

                </div><?php
        } ?>
        
            </div>

            <div class="button-group-ex sr-control-buttons">
                <span class="button-ex sr-print">
                    <button type="submit" form="sr-printer"<?php echo(is_null($employee) ? ' disabled' : ''); ?>><span class="material-icons-round">print</span><span class="hidden"><br>Print</span></button>
                </span>
            </div>

            <div class="div-ex sr-table-wrapper">
                <table class="table-ex sr-table" id="sr-table-view">
                    <thead>
                        <tr>
                            <th colspan="2" data-header-name="service">Service</th>
                            <th colspan="3" data-header-name="appointment">Record of Appointment</th>
                            <th data-header-name="office">Office</th>
                            <th rowspan="3" data-header-name="branch">Branch</th>
                            <th rowspan="3" data-header-name="lwop_count">Leave of Absence w/o Pay</th>
                            <th rowspan="3" data-header-name="separation_date">Date</th>
                        </tr>
                        <tr>
                            <th colspan="2" data-header-name="inclusive_date">(Inclusive Date)</th>
                            <th rowspan="2" data-header-name="designation">Designation</th>
                            <th rowspan="2" data-header-name="status">Status</th>
                            <th rowspan="2" data-header-name="salary">Salary</th>
                            <th rowspan="2" data-header-name="station">Station/Place</th>
                        </tr>
                        <tr>
                            <th data-header-name="date_start">From</th>
                            <th data-header-name="date_end">To</th>
                        </tr>
                    </thead>
                    <tbody><?php
        if (is_null($sr) || count($sr) === 0)
        { ?>

                        <tr>
                            <td colspan="9"><?php echo(is_null($employee) ? 'Please select and load an employee record to continue.' : 'Not available. To update this employee\'s service record, please click <a href="/sergs/sr/encoding/?' . $_SERVER['QUERY_STRING'] . '" title="Update service record">here</a>. To request an update in behalf of this employee, please click <a href="/sergs/requests/new_request/" title="Request for a service record">here</a>.'); ?></td>
                        </tr>
        <?php
        }
        else
        {
            $this->generateSRTableRows($sr);
        } ?>

                    </tbody>
                </table>
            </div>

            <span class="status-pane multiple" id="sr-status"><?php 
        $this->displayStatusMessages();

                    ?>

            </span>
        </section>
    <?php
    }

    private function generateNewRequestUI()
    {
        $accessLevel = $this->getUserAccessLevel();
        
        if ($accessLevel < 1)
        {
            $this->generateForbidden();
            return;
        } ?>
        <section id="main-new-request">
            <h2>New Request</h2>

            <form class="data-form-ex" action="" method="post">
                <input type="hidden" name="transact" value="request-encode" />
<?php 
        if ($accessLevel < 9 && $accessLevel > 1)
        { ?>
                <div class="div-ex radio-button-group-ex" id="sr-owner">
                    <span class="radio-ex" title="Request encoding or updating of my own service record">
                        <input type="radio" id="radio-select-sr-owner0" title="Request encoding or updating of my own service record" name="sr-owner" value="0" onclick="document.getElementById('sr-employee-id').disabled = true;"<?php if (!isset($_REQUEST['sr-owner']) || $_REQUEST['sr-owner'] === '0') { echo(' checked'); } ?>>
                        <label class="label-ex" for="radio-select-sr-owner0" title="Request encoding or updating of my own service record">For myself</label>
                    </span>
                    <span class="radio-ex" title="Request encoding or updating of another employee's service record">
                        <input type="radio" id="radio-select-sr-owner1" title="Request encoding or updating of another employee's service record" name="sr-owner" value="1" onclick="document.getElementById('sr-employee-id').disabled = false;"<?php if (isset($_REQUEST['sr-owner']) && $_REQUEST['sr-owner'] === '1') { echo(' checked'); } ?>>
                        <label class="label-ex" for="radio-select-sr-owner1" title="Request encoding or updating of another employee's service record">For another employee</label>
                    </span>
                </div><?php
            $employees = $this->getDB_SDO()->executeQuery('SELECT Person.personId, given_name, middle_name, family_name, spouse_name, ext_name, birth_date, birth_place, employeeId, is_temporary_empno FROM Person INNER JOIN Employee ON Person.personId=Employee.personId;');

            if (is_null($this->getDB_SDO()->lastException))
            { ?>

                <span class="drop-down-ex sr-employee-id">
                    <select id="sr-employee-id" name="sr-employee-id" title="Please select the employee for whom you are transacting this request"<?php if (!isset($_REQUEST['sr-owner']) || $_REQUEST['sr-owner'] === '0') { echo(' disabled'); } ?>>
                        <option value="-1" class="non-option">- Select employee -</option><?php
                foreach ($employees as $employee) { ?>

                        <option value="<?php echo($employee['employeeId']); ?>"><?php
                            echo($employee['employeeId'] . ' &ndash; ' . $this->getFullName($employee['given_name'], $employee['middle_name'], $employee['family_name'], $employee['spouse_name'], $employee['ext_name'], true));
                        ?></option><?php
                } ?>

                    </select>
                </span><?php
            }
            else
            {
                echo('Error encountered retrieving employee records.');
            }
        }
        else // end-user access only
        { ?>
                <input type="hidden" id="radio-select-sr-owner" name="sr-owner" value="0" />
                <input type="hidden" id="sr-employee-id" name="sr-employee-id" value="<?php echo($_SESSION['user']['employeeId']); ?>" /><?php
        } ?>

                <span class="span-ex checkbox-group-ex" id="sr-type">
                    <span class="checkbox-ex" title="Viewable and printable (no e-signature)">
                        <input type="checkbox" id="sr-online" title="Viewable and printable (no e-signature)" name="sr-online" value="0">
                        <label class="label-ex" for="sr-online" title="Viewable and printable (no e-signature)">Online only</label>
                    </span>
                    <span class="checkbox-ex" title="Viewable and printable (with e-signature)">
                        <input type="checkbox" id="sr-online-signed" title="Viewable and printable (with e-signature)" name="sr-online-signed" value="1">
                        <label class="label-ex" for="sr-online-signed" title="Viewable and printable (with e-signature)">Online with e-signature</label>
                    </span>
                    <span class="checkbox-ex" title="May be claimed from the Records Section of the Schools Division Office; please bring a valid ID for verification">
                        <input type="checkbox" id="sr-printout" title="May be claimed from the Records Section of the Schools Division Office; please bring a valid ID for verification" name="sr-printout" value="2">
                        <label class="label-ex" for="sr-printout" title="May be claimed from the Records Section of the Schools Division Office; please bring a valid ID for verification">Certified/Approved (with actual signature)</label>
                    </span>
                </span>

                <span class="button-group-ex span-ex data-form-buttons">
                    <span class="button-ex"><button type="submit" id="new-request-submit">Submit</button></span>
                    <span class="button-ex"><button type="reset" id="new-request-reset">Reset</button></span>
                </span>
            </form>
        </section><?php
    }

    private function generateRequestsUI()
    {
        $requester = (isset($_REQUEST['req']) ? $_REQUEST['req'] : null);
        $accessLevel = $this->getUserAccessLevel();
        
        if ($accessLevel < 1)
        {
            $this->generateForbidden();
            return;
        } ?>
        <section id="main-requests">
            <h2>Requests</h2>
            <ul class="card-link">
                <li><a href="/sergs/requests/request_list/"><?php echo($this->getUserAccessLevel() === 1 ? 'My Requests' : 'Request List'); ?></a></li>
                <li><a href="/sergs/requests/new_request/">New Request</a></li><?php
                if ($accessLevel > 1 && $accessLevel < 9)
                { ?>
                <li><a href="/sergs/requests/archive/">Archived Requests</a></li>
                <li><a href="/sergs/requests/search/">Search</a></li><?php
                } ?>
            </ul>
        </section><?php
    }

    private function generateRequestListUI()
    { 
        
        if ($this->getUserAccessLevel() < 1)
        {
            $this->generateForbidden();
            return;
        } ?>
        <section id="main-request-list">
            <h2><?php echo($this->getUserAccessLevel() === 1 ? 'My Requests' : 'Request List'); ?></h2>

            <div class="div-ex request-list-filters">
                <label class="label-ex caption" for="filter-status">Filters:</label>
                <span class="drop-down-ex filter-requester">
                    <label class="label-ex" for="filter-requester">Requester:</label>
                    <select id="filter-requester" name="filter-requester">
                        <option value ="0">Me</option>
                        <option value ="1">All</option>
                        <?php
                        if ($this->getUserAccessLevel() > 1)
                        {
                            // NON-EMPLOYEE USERS ARE INCLUDED IN THIS QUERY!!!!
                            $employees = $this->getDB_SDO()->executeQuery(
                                'SELECT 
                                    Person.personId,
                                    given_name,
                                    middle_name,
                                    family_name,
                                    spouse_name,
                                    ext_name,
                                    birth_date,
                                    birth_place,
                                    Employee.employeeId,
                                    is_temporary_empno,
                                    username,
                                    password,
                                    sergs_access_level,
                                    opms_access_level,
                                    mpasis_access_level,
                                    first_signin,
                                    pin
                                FROM Person
                                LEFT JOIN Employee ON Person.personId = Employee.personId
                                LEFT JOIN (SELECT username, password, personId, Employee.employeeId, sergs_access_level, opms_access_level, mpasis_access_level, first_signin, pin FROM User INNER JOIN Employee ON User.employeeId = Employee.employeeId UNION SELECT * FROM Temp_User) All_User ON Person.personId = All_User.personId
                                WHERE NOT (username IS NULL AND Employee.employeeId IS NULL)
                                ;'
                            );

                            if (is_null($this->getDB_SDO()->lastException))
                            {
                                foreach ($employees as $employee) { ?>
                        <option value="<?php echo($employee['employeeId']); ?>"><?php
                                    echo((is_null($employee['employeeId']) || (is_string($employee['employeeId'] && trim($employee['employeeId']) === '')) ? '[no emp ID]' : $employee['employeeId']) . '&ndash;' . (is_null($employee['username']) || (is_string($employee['username'] && trim($employee['username']) === '')) ? '[no username]' : $employee['username']) . '&ndash;' . $this->getFullName($employee['given_name'], $employee['middle_name'], $employee['family_name'], $employee['spouse_name'], $employee['ext_name'], true));
                        ?></option><?php
                                }
                            }
                            else
                            {
                                $this->jsErrorMsgBox('Error in fetching employee and user records.');
                            }
                        }
                        ?>
                    </select>
                </span>
                <span class="drop-down-ex filter-status">
                    <label class="label-ex" for="filter-status">Status:</label>
                    <select id="filter-status" name="filter-status">
                        <option value ="0">ALL</option>
                        <option value ="1">For Encode/Update</option>
                        <option value ="2">For Certification</option>
                        <option value ="3">For Approval</option>
                        <option value ="4">For Release (Records Section)</option>
                        <option value ="5">Approved (Available Online)</option>
                        <option value ="6">Released (Records Section)</option>
                        <option value ="7">Cancelled</option>
                        <option value ="8">Archived</option>
                    </select>
                </span>
                <label class="label-ex" for="filter-date-range-start">Dates</label>
                <span class="date-field-ex filter-date-range-start">
                    <label class="label-ex" for="filter-date-range-start">From:</label>
                    <input type="date" id="filter-date-range-start" name="filter-date-range-start">
                </span>
                <span class="date-field-ex filter-date-range-end">
                    <label class="label-ex" for="filter-date-range-end">To:</label>
                    <input type="date" id="filter-date-range-end" name="filter-date-range-end">
                </span>
                <span class="button-ex">
                    <button type="button">Apply</button>
                </span>
            </div>
            <div class="div-ex request-list-table-wrapper">
                <!-- None found. <a href="/sergs/requests/new_request/" title="Request for a service record">Request a copy</a> -->
                <table class="table-ex request-list-table">
                    <thead>
                        <tr>
                            <th>Requested On</th>
                            <th>Requested By</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </section><?php
    }

    private function generateSREncodingUI()
    { 
        $dbResults = null;
        $employee = null;
        $employees = $this->getDB_SDO()->executeQuery('SELECT Person.personId, given_name, middle_name, family_name, spouse_name, ext_name, birth_date, Address.address AS birth_place, employeeId, is_temporary_empno FROM Person INNER JOIN Employee ON Person.personId=Employee.personId LEFT JOIN Address ON Person.birth_place=Address.addressId;');
        $sr = [];
        $forSRUpdate = false;
        $this->error = false;
        $warning = false;
        $this->multipleStatus = '';
        $empAppointments = [];

        $accessLevel = $this->getUserAccessLevel();
        if ($accessLevel < 2)
        {
            $this->generateForbidden();
            return;
        } 
        
        if (isset($_REQUEST['a']))
        {
            switch ($_REQUEST['a'])
            {
                case 'add':
                    if (isset($_REQUEST['add']))
                    {
                        switch ($_REQUEST['add'])
                        {
                            case 'employee':
                                $person = [];
                                // $employee = [];
                                $birthPlace = [];
                                $emailAddress = "";
                                
                                $isTempEmpId = isset($_REQUEST['is_temporary_empno']);
                                $employeeId = trim($_REQUEST['employeeId']);
                                $createAccount = isset($_REQUEST['create_account']);
                                
                                if (!is_string($_REQUEST['given_name']) || trim($_REQUEST['given_name']) === '')
                                {
                                    $this->error = true;
                                    $this->jsErrorMsgBox('Error: Given name is required.');
                                }
                    
                                if (!$this->error)
                                {
                                    $dbResults = $this->getDB_SDO()->select('Employee', 'employeeId', "WHERE employeeId='$employeeId'");
                    
                                    if (!is_null($this->getDB_SDO()->lastException))
                                    {
                                        $this->error = true;
                                        $this->jsErrorMsgBox('Error encountered in querying employee information in database.<br><br>' . $this->getDB_SDO()->lastException->getMessage() . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr);
                                    }
                                    elseif (count($dbResults) > 0)
                                    {
                                        $this->error = true;
                                        $this->jsErrorMsgBox("Error: Employee ID $employeeId already exists.");
                                    }
                                }
                    
                                foreach ($_REQUEST as $key => $value)
                                {
                                    switch ($key)
                                    {
                                        case 'app':
                                        case 'a':
                                        case 'is_temporary_empno':
                                        case 'employeeId':
                                                break;
                                        case 'given_name': case 'middle_name': case 'family_name':
                                        case 'spouse_name': case 'ext_name': case 'post_nominal':
                                        case 'birth_date':
                                            $person[$key] = trim($value);
                                            break;
                                        case 'birth_place':
                                            $birthPlace = trim($value);
                                            break;
                                        case 'employeeId':
                                            break;
                                        case 'is_temporary_empno':
                                            break;
                                        case 'email_address':
                                            $emailAddress = trim($value);
                                            break;
                                    }
                                }
                    
                                $birthPlaceAddressId = -1;
                                $personId = -1;
                    
                                if (!$this->error)
                                {
                                    $dbResults = $this->getDB_SDO()->select('Address', 'addressId', "WHERE address='$birthPlace'");
                        
                                    if (is_null($this->getDB_SDO()->lastException))
                                    {
                                        if (count($dbResults) === 0)
                                        {
                                            $birthPlaceAddressId = $this->getDB_SDO()->insert('Address', '(address)', "('$birthPlace')");
                        
                                            if (!is_null($this->getDB_SDO()->lastException))
                                            {
                                                $this->error = true;
                                                $this->jsErrorMsgBox('Error encountered in inserting birth place into database.<br><br>' . $this->getDB_SDO()->lastException->getMessage() . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr);
                                            }
                                        }
                                        else
                                        {
                                            $birthPlaceAddressId = $dbResults[0]['addressId'];
                                        }
                                    }
                                    else
                                    {
                                        $this->error = true;
                                        $this->jsErrorMsgBox('Error encountered in querying birth place in database.<br><br>' . $this->getDB_SDO()->lastException->getMessage() . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr);
                                    }
                                }
                    
                                if (!$this->error)
                                {
                                    $dbResults = $this->getDB_SDO()->select('Person', 'personId, given_name, middle_name, family_name, spouse_name, ext_name, post_nominal, birth_date, birth_place', 'WHERE given_name="' . $person['given_name'] . '" AND family_name="' . $person['family_name'] . '" AND birth_date="' . $person['birth_date'] . '"');
                    
                                    if (is_null($this->getDB_SDO()->lastException) && count($dbResults) === 0)
                                    {
                                        $dbResults = $this->getDB_SDO()->select('Person', 'personId, given_name, middle_name, family_name, spouse_name, ext_name, post_nominal, birth_date, birth_place', 'WHERE given_name="' . $person['given_name'] . '" AND (family_name="' . $person['family_name'] . '" OR birth_date="' . $person['birth_date'] . '")');
                                    }
                    
                                    if (is_null($this->getDB_SDO()->lastException))
                                    {
                                        if (count($dbResults) > 1)
                                        {
                                            $this->error = true;
                                            $this->jsErrorMsgBox('Ambiguity encountered in querying personal information in database. [Multiple matches found where a single match is expected]');
                                        }
                                        elseif (count($dbResults) === 1)
                                        {
                                            $personId = $dbResults[0]['personId'];
                    
                                            $this->getDB_SDO()->update('Person', 'given_name="' . $person['given_name'] . '", middle_name="' . $person['middle_name'] . '", family_name="' . $person['family_name'] . '", spouse_name="' . $person['spouse_name'] . '", ext_name="' . $person['ext_name'] . '", post_nominal="' . $person['post_nominal'] . '", birth_date="' . $person['birth_date'] . '", birth_place="' . $birthPlaceAddressId . '"', "WHERE personId='$personId'");
                    
                                            if (!is_null($this->getDB_SDO()->lastException))
                                            {
                                                $this->error = true;
                                                $this->jsErrorMsgBox('Ambiguity encountered in querying personal information in database. [Multiple matches found where a single match is expected]<br><br>' . $this->getDB_SDO()->lastException->getMessage() . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr);
                                            }
                                        }
                                        elseif (count($dbResults) === 0)
                                        {
                                            $personId = $this->getDB_SDO()->insert('Person', '(given_name, middle_name, family_name, spouse_name, ext_name, post_nominal, birth_date, birth_place)', '("' . $person['given_name'] . '", "' . $person['middle_name'] . '", "' . $person['family_name'] . '", "' . $person['spouse_name'] . '", "' . $person['ext_name'] . '", "' . $person['post_nominal'] . '", "' . $person['birth_date'] . '", "' . $birthPlaceAddressId . '")');
                    
                                            if (!is_null($this->getDB_SDO()->lastException))
                                            {
                                                $this->error = true;
                                                $this->jsErrorMsgBox('Error encountered in inserting personal information into database.<br><br>' . $this->getDB_SDO()->lastException->getMessage() . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr);
                                            }
                                        }
                                    }
                                    else
                                    {
                                        $this->error = true;
                                        $this->jsErrorMsgBox('Error encountered in querying personal information in database.<br><br>' . $this->getDB_SDO()->lastException->getMessage() . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr);
                                    }    
                                }
                    
                                if (!$this->error)
                                {
                                    $this->getDB_SDO()->insert('Employee', '(employeeId, personId, is_temporary_empno)', "('$employeeId', '$personId', '" . ($isTempEmpId ? '1' : '0') . "')");
                    
                                    if (!is_null($this->getDB_SDO()->lastException))
                                    {
                                        $this->error = true;
                                        $this->jsErrorMsgBox('Error encountered in inserting employee information into database.<br><br>' . $this->getDB_SDO()->lastException->getMessage() . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr);
                                    }
                                }
                    
                                if (!$this->error)
                                {
                                    $this->getDB_SDO()->insert('Email_Address', '(email_address, personId)', "('$emailAddress', '$personId')");
                    
                                    if (!is_null($this->getDB_SDO()->lastException))
                                    {
                                        $this->error = true;
                                        $this->jsErrorMsgBox('Error encountered in inserting email address into database.<br><br>'. $this->getDB_SDO()->lastException->getMessage() . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr);
                                    }    
                                }
            
                                if (!$this->error)
                                {
                                    $employees = $this->getDB_SDO()->executeQuery('SELECT Person.personId, given_name, middle_name, family_name, spouse_name, ext_name, birth_date, Address.address AS birth_place, employeeId, is_temporary_empno FROM Person INNER JOIN Employee ON Person.personId=Employee.personId LEFT JOIN Address ON Person.birth_place=Address.addressId;');
            
                                    if (!is_null($this->getDB_SDO()->lastException))
                                    {
                                        $this->error = true;
                                        $this->jsErrorMsgBox('Error encountered in querying employee information in database.<br><br>' . $this->getDB_SDO()->lastException->getMessage() . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr);
                                    }
                                }

                                break;
                            default:
                                $this->jsErrorMsgBox('Unknown Add keyword.');
                                break;
                        }
                    }
                    else
                    {
                        $this->jsErrorMsgBox('Nothing to add!');
                    }
                    break;
                case 'fetch':
                    if (isset($_REQUEST['fetch']))
                    {
                        switch ($_REQUEST['fetch'])
                        {
                            case 'sr':
                                $employee = $this->filterEmployee($employees);

                                $sr = $this->retrieveSR($employee['personId']);

                                break;
                            default:
                                $this->jsErrorMsgBox('Unknown Fetch keyword.');
                                break;
                        }
                    }
                    else
                    {
                        $this->jsErrorMsgBox('Nothing to fetch.');
                    }
                    break;
                case 'update':
                    if (isset($_REQUEST['update']))
                    {
                        switch ($_REQUEST['update'])
                        {
                            case 'sr':
                                $employee = $this->filterEmployee($employees);
                                $dbResults = null;

                                if (!$this->error)
                                {
                                    foreach ($_REQUEST as $key => $value)
                                    {
                                        switch($key)
                                        {
                                            case 'app':
                                            case 'a':
                                            case 'update':
                                                break;
                                            case 'date_start': case 'date_end':
                                            case 'designation': case 'status': case 'salary':
                                            case 'station':
                                            case 'branch':
                                            case 'lwop_count':
                                            case 'separation_date':
                                                while (count($sr) < count($_REQUEST[$key]))
                                                {
                                                    array_push($sr, []);
                                                }
            
                                                for ($i = 0; $i < count($sr); $i++)
                                                {
                                                    $sr[$i][$key] = ($value[$i] === '' || ($key === 'date_end' && $value[$i] === 'present') ? null : ($key === 'date_start' || $key === 'date_end' || $key === 'separation_date' ? preg_replace('/(\d\d)\/(\d\d)\/(\d\d\d\d)/', '\3-\1-\2', $value[$i]) : $value[$i]));
                                                }
                                                break;
                                            default:
                                                break;
                                        }

                                    }

                                    // $this->jsDebugMsgBox(json_encode($sr, true));
                                    // $this->jsDebugMsgBox(json_encode($employee, true));

                                    // Sort SR data field according to start dates
                                    usort($sr, fn($sr1, $sr2) => ($sr1['date_start'] < $sr2['date_start'] ? -1 : ($sr1['date_start'] > $sr2['date_start'] ? 1 : ((($sr1['date_end'] < $sr2['date_end'] || is_null($sr2['date_end'])) && !is_null($sr1['date_end'])) ? -1 : ((!is_null($sr2['date_end']) && ($sr1['date_end'] > $sr2['date_end'] || is_null($sr1['date_end']))) ? 1 : 0))))); // ascending order according to date

                                    foreach ($sr as &$srTOS)
                                    {
                                        if (count($empAppointments) === 0 || $srTOS['designation'] !== end($empAppointments)['designation']) // create new
                                        {
                                            $empAppointments[] = array(
                                                'designation' => $srTOS['designation'],
                                                'personId' => $employee['personId'],
                                                'employeeId' => $employee['employeeId'],
                                                'appointment_number' => null,
                                                'plantilla_item_number' => null,
                                                'date_start' => $srTOS['date_start'],
                                                'date_end' => null,
                                                'term_of_service' => [],
                                            );
                                        }

                                        $empAppointments[count($empAppointments) - 1]['term_of_service'][] = &$srTOS;
                                        $empAppointments[count($empAppointments) - 1]['date_end'] = (is_null($srTOS['date_end']) || $srTOS['date_end'] === '' ? null : $srTOS['date_end']);

                                        $srTOS['designation'] = &$empAppointments[count($empAppointments) - 1]['designation'];
                                        $srTOS['appointment'] = &$empAppointments[count($empAppointments) - 1];
                                    }

                                    // update to database after rendering the table; validate data while rendering the table
                                    // $this->jsDebugMsgBox(json_encode(var_export($empAppointments[0], true)));

                                    $forSRUpdate = true;
                                }
                                break;
                            default:
                                $this->jsErrorMsgBox('Unknown Update keyword.');
                                break;
                        }
                    }
                    else
                    {
                        $this->jsErrorMsgBox('Nothing to update.');
                    }
                    break;
                default:
                    $this->jsErrorMsgBox(('Unknown operation.'));
                    break;
            }
        }
        ?>
        <section id="main-sr-encoding">
            <h2>Service Record Data Entry Form</h2>

            <form id="sr-loader" name="sr-loader" method="GET">
                <input type="hidden" name="a" value="fetch">
                <input type="hidden" name="fetch" value="sr"><?php 
        if (!is_null($employee))
        { ?>

                <input type="hidden" name="employeeId" value="<?php echo($employee['employeeId']); ?>"><?php
        } ?>

            </form>

            <form id="sr-printer" name="sr-printer" method="GET" action="/sergs/print.php" target="_blank">
                <input type="hidden" name="a" value="print">
                <input type="hidden" name="print" value="sr"><?php 
        if (!is_null($employee))
        { ?>

                <input type="hidden" name="personId" value="<?php echo($employee['personId']); ?>"><?php
        } ?>

            </form>

            <div class="div-ex emp-info"><?php
        if (is_null($employee))
        { ?>

                <span class="drop-down-ex emp-id">
                    <label class="label-ex" for="employeeId">Employee ID/Name:</label>
                    <select id="employeeId" name="employeeId" form="sr-loader" onchange="SeRGS_App.morphAddEmployeeLoadSRButton(this);">
                        <option value="-1" class="non-option">- New Employee Record -</option><?php    
                    if (is_null($this->getDB_SDO()->lastException))
                    {
                        foreach ($employees as $emp) { ?>

                        <option value="<?php echo($emp['employeeId']); ?>" data-birth-date="<?php echo(date('F j, Y', strtotime($emp['birth_date']))); ?>" data-birth-place="<?php echo($emp['birth_place']); ?>"<?php $selected = (isset($_REQUEST['a']) && $_REQUEST['a'] === 'fetch' && isset($_REQUEST['fetch']) && $_REQUEST['fetch'] === 'sr' && isset($_REQUEST['employeeId']) && $_REQUEST['employeeId'] === $emp['employeeId']); echo($selected ? ' selected': ''); ?>><?php
                                echo($emp['employeeId'] . ' &ndash; ' . $this->getFullName($emp['given_name'], $emp['middle_name'], $emp['family_name'], $emp['spouse_name'], $emp['ext_name'], true));
                            ?></option><?php
                        }
                    }
                    else
                    {
                        $this->jsErrorMsgBox('Error encountered retrieving employee records.');
                    }
                    ?>
                    </select>
                </span>

                <span class="button-ex" id="sr-load-sr">
                    <button type="button" form="sr-loader"<?php echo(is_null($employee) ? ' onclick="SeRGS_App.addEmployeeLoadSRButton(this);"' : ' disabled'); ?>><?php echo(is_null($employee) ? 'Add Employee' : 'Load Service Record'); ?></button>
                </span><?php
        }
        else
        { ?>

                <div class="div-ex emp-id" id="emp-name">
                    <span class="label-ex">Employee Name:</span> <?php echo($this->getFullName($employee['given_name'], $employee['middle_name'], $employee['family_name'], $employee['spouse_name'], $employee['ext_name'], true)); ?>

                </div><?php
        } ?>

                <div class="div-ex" id="sr-emp-birth-date">
                    <span class="label-ex">Birth Date:</span> <?php echo(is_null($employee) ? '' : date('F j, Y', strtotime($employee['birth_date']))); ?>

                </div>
                <div class="div-ex" id="sr-emp-birth-place">
                    <span class="label-ex">Birth Place:</span> <?php echo(is_null($employee) ? '' : $employee['birth_place']); ?>

                </div><?php
        if (!is_null($employee))
        { ?>

                <div class="div-ex emp-id" id="emp-id">
                    <span class="label-ex">Employee ID:</span> <?php echo($employee['employeeId']); ?>

                </div><?php
        } ?>
        
            </div>

            <div class="button-group-ex sr-control-buttons">
                <span class="button-ex sr-add-record" title="Add new row">
                    <button type="button"<?php echo(is_null($employee) ? ' disabled' : ''); ?> onclick="SeRGS_App.addNewRow();" title="Add new row"><span class="material-icons-round">add</span><span class="hidden">Add <br>Record</span></button>
                </span>
                <span class="button-ex sr-delete-record" title="Delete the entire row of a selected cell">
                    <button type="button" disabled onclick="new DeleteServiceRecordEntryDialog().setup(app.main, this['active_cell'].parentElement, this);" title="Delete the entire row of a selected cell"><span class="material-icons-round">remove</span><span class="hidden">Delete <br>Record</span></button>
                </span>
                <span class="button-ex sr-save-update" title="Update/save service record">
                    <button type="submit" disabled form="sr-table-form" title="Update/save service record"><span class="material-icons-round">save</span><span class="hidden">Update/<br>Save</span></button>
                </span>
                <span class="button-ex sr-revert-cancel" title="Revert/restore service record">
                    <button type="submit" form="sr-loader"<?php echo(!is_null($employee) || $this->error ? '' : ' disabled'); ?> onclick="window.location.replace(window.location.origin + window.location.pathname);"><span class="material-icons-round">restore</span><span class="hidden">Revert/<br>Refresh</span></button>
                </span>
                <span class="button-ex sr-print">
                    <button type="submit" form="sr-printer"><span class="material-icons-round">print</span><span class="hidden"><br>Print</span></button>
                </span>
            </div>

            <form class="data-form-ex sr-table-wrapper" id="sr-table-form" name="sr-table-form" method="GET"><?php
        if (!is_null($employee))
        { ?>

                <input type="hidden" name="a" value="update">
                <input type="hidden" name="update" value="sr">
                <input type="hidden" name="employeeId" value="<?php echo($_REQUEST['employeeId']); ?>"><?php
        } ?>

                <table class="table-ex sr-table" id="sr-table-entry">
                    <thead>
                        <tr>
                            <th colspan="2" data-header-name="service">Service</th>
                            <th colspan="3" data-header-name="appointment">Record of Appointment</th>
                            <th data-header-name="office">Office</th>
                            <th rowspan="3" data-header-name="branch" data-contenteditable="true">Branch</th>
                            <th rowspan="3" data-header-name="lwop_count" data-contenteditable="true">Leave of Absence w/o Pay</th>
                            <th rowspan="3" data-header-name="separation_date" data-contenteditable="true">Date</th>
                        </tr>
                        <tr>
                            <th colspan="2" data-header-name="inclusive_date">(Inclusive Date)</th>
                            <th rowspan="2" data-header-name="designation" data-contenteditable="true">Designation</th>
                            <th rowspan="2" data-header-name="status" data-contenteditable="true">Status</th>
                            <th rowspan="2" data-header-name="salary" data-contenteditable="true">Salary</th>
                            <th rowspan="2" data-header-name="station" data-contenteditable="true">Station/Place</th>
                        </tr>
                        <tr>
                            <th data-header-name="date_start" data-contenteditable="true">From</th>
                            <th data-header-name="date_end" data-contenteditable="true">To</th>
                        </tr>
                    </thead>
                    <tbody><?php 
                    
                    $this->generateSRTableRows($sr); ?>

                    </tbody>
                </table>
            </form>

            <div class="button-group-ex sr-control-buttons" style="text-align: right; font-size: 0.8em;">
                <span class="button-ex sr-add-record" title="Add new row">
                    <button type="button"<?php echo(is_null($employee) ? ' disabled' : ''); ?> onclick="SeRGS_App.addNewRow();" title="Add new row"><span class="material-icons-round">add</span><span class="hidden">Add <br>Record</span></button>
                </span>
                <span class="button-ex sr-delete-record" title="Delete the entire row of a selected cell">
                    <button type="button" disabled onclick="new DeleteServiceRecordEntryDialog().setup(app.main, this['active_cell'].parentElement, this);" title="Delete the entire row of a selected cell"><span class="material-icons-round">remove</span><span class="hidden">Delete <br>Record</span></button>
                </span>
                <span class="button-ex sr-save-update" title="Update/save service record">
                    <button type="submit" disabled form="sr-table-form" title="Update/save service record"><span class="material-icons-round">save</span><span class="hidden">Update/<br>Save</span></button>
                </span>
                <span class="button-ex sr-revert-cancel" title="Revert/restore service record">
                    <button type="submit" form="sr-loader"<?php echo(!is_null($employee) || $this->error ? '' : ' disabled'); ?> onclick="window.location.replace(window.location.origin + window.location.pathname);"><span class="material-icons-round">restore</span><span class="hidden">Revert/<br>Refresh</span></button>
                </span>
                <span class="button-ex sr-print">
                    <button type="submit" form="sr-printer"><span class="material-icons-round">print</span><span class="hidden"><br>Print</span></button>
                </span>
            </div>

            <span class="status-pane multiple" id="sr-status"><?php
            

            $this->displayStatusMessages();

            // DEBUG

            // $this->error = true;

            // DEBUG


            if ($forSRUpdate && !$this->error)
            {
                $this->getDB_SDO()->executeStatement(
                    "DELETE 
                        etos,
                        appmt
                    FROM Emp_Term_of_Service etos
                    INNER JOIN Emp_Appointment appmt ON etos.appointmentId = appmt.emp_appointmentId
                    WHERE personId = " . $employee['personId'] . ";
                    "
                );

                foreach ($sr as &$srTOS)
                {
                    list('tosId' => $tosId, 'errorMsg' => $errorMsg) = $this->dbSaveMatchingTermOfService($srTOS);
                    
                    if ($errorMsg !== '')
                    {
                        echo('<span class="information"><span class="material-icons-round">info</span>');
                        echo($errorMsg);
                        echo('</span>');
                        echo('<hr>');
                    }
                }                 
            } ?>
            
            </span>

            <script>
            "use strict";

            </script>
        </section><?php
    }

    private function generatePrintUI()
    {
        $errorMsg = '';
        $personId = '';
        $employee = null;
        $sr = [];
        $dbResults = null;

        if (isset($_REQUEST['a']) && $_REQUEST['a'] === 'print')
        {
            if (isset($_REQUEST['print']) && $_REQUEST['print'] === 'sr')
            {
                if (isset($_REQUEST['personId']) && is_string($_REQUEST['personId']))
                {
                    if ($_SESSION['user']['sergs_access_level'] > 1 || $_SESSION['user']['sergs_access_level'] === 1 && strval($_SESSION['user']['personId']) === strval($_REQUEST['personId']))
                    {
                        if (is_string($_REQUEST['personId']) && trim($_REQUEST['personId']) !== '')
                        {
                            $personId = $_REQUEST['personId'];
                        }
                        else
                        {
                            $this->error = true;
                            $errorMsg = 'Invalid or missing value';
                        }
                    }
                    else
                    {
                        $this->error = true;
                        $errorMsg = 'Access level is insufficient';
                    }
                }
                else
                {
                    $this->error = true;
                    $errorMsg = 'Unknown data request';
                }
            }
            else
            {
                $this->error = true;
                $errorMsg = 'Unknown print request';
            }
        }
        else
        {
            $this->error = true;
            $errorMsg = 'Unknown request';
        }

        if (!$this->error)
        {
            $dbResults = $this->getDB_SDO()->executeQuery(
                "SELECT
                    Person.personId,
                    given_name,
                    middle_name,
                    family_name,
                    spouse_name,
                    ext_name,
                    post_nominal,
                    birth_date,
                    Address.address AS birth_place,
                    employeeId
                FROM Person
                INNER JOIN Employee ON Person.personId = Employee.personId
                LEFT JOIN Address ON Person.birth_place = Address.addressId
                WHERE Employee.personId = '$personId';"
            );
            if (!is_null($this->getDB_SDO()->lastException))
            {
                $this->error = true;
                $errorMsg = json_encode('Error encountered in querying employee information in database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr);
            }
            elseif (count($dbResults) === 0)
            {
                $this->error = true;
                $errorMsg = json_encode('No results were returned when querying employee information in database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr);
            }
            else
            {
                $employee = $dbResults[0];
                $sr = $this->retrieveSR($personId);
            }
        }

        // echo('<code style="white-space: pre;">');
        // var_dump($employee);
        // var_dump($errorMsg);
        // echo('</code>');

        ?>
        <section id="main-print">
            <div class="button-group-ex print-controls">
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
            <section id="sr-print">
                <header id="sr-header">
                    <h1><img class="deped-logo" src="/images/Department_of_Education.svg" alt="logo:Department of Education" />
                        <span class="header-rp">Republic of the Philippines</span>
                        <span class="header-deped">Department of Education</span>
                        <span class="header-region">Region IV-A CALABARZON</span>
                        <span class="header-sdo">Schools Division of Sto. Tomas City</span>
                    </h1>
                    <h2>Service Record</h2>
                </header>

                <table class="pager">
                    <thead><tr><td></td></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <main id="sr-content">
                                    <div class="emp-info">
                                        <div class="div-ex name">
                                            <span class="label-ex">Name:</span>
                                            <span class="span-ex surname reversed"><span class="blank"><?php echo(is_null($employee['spouse_name']) || trim($employee['spouse_name']) === '' ? $employee['family_name'] : $employee['spouse_name']); ?></span> <span class="label-ex">(surname)</span></span>
                                            <span class="span-ex firstname reversed"><span class="blank"><?php echo($employee['given_name'] . (is_null($employee['ext_name']) || trim($employee['ext_name']) === '' ? '' : ' &nbsp; ' . $employee['ext_name'])); ?></span> <span class="label-ex">(first name)</span></span>
                                            <span class="span-ex middlename reversed"><span class="blank"><?php echo(is_null($employee['spouse_name']) || trim($employee['spouse_name']) === '' ? (is_null($employee['middle_name']) || trim($employee['middle_name']) === '' ? '&nbsp;' : $employee['middle_name']) : $employee['family_name']); ?></span> <span class="label-ex">(middle name)</span></span>
                                            <span class="span-ex name-comment">(If married, give also full name and other surname used)</span>
                                        </div>
                                        <div class="div-ex birth">
                                            <span class="label-ex">Birth:</span>
                                            <span class="span-ex birthdate reversed"><span class="blank"><?php echo($employee['birth_date'] ?? '&nbsp;'); ?></span> <span class="label-ex">(date)</span></span>
                                            <span class="span-ex birthplace reversed"><span class="blank"><?php echo($employee['birth_place'] ?? '&nbsp;'); ?></span> <span class="label-ex">(place)</span></span>
                                            <span class="span-ex birth-comment">(Date herein should be checked from birth baptismal certificate of some official documents)</span>
                                        </div>
                                        <div class="div-ex employeeId">
                                            <span class="label-ex">Emp. No.:</span> <span class="blank"><?php echo($employee['employeeId']); ?></span>
                                        </div>
                                    </div>

                                    <div class="div-ex sr-table-wrapper">
                                        <p class="prenote">This is to certify that the employee named herein above actually rendered service in this office or office as indicated below, each line of which is supported by appointment and other papers actually issued and approved by the authorities concerned.</p>
                                        <table class="table-ex sr-table" id="sr-table-view">
                                            <thead>
                                                <tr>
                                                    <th colspan="2" data-header-name="service">Service</th>
                                                    <th colspan="3" data-header-name="appointment">Record of Appointment</th>
                                                    <th data-header-name="office">Office</th>
                                                    <th rowspan="3" data-header-name="branch" data-contenteditable="true">Branch</th>
                                                    <th rowspan="3" data-header-name="lwop_count" data-contenteditable="true">Leave of Absence w/o Pay</th>
                                                    <th rowspan="3" data-header-name="separation_date" data-contenteditable="true">Date</th>
                                                </tr>
                                                <tr>
                                                    <th colspan="2" data-header-name="inclusive_date">(Inclusive Date)</th>
                                                    <th rowspan="2" data-header-name="designation" data-contenteditable="true">Designation</th>
                                                    <th rowspan="2" data-header-name="status" data-contenteditable="true">Status</th>
                                                    <th rowspan="2" data-header-name="salary" data-contenteditable="true">Salary</th>
                                                    <th rowspan="2" data-header-name="station" data-contenteditable="true">Station/Place</th>
                                                </tr>
                                                <tr>
                                                    <th data-header-name="date_start" data-contenteditable="true">From</th>
                                                    <th data-header-name="date_end" data-contenteditable="true">To</th>
                                                </tr>
                                            </thead>
                                            <tbody><?php
        if (is_null($sr) || count($sr) === 0)
        { ?>

                                                <tr>
                                                    <td colspan="9">Not available. To request a service record update, please click <a href="/sergs/requests/new_request/" title="Request for a service record">here</a>.</td>
                                                </tr><?php
        }
        else
        {
            // for ($i = 0; $i < 15; $i++)    // DEBUG
            // {                               // DEBUG
            $this->generateSRTableRows($sr);
            // }                               // DEBUG
        } ?>

                                            </tbody>
                                        </table>
                                        <p class="postnote">Issued in compliance with Executive Order No. 54 dated August 10, 1954 and in accordance with Circular No. 58 dated August 10, 1954 of the system.</p>

                                        <div class="div-ex sr-signatories"><!-- TEMP -->
                                            <span class="span-ex certifier">
                                                <span class="name">Jessamae O. Castromero</span>
                                                <span class="position">AO II/OIC-Administrative Office IV</span>
                                            </span>
                                            <span class="span-ex approver">
                                                <span class="name">Catalina M. Calinawan</span>
                                                <span class="position">AO II/OIC-Administrative Office V</span>
                                            </span>
                                        </div>
                                    </div>
                                </main>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot><tr><td></td></tr></tfoot>
                </table>

                <footer id="sr-footer">
                    <div class="div-ex content">
                        <img class="sdo-logo" src="/images/logo-depedstotomas.webp" alt="logo:Department of Education" />
                        <p><span class="material-icons-round">pin_drop</span> Brgy. Poblacion IV, Sto. Tomas City, Batangas</p>
                        <p><span class="material-icons-round">alternate_email</span> sdo.santotomas@deped.gov.ph</p>
                        <p><span class="material-icons-round">phone</span> (043) 702-8674</p>
                    </div>
                </footer>
            </section>
        </section><?php
    }

    private function generateTempUI($pageId)
    { ?>
        <section id="main-<?php echo $pageId;?>" class="under-construction">
            <h2><?php echo strtoupper($pageId[0]) . substr($pageId, 1);?></h2>
            <p class="center"><em>This page is under construction. Please bear with us.</em></p>
        </section><?php
    }

    private function generateForbidden()
    { ?>
        <section id="main-forbidden">
            <h2><span class="material-icons-round red" style="font-weight: bold; vertical-align: middle;">block</span> Unauthorized Access <span class="material-icons-round red" style="font-weight: bold; vertical-align: middle;">front_hand</span></h2>
            <p class="center">Your user access level is not allowed to access this interface.</p>
            <p class="center">Click <a href="?a=logout" title="Sign out">here to sign out</a> or <a href="/" title="SDO Services Home">here to return to SDO Services Home</a>.</p>
            <p class="center">Thank you.</p>
        </section><?php
    }

    private function dbGetMatchingTermOfService($srTOS)
    {
        $errorMsg = '';

        $dateStart = $srTOS['date_start'];
        $dateEnd = $srTOS['date_end'];
        
        list('appointment' => $appointment, 'errorMsg' => $errMsg) = $this->dbGetMatchingEmpAppointment($srTOS['appointment']);

        if ($errMsg !== '')
        {
            return array('term_of_service' => null, 'errorMsg' => $errMsg);
        }

        $appointmentId = $appointment['emp_appointmentId'];

        $dbResults = $this->getDB_SDO()->executeQuery(
            "SELECT
                emp_term_of_serviceId,
                etos.date_rangeId,
                dater.date_start,
                dater.date_end,
                etos.workplaceId,
                addr.address AS station_address,
                inst.institution_name AS station,
                status,
                enumstat.appointment_status AS status_text,
                salary,
                branch,
                lwop_count,
                separation_date
            FROM Emp_Term_of_Service etos
            INNER JOIN (SELECT * FROM SDOStoTomas.Date_Range WHERE description = 'Term of Service') dater ON etos.date_rangeId = dater.date_rangeId
            LEFT JOIN Workplace workpl ON etos.workplaceId = workpl.workplaceId
            INNER JOIN Institution inst ON workpl.institutionId = inst.institutionId
            INNER JOIN Address addr ON workpl.addressId = addr.addressId
            INNER JOIN ENUM_Emp_Appointment_Status enumstat ON etos.status = enumstat.index
            WHERE appointmentId = $appointmentId
                AND date_start = '$dateStart'
                AND (date_end IS NULL OR date_end = '$dateEnd')
            ;"
        );

        if (!is_null($this->getDB_SDO()->lastException))
        {
            $errorMsg .= 'Error encountered in querying employee service record from the database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr . '<br><hr>';

            return array('term_of_service' => null, 'errorMsg' => $errorMsg);
        }
        elseif (count($dbResults) === 0)
        {
            return array('term_of_service' => null, 'errorMsg' => $errorMsg);
        }
        else
        {
            $dbResults[0]['appointment'] = &$appointment;
    
            return array('term_of_service' => $dbResults[0], 'errorMsg' => $errorMsg);
        }
    }

    private function dbSaveMatchingTermOfService(&$srTOS) // THIS FUNCTION EXPECTS ALL EXISTING TOS TO BE ALREADY DELETED!!!!!!!!
    {
        list('appointmentId' => $appointmentId, 'errorMsg' => $errorMsg) = $this->dbUpdateMatchingEmpAppointment($srTOS['appointment']);
        
        if ($errorMsg !== '')
        {
            return array('tosId' => null, 'errorMsg' => $errorMsg);
        }

        list('date_rangeId' => $dateRangeId, 'errorMsg' => $msg) = $this->dbSaveMatchingDateRange($srTOS['date_start'], $srTOS['date_end'], 'Term of Service');

        if ($errorMsg !== '')
        {
            return array('tosId' => null, 'errorMsg' => $errorMsg);
        }

        list('workplaceId' => $workplaceId, 'errorMsg' => $msg) = $this->dbGetMatchingOfficeStationId($srTOS['station']);

        if ($errorMsg !== '')
        {
            return array('tosId' => null, 'errorMsg' => $errorMsg);
        }

        list('fieldStr' => $fieldStr, 'valueStr' => $valueStr) = $this->generateDBFieldValueStr(array(
            'date_rangeId' => $dateRangeId,
            'appointmentId' => $appointmentId,
            'workplaceId' => $workplaceId,
            'status' => $srTOS['status'],
            'salary' => $srTOS['salary'],
            'branch' => $srTOS['branch'],
            'lwop_count' => $srTOS['lwop_count'],
            'separation_date' => $srTOS['separation_date'],
        ));

        $tosId = $this->getDB_SDO()->insert('Emp_Term_of_Service', "($fieldStr)", "($valueStr)");

        if (!is_null($this->getDB_SDO()->lastException))
        {
            $errorMsg .= 'Error encountered while inserting term of service information into the database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr . '<br><hr>';

            return array('tosId' => null, 'errorMsg' => $errorMsg);
        }

        return array('tosId' => $tosId, 'errorMsg' => $errorMsg);
    }

    private function dbGetMatchingEmpAppointment($appointment)
    {
        $errorMsg = '';

        $designation = $appointment['designation'];
        $personId = $appointment['personId'];
        $dateStart = $appointment['date_start'];
        $dateEnd = $appointment['date_end'];

        $dbResults = $this->getDB_SDO()->executeQuery(
            "SELECT
                emp_appointmentId,
                designation,
                personId,
                employeeId,
                appointment_number,
                plantilla_item_number,
                appmt.date_rangeId,
                date_start,
                date_end
            FROM Emp_Appointment appmt
            INNER JOIN Date_Range dater ON appmt.date_rangeId=dater.date_rangeId
            WHERE designation='$designation'
                AND personId='$personId'
                AND date_start='$dateStart'
                AND (date_end IS NULL OR date_end>='$dateEnd')
            ;"
        );

        if (!is_null($this->getDB_SDO()->lastException))
        {
            $errorMsg .= 'Error encountered in querying employee appointment information from the database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr . '<br><hr>';

            return array('appointment' => null, 'errorMsg' => $errorMsg);
        }
        elseif (count($dbResults) > 1)
        {
            $errorMsg .= 'Error: Multiple appointments match the query where only a single match is expected.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr . '<br><hr>';

            return array('appointment' => null, 'errorMsg' => $errorMsg);
        }

        return array('appointment' => (count($dbResults) === 0 ? null : $dbResults[0]), 'errorMsg' => $errorMsg);
    }

    private function dbUpdateMatchingEmpAppointment(&$appointment) // first time
    {
        $errorMsg = '';
        $dbAppointment = null;

        $designation = &$appointment['designation'];
        $personId = &$appointment['personId'];
        $employeeId = &$appointment['employeeId'];
        $appointmentNumber = &$appointment['appointment_number'];
        $plantillaItemNumber = &$appointment['plantilla_item_number'];
        $dateStart = &$appointment['date_start'];
        $dateEnd = &$appointment['date_end'];

        $dbResults = $this->getDB_SDO()->select('Position', 'plantilla_item_number', "WHERE plantilla_item_number='$employeeId';");

        if (!is_null($this->getDB_SDO()->lastException))
        {
            $errorMsg .= 'Error encountered in querying position information from the database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr . '<br><hr>';

            return array('appointmentId' => null, 'errorMsg' => $errorMsg);
        }
        elseif (count($dbResults) === 0)
        {
            $appointmentNumber = $appointment['employeeId'];
        }
        else
        {
            $plantillaItemNumber = $appointment['employeeId'];
        }

        list('appointment' => $dbAppointment, 'errorMsg' => $msg) = $this->dbGetMatchingEmpAppointment($appointment);

        if ($msg !== '')
        {
            return array('appointmentId' => null, 'errorMsg' => $msg);
        }
        elseif (is_null($dbAppointment)) // to create new
        {
            list('date_rangeId' => $dateRangeId, 'errorMsg' => $msg) = $this->dbSaveMatchingDateRange($dateStart, $dateEnd, 'Appointment');

            if (!is_null($this->getDB_SDO()->lastException) || ($msg !== '' && is_null($dateRangeId))) // date_rangeId can also turn out null when querying the DB, however the operation is dbSaveMatchingDateRange, which should ALWAYS return a date_rangeId unless an error prevents so
            {
                return array('appointmentId' => null, 'errorMsg' => $msg);
            }
    
            list('fieldStr'=>$fieldStr, 'valueStr'=>$valueStr, 'fieldValueStr'=>$fieldValueStr) = $this->generateDBFieldValueStr(array(
                'designation' => $designation,
                'personId' => $personId,
                'employeeId' => $employeeId,
                'appointment_number' => $appointmentNumber,
                'plantilla_item_number' => $plantillaItemNumber,
                'date_rangeId' => $dateRangeId
            ));
    
            $appointmentId = $this->getDB_SDO()->insert('Emp_Appointment', "($fieldStr)", "($valueStr)");
        }
        else // to update
        {
            $appointmentId = $dbAppointment['emp_appointmentId'];

            list('fieldValueStr'=>$fieldValueStr) = $this->generateDBFieldValueStr(array(
                'appointment_number' => $appointmentNumber,
                'plantilla_item_number' => $plantillaItemNumber
            ));

            $this->getDB_SDO()->update('Emp_Appointment', $fieldValueStr, "WHERE emp_appointmentId='$appointmentId';");

            if (!is_null($this->getDB_SDO()->lastException))
            {
                $errorMsg .= 'Error encountered in updating employee appointment information in the database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr . '<br><hr>';
            }
        }

        return array('appointmentId' => $appointmentId, 'errorMsg' => $errorMsg);
    }

    private function dbGetMatchingDateRange($dateStart, $dateEnd, $description)
    {
        $errorMsg = '';

        if (is_null($dateStart))
        {
            $errorMsg .= 'Invalid start date specified.<br><hr>';

            return array('date_rangeId' => null, 'errorMsg' => $errorMsg);
        }

        $dbResults = $this->getDB_SDO()->select('Date_Range', '*', "WHERE description='$description' AND date_start='$dateStart' AND date_end" . (is_null($dateEnd) ? ' IS NULL' : "='$dateEnd'"));

        if (!is_null($this->getDB_SDO()->lastException))
        {
            $errorMsg .= 'Error encountered in querying date information from the database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr . '<br><hr>';

            return array('date_rangeId' => null, 'errorMsg' => $errorMsg);
        }

        return array('date_rangeId' => (count($dbResults) === 0 ? null : $dbResults[0]['date_rangeId']), 'errorMsg' => $errorMsg);
    }

    private function dbSaveMatchingDateRange($dateStart, $dateEnd, $description) // wont duplicate date ranges
    {
        $errorMsg = '';

        list('date_rangeId' => $dateRangeId, 'errorMsg' => $errMsg) = $this->dbGetMatchingDateRange($dateStart, $dateEnd, $description);
        
        if ($errMsg !== '')
        {
            $errorMsg .= $errMsg;

            return array('date_rangeId' => $dateRangeId, 'errorMsg' => $errorMsg);
        }
        elseif (!is_null($dateRangeId))
        {
            $errorMsg .= 'Warning: Date range already exists.<br><hr>';

            return array('date_rangeId' => $dateRangeId, 'errorMsg' => $errorMsg);
        }

        $dateRangeId = $this->getDB_SDO()->insert('Date_Range', '(date_start, date_end, description)', "('$dateStart', " . (is_null($dateEnd) ? 'NULL' : "'$dateEnd'") . ", '$description')");

        if (!is_null($this->getDB_SDO()->lastException))
        {
            $errorMsg .= 'Error encountered in inserting date information into the database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr . '<br><hr>';

            return array('date_rangeId' => null, 'errorMsg' => $errorMsg);
        }

        return array('date_rangeId' => $dateRangeId, 'errorMsg' => $errorMsg);
    }

    private function dbGetMatchingOfficeStationId($stationName)
    {
        $errorMsg = '';

        if (!is_string($stationName) || trim($stationName) === '')
        {
            return array('workplaceId' => null, 'errorMsg' => $errorMsg);
        }

        
        $dbResults = $this->getDB_SDO()->executeQuery( 
            "SELECT
                inst.*,
                pinst.institution_name AS umbrella_institution
            FROM Institution inst
            LEFT JOIN Institution pinst ON inst.umbrella_institutionId = pinst.institutionId
            WHERE inst.institution_name = '$stationName';"
        );
        
        if (!is_null($this->getDB_SDO()->lastException))
        {
            $errorMsg .= 'Error encountered in querying office station information from the database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr . '<br><hr>';
            
            return array('workplaceId' => null, 'errorMsg' => $errorMsg);
        }
        elseif (count($dbResults) === 0)
        {
            $institutionId = $this->getDB_SDO()->insert('Institution', '(institution_name)', "('$stationName')");
            
            if (!is_null($this->getDB_SDO()->lastException))
            {
                echo($stationName . '<br>' . var_export($this->getDB_SDO()->lastSQLStr, true) . '<hr>');
                $errorMsg .= 'Error encountered in inserting office station name into the database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr . '<br><hr>';
    
                return array('workplaceId' => null, 'errorMsg' => $errorMsg);
            }
        }
        else
        {
            $institutionId = $dbResults[0]['institutionId'];
        }

        $dbResults = $this->getDB_SDO()->select('Workplace', 'workplaceId', "WHERE institutionId = '$institutionId'");

        if (!is_null($this->getDB_SDO()->lastException))
        {
            $errorMsg .= 'Error encountered in querying office station information from the database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr . '<br><hr>';

            return array('workplaceId' => null, 'errorMsg' => $errorMsg);
        }
        elseif (count($dbResults) === 0)
        {
            $workplaceId = $this->getDB_SDO()->insert('Workplace', '(institutionId)', "($institutionId)");

            if (!is_null($this->getDB_SDO()->lastException))
            {
                $errorMsg .= 'Error encountered in inserting office station information into the database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr . '<br><hr>';
    
                return array('workplaceId' => null, 'errorMsg' => $errorMsg);
            }
        }
        else
        {
            $workplaceId = $dbResults[0]['workplaceId'];
        }        

        return array('workplaceId' => $workplaceId, 'errorMsg' => $errorMsg);
    }

    private function getFullName($givenName, $middleName, $familyName, $spouseName, $extName, $lastNameFirst = false, $middleInitialOnly = true, $includeAllMiddleNames = false)
    {
        $nameArr = null;
        
        if (!is_string($givenName) || trim($givenName) === '')
        {
            // die('Invalid argument: $givenName:' . $givenName);
            $this->jsErrorMsgBox('Given name is required.<br><br>Invalid argument: $givenName:' . $givenName);
        }
        
        $nameArr = array($givenName, $middleName, $familyName, $spouseName, $extName);
        
        if ($lastNameFirst)
        {
            for ($i = count($nameArr) - 2; $i > 0; $i--)
            {
                $lastName = array_splice($nameArr, $i, 1)[0];
                
                if (is_string($lastName) && trim($lastName) !== '')
                {
                    array_unshift($nameArr, $lastName . ", ");
                    break;
                }
            }
            
            if ($middleInitialOnly && count($nameArr) > 3)
            {
                $nameArr[2] = $this->getNameInitials($nameArr[2]);
            }
            
            if ($middleInitialOnly && count($nameArr) > 4)
            {
                $nameArr[3] = $this->getNameInitials($nameArr[3]);
            }

            if (!$includeAllMiddleNames && count($nameArr) > 4)
            {
                $removedMiddleName = array_splice($nameArr, 2, 1)[0];
            }
        }
        elseif ($middleInitialOnly)
        {
            $nameArr[1] = $this->getNameInitials($nameArr[1]);

            if ($middleInitialOnly && $nameArr[3] !== '')
            {
                $nameArr[2] = $this->getNameInitials($nameArr[2]);
            }

            if (!$includeAllMiddleNames && $nameArr[3] !== '')
            {
                $removedMiddleName = array_splice($nameArr, 1, 1)[0];
            }
        }
        
        return join(' ', array_filter($nameArr, function($name){ return is_string($name) && trim($name) !== ''; }));
    }

    private function getNameInitials($nameStr)
    {
        return (!is_string($nameStr) || trim($nameStr) === '' ? '' : join(' ', array_map(function($name){ return $name[0] . '.'; }, preg_split('/ /', $nameStr))));
    }

    private function br()
    {
        ?><br><?php
    }

    private function filterEmployee($employees) // should be run after retrieving employess from DB
    {
        $employee = null;

        if (is_null($this->getDB_SDO()->lastException) && !is_null($employees) && count($employees) > 0 && isset($_REQUEST['employeeId']) && is_string($_REQUEST['employeeId']) && trim($_REQUEST['employeeId']) !== '')
        {
            try
            {
                $employee = array_values(array_filter($employees, function($emp){
                    return $emp['employeeId'] === $_REQUEST['employeeId'];
                }))[0];
            }
            catch(Exception $ex)
            {
                $this->error = true;
                $this->jsExceptionMsgBox('Exception encountered in querying employee information in database.<br><br>Message: ' . $ex->getMessage());
            }
            catch(Error $err)
            {
                $this->error = true;
                $this->jsErrorMsgBox('Error encountered in querying employee information in database.<br><br>Message: ' . $err->getMessage());
            }
        }
        else
        {
            $this->error = true;
            $this->jsErrorMsgBox('Error encountered in querying employee information in database. Returned result list might be zero length or empty.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr);
        }

        return $employee;
    }

    private function retrieveSR($personId)
    {
        $sr = [];
        $dbSR = null;
        $dbAppointments = null;

        if (!$this->error)
        {
            $dbSR = $this->getDB_SDO()->executeQuery(
                "SELECT 
                    etos.*,
                    dater.date_rangeId,
                    date_start,
                    date_end,
                    designation,
                    appointment_number,
                    plantilla_item_number,
                    status,
                    institution_name AS station,
                    salary,
                    branch,
                    lwop_count,
                    separation_date
                FROM Emp_Term_of_Service etos
                INNER JOIN Emp_Appointment appmt ON etos.appointmentId = appmt.emp_appointmentId
                INNER JOIN Date_Range dater ON etos.date_rangeId = dater.date_rangeId
                LEFT JOIN Workplace workpl ON etos.workplaceId = workpl.workplaceId
                LEFT JOIN Institution inst ON workpl.institutionId = inst.institutionId
                WHERE personId = '$personId';"
            );

            if (!is_null($this->getDB_SDO()->lastException))
            {
                $this->error = true;
                $this->jsErrorMsgBox('Error encountered while fetching employee term of service information from the database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr);
            }

            if (count($dbSR) > 0)
            {
                $dbAppointments = $this->getDB_SDO()->executeQuery(
                    "SELECT 
                        emp_appointmentId,
                        designation,
                        personId,
                        employeeId,
                        appointment_number,
                        plantilla_item_number,
                        dater.date_rangeId,
                        date_start,
                        date_end
                    FROM Emp_Appointment appmt
                    INNER JOIN Date_Range dater ON appmt.date_rangeId = dater.date_rangeId
                    WHERE personId = '$personId';"
                );

                if (!is_null($this->getDB_SDO()->lastException))
                {
                    $this->error = true;
                    $this->jsErrorMsgBox('Error encountered while fetching employee appointment information from the database.' . (is_null($this->getDB_SDO()->lastException) ? '' : '<br><br>' . $this->getDB_SDO()->lastException->getMessage()) . '<br><br>Last SQL String: ' . $this->getDB_SDO()->lastSQLStr);
                }

                foreach ($dbSR as $dbSRTOS) {
                    array_push($sr, []);

                    foreach([
                        'date_start',
                        'date_end',
                        'designation',
                        'status',
                        'salary',
                        'station',
                        'branch',
                        'lwop_count',
                        'separation_date'
                    ] as $key)
                    {
                        $sr[count($sr) - 1][$key] = ($dbSRTOS[$key] === '' ? null : $dbSRTOS[$key]);
                    }

                    $appointments = array_values(array_filter($dbAppointments, fn($dbAppmt) => $dbAppmt['emp_appointmentId'] === $dbSRTOS['appointmentId']));
                    $sr[count($sr) - 1]['appointment'] = (count($appointments) === 0 ? null : $appointments[0]);
                }
            }
        }

        return $sr;
    }

    private function generateSRTableRows($sr)
    {
        foreach ($sr as &$srTOS)
        { ?>

                        <tr><?php
            $i = array_search($srTOS, $sr, true);
            
            $invalidDateStartClass = '';
            $invalidDateEndClass = '';
            $invalidDesignationClass = '';
            $invalidStatusClass = '';
            $invalidSalaryClass = '';
            $invalidStationClass = '';
            
            if (is_null($srTOS['date_start']))
            {
                if (is_null($srTOS['date_end']))
                {
                    $invalidDateStartClass .= ' error-missing-date-range';
                    $invalidDateEndClass .= ' error-missing-date-range';
                    
                    $this->multipleStatus .= (trim($this->multipleStatus) === '' ? '' : '<hr>') . '<span class="error" title="Status type: Error"><span class="material-icons-round" title="Status type: Error">cancel</span> Missing date range in row ' . ($i + 1) . '</span>';
                    $this->error = true;
                }
                else
                {
                    $invalidDateStartClass .= ' error-missing-from-date';
                    
                    $this->multipleStatus .= (trim($this->multipleStatus) === '' ? '' : '<hr>') . '<span class="error" title="Status type: Error"><span class="material-icons-round" title="Status type: Error">cancel</span> Missing "From" date in row ' . ($i + 1) . '</span>';
                    $this->error = true;
                }
            }
            elseif (!is_null($srTOS['date_end']) && $srTOS['date_start'] >= $srTOS['date_end'])
            {
                $invalidDateStartClass .= ' error-invalid-date-range';
                $invalidDateEndClass .= ' error-invalid-date-range';
                
                $this->multipleStatus .= (trim($this->multipleStatus) === '' ? '' : '<hr>') . '<span class="error" title="Status type: Error"><span class="material-icons-round" title="Status type: Error">cancel</span> Invalid date range in row ' . ($i + 1) . '</span>';
                $this->error = true;
            }
            
            if ($i < count($sr) - 1 && $srTOS['date_start'] >= $sr[$i + 1]['date_start'])
            {
                $invalidDateStartClass .= ' warning-overlapping-date-ranges';
                $invalidDateEndClass .= ' warning-overlapping-date-ranges';
                
                $this->multipleStatus .= (trim($this->multipleStatus) === '' ? '' : '<hr>') . '<span class="warning" title="Status type: Warning"><span class="material-icons-round" title="Status type: Warning">warning</span> Overlapping date ranges in rows ' . ($i + 1) . ' and ' . ($i + 2) . '</span>';
            }
            elseif ($i < count($sr) - 1 && ((!is_null($srTOS['date_start']) && is_null($srTOS['date_end']) && !is_null($sr[$i + 1]['date_start'])) || $srTOS['date_end'] >= $sr[$i + 1]['date_start']))
            {
                $invalidDateEndClass .= ' warning-overlapping-date-ranges';
                
                $this->multipleStatus .= (trim($this->multipleStatus) === '' ? '' : '<hr>') . '<span class="warning" title="Status type: Warning"><span class="material-icons-round" title="Status type: Warning">warning</span> Overlapping date ranges in rows ' . ($i + 1) . ' and ' . ($i + 2) . '</span>';
            }
            elseif ($i > 0 && ($sr[$i - 1]['date_start'] >= $srTOS['date_start'] || (!is_null($sr[$i - 1]['date_start']) && is_null($sr[$i - 1]['date_end']) && !is_null($srTOS['date_start'])) || $sr[$i - 1]['date_end'] >= $srTOS['date_start']))
            {
                $invalidDateStartClass .= ' warning-overlapping-date-ranges';
                
                // $this->multipleStatus .= (trim($this->multipleStatus) === '' ? '' : '<hr>') . 'Overlapping date ranges in rows ' . ($i) . ' and ' . ($i + 1) . '</span>'; // will only duplicate the above error status
            }
            
            if (is_null($srTOS['designation']))
            {
                $invalidDesignationClass = 'error-missing-designation';
                $this->multipleStatus .= (trim($this->multipleStatus) === '' ? '' : '<hr>') . '<span class="error" title="Status type: Error"><span class="material-icons-round" title="Status type: Error">cancel</span> Missing designation in row ' . ($i + 1) . '</span>';
                $this->error = true;
            }
            
            if (is_null($srTOS['status']) || $srTOS['status'] < 1)
            {
                $invalidStatusClass = 'error-missing-status';
                $this->multipleStatus .= (trim($this->multipleStatus) === '' ? '' : '<hr>') . '<span class="error" title="Status type: Error"><span class="material-icons-round" title="Status type: Error">cancel</span> Missing status in row ' . ($i + 1) . '</span>';
                $this->error = true;
            }
            
            if (is_null($srTOS['salary']))
            {
                $invalidSalaryClass = 'warning-missing-salary';
                $this->multipleStatus .= (trim($this->multipleStatus) === '' ? '' : '<hr>') . '<span class="warning" title="Status type: Warning"><span class="material-icons-round" title="Status type: Warning">warning</span> Missing salary in row ' . ($i + 1) . '</span>';
            }
            
            if (is_null($srTOS['station']))
            {
                $invalidStationClass = 'warning-missing-station';
                $this->multipleStatus .= (trim($this->multipleStatus) === '' ? '' : '<hr>') . '<span class="warning" title="Status type: Warning"><span class="material-icons-round" title="Status type: Warning">warning</span> Missing office/station in row ' . ($i + 1) . '</span>';
            }
            
            foreach ($srTOS as $key => $value)
            { 
                switch ($key)
                {
                    case "date_start":
                    case "date_end":
                    case "designation": case "status": case "salary":
                    case "station": case "branch": case "lwop_count":
                    case "separation_date": ?>

                            <td <?php echo($key === 'date_start' && trim($invalidDateStartClass) !== '' ? ' class=' . trim($invalidDateStartClass) : ($key === 'date_end' && trim($invalidDateEndClass) !== '' ? ' class=' . trim($invalidDateEndClass) : ($key === 'designation' && trim($invalidDesignationClass) !== '' ? 'class=' . trim($invalidDesignationClass) : ($key === 'status' && trim($invalidStatusClass) !== '' ? 'class=' . trim($invalidStatusClass) : ($key === 'salary' && trim($invalidSalaryClass) !== '' ? 'class=' . trim($invalidSalaryClass) : ($key === 'station' && trim($invalidStationClass) !== '' ? 'class=' . trim($invalidStationClass) : '')))))); ?>><?php echo($key === 'date_start' || $key === 'date_end' || $key === 'separation_date' ? preg_replace('/(\d\d\d\d)-(\d\d)-(\d\d)/', '\2/\3/\1', (is_null($value) ? ($key === 'date_end' ? 'present' : '') : $value)) : ($key === 'status' ? (is_null($value) || $value === '-1' || $value === '' ? '' : $this->enum['appointmentStatus'][array_search($value, array_column($this->enum['appointmentStatus'], 'index'))]['appointment_status']) : $value)); ?></td><?php
                        break;
                    default:
                        break;
                }
            } ?>

                        </tr><?php
        }
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
    
    private function jsMsgBox($caption, $msg, $type = 0, $funcName = "serverMsg")
    {
        $funcName .= $this->jsTailScriptCount;
        $typeIcon = ($type > 0 && $type < 8 ? '<span class=\"material-icons-round'
            . ($type === 1 ? ' blue' : ($type === 2 ? ' green' : ($type === 3 ? ' orange' : ($type === 4 ? ' orange' : ($type === 5 ? ' crimson' : ($type === 6 ? ' red' : ' magenta'))))))
            . ' message-box-icon\">'
            . ($type === 1 ? 'info' : ($type === 2 ? 'check_circle' : ($type === 3 ? 'cancel' : ($type === 4 ? 'warning' : ($type === 5 ? 'error' : ($type === 6 ? 'error' : 'bug_report'))))))
            . '</span> ' : '');
        
        ?>
<script>
function <?php echo($funcName); ?>() {
    new MessageBox().setup(app.main, "<?php echo(htmlentities($caption, ENT_QUOTES)); ?>", ("<?php echo($typeIcon . htmlentities($msg, ENT_QUOTES)); ?>").replace(/&lt;(.+?)&gt;/g, "<$1>"));
}
</script><?php
        $this->jsTailScripts .= "if ($funcName !== null && $funcName !== undefined && ElementEx.type($funcName) === \"function\")\n{\n    $funcName();\n}\n";
        $this->jsTailScriptCount++;
    }

    private function jsMsgConsole($msg, $funcName = "serverMsg")
    {
        $funcName .= $this->jsTailScriptCount; ?>
<script>
function <?php echo($funcName); ?>() {
    console.log(JSON.parse("<?php echo(preg_replace('/"/', '\"', $msg)); ?>"));
}
</script><?php
        $this->jsTailScripts += "if ($funcName !== null && $funcName !== undefined && ElementEx.type($funcName) === \"function\")\n{\n    $funcName();\n}\n";
        $this->jsTailScriptCount++;
    }

    private function jsSimpleMsgBox($msg)
    { 
        $this->jsMsgBox('SeRGS Message', $msg, 0, 'simpleMsg');
    }
        
    private function jsInfoMsgBox($msg)
    { 
        $this->jsMsgBox('SeRGS Info', $msg, 1, 'infoMsg');
    }
        
    private function jsSuccessMsgBox($msg)
    { 
        $this->jsMsgBox('SeRGS Info', $msg, 2, 'infoMsg');
    }
        
    private function jsFailMsgBox($msg)
    { 
        $this->jsMsgBox('SeRGS Info', $msg, 3, 'infoMsg');
    }
        
    private function jsWarningMsgBox($msg)
    { 
        $this->jsMsgBox('SeRGS Warning', $msg, 4, 'infoMsg');
    }
        
    private function jsExceptionMsgBox($exceptionMsg)
    { 
        $this->jsMsgBox('SeRGS Exception', $exceptionMsg, 5, 'exceptionMsg');
    }
        
    private function jsErrorMsgBox($errMsg)
    { 
        $this->jsMsgBox('SeRGS Error', $errMsg, 6, 'errorMsg');
    }

    private function jsDebugMsgBox($debugMsg)
    { 
        $this->jsMsgBox('SeRGS Debug', $debugMsg, 7, 'debugMsg');
    }

    private function jsDebugConsole($msg)
    { 
        $this->jsMsgConsole("SeRGS Debug:\n " . $msg);
    }
}
?>