<?php E_STRICT;

require_once(__FILE_ROOT__ . '/php/classes/app.php');
require_once(__FILE_ROOT__ . '/php/enums/pagetypes.php');
require_once(__FILE_ROOT__ . '/php/audit/log.php');
require_once(__FILE_ROOT__ . '/php/secure/validateUser.php');

class SeRGS_App extends App
{
    public function __construct()
    {
        $this->setName("Service Record Generation System");
        $this->setDynamic(true);
        
        require_once(__FILE_ROOT__ . '/php/secure/dbcreds.php');
        
        $this->addDBConn(new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, 'ISCreAMS'));
        require_once(__FILE_ROOT__ . '/sergs/php/db-ddl.php');
        $this->addDBConn(new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $dbname, $ddl));
    }

    protected function getDB_ISCreAMS()
    {
        return $this->getDBConn(0);
    }

    protected function getDB_SDO()
    {
        return $this->getDBConn(1);
    }

    protected function getUserAccessLevel()
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
?>
<!DOCTYPE html>
<html lang="en">
<?php require_once(__FILE_ROOT__ . '/php/snippets/html_head.php');?>
<body>
    <div id="sergs" class="app">
<?php
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

        require_once(__FILE_ROOT__ . '/php/snippets/header_full.php'); // general header
        require_once(__FILE_ROOT__ . '/php/snippets/nav_full.php'); // general nav
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
                    case "other-sr":
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

</main>
<?php
require_once(__FILE_ROOT__ . '/php/snippets/footer_full.php');
require_once(__FILE_ROOT__ . '/php/snippets/html_tail.php');
?>
    </div>
</body>
<script src="/sergs/js/sergs.js"></script>
</html>
<?php
    } // function run()

    protected function generateDashboardUI()
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
            <input type="hidden" name="redir" value="/sergs/sr/my_service_record">
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

    protected function generateSRUI()
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

    protected function generateMySRUI()
    {
        $accessLevel = $this->getUserAccessLevel();
        
        if ($accessLevel < 1)
        {
            $this->generateForbidden();
            return;
        } ?>
    <section id="main-view-my-sr">
        <h2>My Service Record</h2>
        
        <div class="div-ex view-contents">
            <div class="div-ex my-sr">
                <div class="div-ex my-sr-name">
                    <span class="label-ex">Name:</span>
                    <?php echo($this->getFullName($_SESSION['user']['given_name'], $_SESSION['user']['middle_name'], $_SESSION['user']['family_name'], $_SESSION['user']['spouse_name'], $_SESSION['user']['ext_name'], true)); ?>
                </div>
                <div class="div-ex my-sr-birthdate">
                    <span class="label-ex">Birth Date:</span>
                    <?php echo($_SESSION['user']['birth_date']); ?>
                </div>
                <div class="div-ex my-sr-birthplace">
                    <span class="label-ex">Birth Place:</span>
                    <?php echo($_SESSION['user']['birth_place']); ?>
                </div>
                <div class="div-ex my-sr-emp-no">
                    <span class="label-ex">Emp. No.:</span>
                    <?php echo($_SESSION['user']['employeeId']); ?>
                </div>

                <div class="div-ex sr-table-wrapper">
                    Not available. To request a service record update, please click <a href="/sergs/requests/new_request/" title="Request for a service record">here</a>.
                    <!-- <table class="table-ex sr-table">
                        <thead>
                            <tr>
                                <th colspan="2">Service</th>
                                <th colspan="3">Record of Appointment</th>
                                <th>Office</th>
                                <th rowspan="3">Branch</th>
                                <th rowspan="3">Leave of Absence w/o Pay</th>
                                <th rowspan="3">Date</th>
                            </tr>
                            <tr>
                                <th colspan="2">(Inclusive Date)</th>
                                <th rowspan="2">Designation</th>
                                <th rowspan="2">Status</th>
                                <th rowspan="2">Salary</th>
                                <th rowspan="2">Station/Place</th>
                            </tr>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                            </tr>
                        </thead>
                    </table> -->
                </div>

            </div>
        </div>
    </section>
    <script>
        "use strict";
        function pageRun(app = new App())
        {
            // let srTable = null, srTableWrapper = document.querySelector(".div-ex.sr-table-wrapper").uiEx;

            // srTable = new TableEx().setup(app.main);
            // srTable.table.classList.add("sr-table");
            // srTable.setupHeaders([{name:"service_date_range", text:"Service", subheaders:[{name:"service_date_range2", text:"(Inclusive Date)", subheaders:[{name:"service_date_from", text:"From"}, {name:"service_date_to", text:"To"}]}]}, {name:"appointment", text:"Record of Appointment", subheaders:[{name:"designation", text:"Designation"}, {name:"status", text:"Status"}, {name:"salary", text:"Salary"}]}, {name:"office", text:"Office", subheaders:[{name:"station", text:"Station/Place"}]}, {name:"branch", text:"Branch"}, {name:"lwop", text:"Leave of Absence w/o Pay"}, {name:"date", text:"Date"}]);
            // srTableWrapper.addExContent(srTable);
        }
    </script>
    <?php
    }

    protected function generateNewRequestUI()
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
                    <input type="radio" id="radio-select-sr-owner1" title="Request encoding or updating of another employee's service record" name="sr-owner" value="1" onclick="document.getElementById('sr-employee-id').disabled = false;"<?php if ($_REQUEST['sr-owner'] === '1') { echo(' checked'); } ?>>
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

    protected function generateRequestsUI()
    {
        $requester = $_REQUEST['req'];
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

    protected function generateRequestListUI()
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
                        { ?>
                        <script>alert("Error in fetching employee and user records.")</script>
                        <?php
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

    protected function generateSREncodingUI()
    { 
        $error = false;
        $dbResults = null;
        $mode = 0; // 0: no data loaded; 1: data loaded

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
                case 'addEmployeeSubmit':
                    $person = [];
                    $employee = [];
                    $birthPlace = [];
                    $emailAddress = "";
                    
                    $isTempEmpId = isset($_REQUEST['is_temporary_empno']);
                    $employeeId = trim($_REQUEST['employeeId']);
                    $createAccount = isset($_REQUEST['create_account']);
                    
                    if (!is_string($_REQUEST['given_name']) || trim($_REQUEST['given_name']) === '')
                    {
                        $error = true; ?>
                        <script>
                            function errorMsg() {
                                new MessageBox().setup(app.main, "SeRGS Error", "Error: Given name is required.");
                            }
                        </script><?php
                    }
        
                    if (!$error)
                    {
                        $dbResults = $this->getDB_SDO()->select('Employee', 'employeeId', "WHERE employeeId='$employeeId'");
        
                        if (!is_null($this->getDB_SDO()->lastException))
                        {
                            $error = true; ?>
                            <script>
                                function errorMsg() {
                                    new MessageBox().setup(app.main, "SeRGS Error", "Error encountered in querying employee information in database." + "<br><br><?php echo($this->getDB_SDO()->lastException->getMessage()); ?><br><br>Last SQL String: <?php echo($this->getDB_SDO()->lastSQLStr); ?>");
                                }
                            </script><?php
                        }
                        elseif (count($dbResults) > 0)
                        {
                            $error = true; ?>
                            <script>
                                function errorMsg() {
                                    new MessageBox().setup(app.main, "SeRGS Error", "Error: Employee ID <?php echo($employeeId); ?> already exists.");
                                }
                            </script><?php
                        }
                    }
        
                    foreach ($_REQUEST as $key => $value) {
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
        
                    if (!$error)
                    {
                        $dbResults = $this->getDB_SDO()->select('Address', 'addressId', "WHERE address='$birthPlace'");
            
                        if (is_null($this->getDB_SDO()->lastException))
                        {
                            if (count($dbResults) === 0)
                            {
                                $birthPlaceAddressId = $this->getDB_SDO()->insert('Address', '(address)', "('$birthPlace')");
            
                                if (!is_null($this->getDB_SDO()->lastException))
                                {
                                    $error = true; ?>
                                    <script>
                                        function errorMsg() {
                                            new MessageBox().setup(app.main, "SeRGS Error", "Error encountered in inserting birth place into database." + "<br><br><?php echo($this->getDB_SDO()->lastException->getMessage()); ?><br><br>Last SQL String: <?php echo($this->getDB_SDO()->lastSQLStr); ?>");
                                        }
                                    </script><?php
                                }
                            }
                            else
                            {
                                $birthPlaceAddressId = $dbResults[0]['addressId'];
                            }
                        }
                        else
                        {
                            $error = true; ?>
                            <script>
                                function errorMsg() {
                                    new MessageBox().setup(app.main, "SeRGS Error", "Error encountered in querying birth place in database." + "<br><br><?php echo($this->getDB_SDO()->lastException->getMessage()); ?><br><br>Last SQL String: <?php echo($this->getDB_SDO()->lastSQLStr); ?>");
                                }
                            </script><?php
                        }
                    }
        
                    if (!$error)
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
                                $error = true; ?>
                                <script>
                                    function errorMsg() {
                                        new MessageBox().setup(app.main, "SeRGS Error", "Ambiguity encountered in querying personal information in database. [Multiple matches found where a single match is expected]");
                                    }
                                </script><?php    
                            }
                            elseif (count($dbResults) === 1)
                            {
                                $personId = $dbResults[0]['personId'];
        
                                $this->getDB_SDO()->update('Person', 'given_name="' . $person['given_name'] . '", middle_name="' . $person['middle_name'] . '", family_name="' . $person['family_name'] . '", spouse_name="' . $person['spouse_name'] . '", ext_name="' . $person['ext_name'] . '", post_nominal="' . $person['post_nominal'] . '", birth_date="' . $person['birth_date'] . '", birth_place="' . $birthPlaceAddressId . '"', "WHERE personId='$personId'");
        
                                if (!is_null($this->getDB_SDO()->lastException))
                                {
                                    $error = true; ?>
                                    <script>
                                        function errorMsg() {
                                            new MessageBox().setup(app.main, "SeRGS Error", "Ambiguity encountered in querying personal information in database. [Multiple matches found where a single match is expected]" + "<br><br><?php echo($this->getDB_SDO()->lastException->getMessage()); ?><br><br>Last SQL String: <?php echo($this->getDB_SDO()->lastSQLStr); ?>");
                                        }
                                    </script><?php
                                }
                            }
                            elseif (count($dbResults) === 0)
                            {
                                $personId = $this->getDB_SDO()->insert('Person', '(given_name, middle_name, family_name, spouse_name, ext_name, post_nominal, birth_date, birth_place)', '("' . $person['given_name'] . '", "' . $person['middle_name'] . '", "' . $person['family_name'] . '", "' . $person['spouse_name'] . '", "' . $person['ext_name'] . '", "' . $person['post_nominal'] . '", "' . $person['birth_date'] . '", "' . $person['birth_date'] . '", "' . $person['birth_place'] . '", "' . $birthPlaceAddressId . '")');
        
                                if (!is_null($this->getDB_SDO()->lastException))
                                {
                                    $error = true; ?>
                                    <script>
                                        function errorMsg() {
                                            new MessageBox().setup(app.main, "SeRGS Error", "Error encountered in inserting personal information into database." + "<br><br><?php echo($this->getDB_SDO()->lastException->getMessage()); ?><br><br>Last SQL String: <?php echo($this->getDB_SDO()->lastSQLStr); ?>");
                                        }
                                    </script><?php        
                                }
                            }
                        }
                        else
                        {
                            $error = true; ?>
                            <script>
                                function errorMsg() {
                                    new MessageBox().setup(app.main, "SeRGS Error", "Error encountered in querying personal information in database." + "<br><br><?php echo($this->getDB_SDO()->lastException->getMessage()); ?><br><br>Last SQL String: <?php echo($this->getDB_SDO()->lastSQLStr); ?>");
                                }
                            </script><?php
                        }    
                    }
        
                    if (!$error)
                    {
                        $this->getDB_SDO()->insert('Employee', '(employeeId, personId, is_temporary_empno)', "('$employeeId', '$personId', '" . ($isTempEmpId ? '1' : '0') . "')");
        
                        if (!is_null($this->getDB_SDO()->lastException))
                        {
                            $error = true; ?>
                            <script>
                                function errorMsg() {
                                    new MessageBox().setup(app.main, "SeRGS Error", "Error encountered in inserting employee information into database." + "<br><br><?php echo($this->getDB_SDO()->lastException->getMessage()); ?><br><br>Last SQL String: <?php echo($this->getDB_SDO()->lastSQLStr); ?>");
                                }
                            </script><?php
                        }
                    }
        
                    if (!$error)
                    {
                        $this->getDB_SDO()->insert('Email_Address', '(email_address, personId)', "('$emailAddress', '$personId')");
        
                        if (!is_null($this->getDB_SDO()->lastException))
                        {
                            $error = true; ?>
                            <script>
                                function errorMsg() {
                                    new MessageBox().setup(app.main, "SeRGS Error", "Error encountered in inserting email address into database." + "<br><br><?php echo($this->getDB_SDO()->lastException->getMessage()); ?><br><br>Last SQL String: <?php echo($this->getDB_SDO()->lastSQLStr); ?>");
                                }
                            </script><?php
                        }    
                    }
                    break;
                case 'loadServiceRecord':
                    ?>
                    <?php
                    break;
                case 'saveServiceRecord':
                    break;
            }
        }
        ?>
    <section id="main-sr-encoding">
        <h2>Service Record Data Entry Form</h2>

        <script>
            "use strict";

            function activateDateInput(td = new HTMLTableCellElement())
            {
                if (td instanceof HTMLTableCellElement)
                {
                    if (!(td.children.length > 0 && td.children[0] instanceof HTMLInputElement))
                    {
                        let dateInput = ElementEx.create("input", ElementEx.NO_NS, null, null, "type", "date", "style", "border: 0 none;");
                        dateInput.value = td.innerHTML.replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)/, "$3-$1-$2");
                        td.innerHTML = "";
                        td.append(dateInput);
                        td.tabIndex = -1;
                        dateInput.addEventListener("blur", event=>deactivateDateInput(td));
                        dateInput.focus();
                        document.getElementById("sr-delete-record").children[0]["active_cell"] = td;
                    }
                }
            }

            function deactivateDateInput(td = new HTMLTableCellElement())
            {
                if (td instanceof HTMLTableCellElement && td.children.length > 0 && td.children[0] instanceof HTMLInputElement && td.children[0].type === "date")
                {
                    td.innerHTML = td.children[0].value.replace(/(\d\d\d\d)-(\d\d)-(\d\d)/, "$2\/$3\/$1");
                    td.tabIndex = 0;
                }
            }

            async function activateDelRecButton(setting = true, td = null)
            {
                await window.setTimeout(()=>{
                    [document.getElementById("sr-delete-record").children[0]].forEach(delRecButton=>{
                        delRecButton.disabled = !setting;
                        delRecButton["active_cell"] = (setting ? td : null);
                    });
                }, 1000);
            }

            function arrowMove(event = new KeyboardEvent(), td = new HTMLTableCellElement)
            {
                let rowIndex = Array.from(td.parentElement.parentElement.children).findIndex(row=>row === td.parentElement);
                let cellIndex = Array.from(td.parentElement.children).findIndex(cell=>cell === td);
                let nextTD = null;
                let range = document.getSelection().getRangeAt(0);
                let isCollapsed = range.commonAncestorContainer === td || range.startContainer === range.endContainer && range.startOffset === range.endOffset;
                let hasChildren = (td.childNodes.length > 0);

                let canMoveToPrevious = (!hasChildren || (isCollapsed && range.startContainer === td.childNodes[0] && range.startOffset === 0 && td["lastStart"] === range.startOffset));
                let canMoveToNext = (!hasChildren || (isCollapsed && range.startContainer === Array.from(td.childNodes).slice(-1)[0] && range.endOffset >= Array.from(td.childNodes).slice(-1)[0].textContent.length && td["lastEnd"] === range.endOffset));

                if (event.key === "ArrowUp" && rowIndex > 0 && canMoveToPrevious)
                {
                    nextTD = td.parentElement.parentElement.children[rowIndex - 1].rowInfo.td[td["headerName"]];
                }
                else if (event.key === "ArrowDown" && rowIndex < td.parentElement.parentElement.children.length - 1 && canMoveToNext)
                {
                    nextTD = td.parentElement.parentElement.children[rowIndex + 1].rowInfo.td[td["headerName"]];
                }
                else if (event.key === "ArrowLeft" && canMoveToPrevious)
                {
                    if (cellIndex > 0)
                    {
                        nextTD = td.previousElementSibling;
                    }
                    else if (rowIndex > 0)
                    {
                        nextTD = Array.from(td.parentElement.parentElement.children[rowIndex - 1].children).slice(-1)[0];
                    }
                }
                else if (event.key === "ArrowRight" && canMoveToNext)
                {
                    if (cellIndex < td.parentElement.children.length - 1)
                    {
                        nextTD = td.nextElementSibling;
                    }
                    else if (rowIndex < td.parentElement.parentElement.children.length - 1)
                    {
                        nextTD = td.parentElement.parentElement.children[rowIndex + 1].children[0];
                    }
                }
                else if (event.key === "F2" && hasChildren && (!isCollapsed || range.commonAncestorContainer === td))
                {
                    document.getSelection().collapseToStart();
                }

                if (nextTD)
                {
                    nextTD.focus();
                    document.getSelection().selectAllChildren(nextTD);

                    delete td["lastStart"];
                    delete td["lastEnd"];
                }
                else
                {
                    td["lastStart"] = range.startOffset;
                    td["lastEnd"] = range.endOffset;
                }

            }

            function addNewRow()
            {
                let row = document.getElementById('sr-table-entry').uiEx.addRow();
                
                Array.from(row.children).forEach((cell, index)=>{
                    if (index === 0 || index === 1 || index === 8)
                    {
                        cell.addEventListener("focus", event=>activateDateInput(cell));
                    }
                    else
                    {
                        cell.addEventListener("keyup", event=>arrowMove(event, cell));
                    }
                    
                    cell.addEventListener("focus", event=>activateDelRecButton(true, cell));
                    cell.addEventListener("blur", event=>activateDelRecButton(false, cell));
                });

                [document.getElementById("sr-save-update").children[0]].forEach(saveBtn=>{
                    if (saveBtn.disabled) saveBtn.disabled = false;
                });

                row.children[0].focus();
            }

            function addEmployeeLoadSRButton(button = new HTMLButtonElement())
            {
                if (button.innerHTML === 'Add Employee')
                {
                    new AddEmployeeDialog().setup(document.getElementById('sergs').querySelector('main'));
                }
                else if (button.innerHTML === 'Load Service Record')
                {
                    loadSR(document.getElementById('emp-id').value, document.getElementById('sr-table-entry'));
                }
            }

            function loadSR(employeeId = "", srTableEx = new TableEx())
            {
                if (ElementEx.type(employeeId) === "string" && employeeId !== "")
                {
                    // console.log(employeeId, srTableEx);
                    document.getElementById("sr-add-record").children[0].disabled = false;
                    document.getElementById("sr-revert-cancel").children[0].disabled = false;
                    // document.getElementById("sr-add-record").children[0].click();
                    // document.getElementById("sr-add-record").children[0].click();
                    // document.getElementById("sr-add-record").children[0].click();
                }
            }

            function updateSR()
            {
                let srTableEx = document.getElementById("sr-table-entry").uiEx;

                let srData = srTableEx.rows.map(rowInfo=>{
                    var rowData = {};

                    for (const key in rowInfo.td)
                    {
                        switch (key)
                        {
                            case "date-from":
                            case "date-to":
                            case "date":
                                rowData[key] = rowInfo.td[key].innerHTML.replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)/, "$3-$1-$2");
                                break;
                            default:
                                rowData[key] = rowInfo.td[key].innerHTML;
                                break;
                        }
                    }

                    return rowData;
                });

                // ADD CODE FOR SUBMITTING SERVICE RECORD DATA TO SERVER

                console.log(srData);
            }
        </script>

        <form id="sr-loader" name="sr-loader" method="GET">
            <input type="hidden" name="a" value="loadServiceRecord">
        </form>

        <div class="div-ex emp-info">
            <span class="drop-down-ex emp-id">
                <label class="label-ex" for="emp-id">Employee ID/Name:</label>
                <select id="emp-id" name="emp-id" form="sr-loader" onchange="(()=>{ document.getElementById('sr-add-new-emp').uiEx.control.disabled = false; document.getElementById('sr-add-new-emp').uiEx.control.innerHTML = (this.value == -1 ? 'Add Employee' : 'Load Service Record'); document.getElementById('sr-add-new-emp').uiEx.control.type = (this.value == -1 ? 'button' : 'submit'); document.getElementById('sr-emp-birth-date').uiEx.setHTMLContent(this.selectedOptions[0].dataset.birthDate); document.getElementById('sr-emp-birth-place').uiEx.setHTMLContent(this.selectedOptions[0].dataset.birthPlace); })()">
                    <option value="-1" class="non-option">- New Employee Record -</option><?php
                    $employees = $this->getDB_SDO()->executeQuery('SELECT Person.personId, given_name, middle_name, family_name, spouse_name, ext_name, birth_date, Address.address AS birth_place, employeeId, is_temporary_empno FROM Person INNER JOIN Employee ON Person.personId=Employee.personId LEFT JOIN Address ON Person.birth_place=Address.addressId;');
    
                    if (is_null($this->getDB_SDO()->lastException))
                    {
                        foreach ($employees as $employee) { ?>

                            <option value="<?php echo($employee['employeeId']); ?>" data-birth-date="<?php echo(date('F j, Y', strtotime($employee['birth_date']))); ?>" data-birth-place="<?php echo($employee['birth_place']); ?>"<?php $selected = (isset($_REQUEST['a']) && $_REQUEST['a'] === 'loadServiceRecord' && isset($_REQUEST['emp-id']) && $_REQUEST['emp-id'] === $employee['employeeId']); echo($selected ? ' selected': ''); $mode = ($mode === 1 || $selected ? 1 : 0); ?>><?php
                                echo($employee['employeeId'] . ' &ndash; ' . $this->getFullName($employee['given_name'], $employee['middle_name'], $employee['family_name'], $employee['spouse_name'], $employee['ext_name'], true));
                            ?></option><?php
                        }
                    }
                    else
                    {
                        echo('Error encountered retrieving employee records.');
                    }
                    ?>
                </select>
            </span>

            <span class="button-ex" id="sr-add-new-emp">
                <button type="button" form="sr-loader" onclick="addEmployeeLoadSRButton(this);"<?php echo($mode === 1 ? ' disabled' : ''); ?>><?php echo($mode === 1 ? 'Load Service Record' : 'Add Employee'); ?></button>
            </span>

            <div class="div-ex" id="sr-emp-birth-date">
                <span class="label-ex">Birth Date:</span>
            </div>
            <div class="div-ex" id="sr-emp-birth-place">
                <span class="label-ex">Birth Place:</span>
            </div>
        </div>

        <div class="div-ex sr-table-wrapper">
            <table class="table-ex sr-table" id="sr-table-entry">
                <thead>
                    <tr>
                        <th colspan="2" data-header-name="service">Service</th>
                        <th colspan="3" data-header-name="appointment">Record of Appointment</th>
                        <th data-header-name="office">Office</th>
                        <th rowspan="3" data-header-name="branch" data-contenteditable="true">Branch</th>
                        <th rowspan="3" data-header-name="lwop" data-contenteditable="true">Leave of Absence w/o Pay</th>
                        <th rowspan="3" data-header-name="date" data-contenteditable="true">Date</th>
                    </tr>
                    <tr>
                        <th colspan="2" data-header-name="inclusive_date">(Inclusive Date)</th>
                        <th rowspan="2" data-header-name="designation" data-contenteditable="true">Designation</th>
                        <th rowspan="2" data-header-name="status" data-contenteditable="true">Status</th>
                        <th rowspan="2" data-header-name="salary" data-contenteditable="true">Salary</th>
                        <th rowspan="2" data-header-name="station" data-contenteditable="true">Station/Place</th>
                    </tr>
                    <tr>
                        <th data-header-name="date-from" data-contenteditable="true">From</th>
                        <th data-header-name="date-to" data-contenteditable="true">To</th>
                    </tr>
                </thead>
                <tbody><?php ?>
                </tbody>
            </table>
        </div>

        <div class="button-group-ex" style="float: left;">
            <span class="button-ex" id="sr-add-record">
                <button type="button" disabled onclick="addNewRow();">Add <br>Record</button>
            </span>
            <span class="button-ex" id="sr-delete-record">
                <button type="button" disabled onclick="activateDelRecButton(true, this['active_cell']); new DeleteServiceRecordEntryDialog().setup(app.main, this['active_cell'].parentElement, this);" title="Delete the entire row of a selected cell">Delete <br>Record</button>
            </span>
        </div>
        <div class="button-group-ex" style="float: right;">
            <span class="button-ex" id="sr-save-update">
                <button type="submit" disabled onclick="updateSR();">Update/<br>Save</button>
            </span>
            <span class="button-ex" id="sr-revert-cancel">
                <button type="button" disabled onclick="window.location.replace(window.location.origin + window.location.pathname);">Revert/<br>Cancel</button>
            </span>
            <span class="status-pane" id="sr-status"></span>
        </div>

        <script>
            "use strict";
            new TableEx().setupFromHTMLElement(document.getElementById('sr-table-entry'));
        </script>
    </section><?php
    }

    protected function generateTempUI($pageId)
    { ?>
    <section id="main-<?php echo $pageId;?>" class="under-construction">
        <h2><?php echo strtoupper($pageId[0]) . substr($pageId, 1);?></h2>
        <p class="center"><em>This page is under construction. Please bear with us.</em></p>
    </section><?php
    }

    protected function generateForbidden()
    { ?>
    <section id="main-forbidden">
        <h2>Unauthorized Access</h2>
        <p class="center">Your user access level is not allowed to access this interface.</p>
        <p class="center">Click <a href="?a=logout" title="Sign out">here to sign out</a> or <a href="/" title="SDO Services Home">here to return to SDO Services Home</a>.</p>
        <p class="center">Thank you.</p>      
    </section><?php
    }

    protected function getFullName($givenName, $middleName, $familyName, $spouseName, $extName, $lastNameFirst = false, $middleInitialOnly = true, $includeAllMiddleNames = false)
    {
        $nameArr = null;
        
        if (!is_string($givenName) || trim($givenName) === '')
        {
            die('Invalid argument: $givenName:' . $givenName);
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

    protected function getNameInitials($nameStr)
    {
        return (!is_string($nameStr) || trim($nameStr) === '' ? '' : join(' ', array_map(function($name){ return $name[0] . '.'; }, preg_split('/ /', $nameStr))));
    }
}
?>