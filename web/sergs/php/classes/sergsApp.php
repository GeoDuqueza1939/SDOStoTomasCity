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
                    Not available. <a href="/sergs/requests/new_request/" title="Request for a service record">Request service record update</a>
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
        $accessLevel = $this->getUserAccessLevel();
        if ($accessLevel < 2)
        {
            $this->generateForbidden();
            return;
        } ?>
    <section id="main-sr-encoding">
        <h2>Service Record Data Entry Form</h2>

        <div class="div-ex emp-info">
            <span class="drop-down-ex emp-id">
                <label class="label-ex" for="emp-id">Employee ID/Name:</label>
                <select id="emp-id" name="emp-id" onchange="(()=>{ document.getElementById('sr-add-new-emp').uiEx.control.disabled = (this.value != -1); document.getElementById('sr-emp-birth-date').uiEx.setHTMLContent(this.selectedOptions[0].dataset.birthDate); document.getElementById('sr-emp-birth-place').uiEx.setHTMLContent(this.selectedOptions[0].dataset.birthPlace); })()">
                    <option value="-1" class="non-option">- Select employee -</option><?php
                    $employees = $this->getDB_SDO()->executeQuery('SELECT Person.personId, given_name, middle_name, family_name, spouse_name, ext_name, birth_date, birth_place, employeeId, is_temporary_empno FROM Person INNER JOIN Employee ON Person.personId=Employee.personId;');
    
                    if (is_null($this->getDB_SDO()->lastException))
                    {
                        foreach ($employees as $employee) { ?>
    
                            <option value="<?php echo($employee['employeeId']); ?>" data-birth-date="<?php echo($employee['birth_date']); ?>" data-birth-place="<?php echo($employee['birth_place']); ?>"><?php
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
                <button type="button" onclick="new AddEmployeeDialog().setup(document.getElementById('sergs').querySelector('main'));">Add New</button>
            </span>

            <div class="div-ex" id="sr-emp-birth-date">
                <span class="label-ex">Birth Date:</span>
            </div>
            <div class="div-ex" id="sr-emp-birth-place">
                <span class="label-ex">Birth Place:</span>
            </div>
        </div>

        <div class="div-ex sr-table-wrapper">
            <table class="table-ex sr-table">
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
                <tbody><?php ?>
                </tbody>
            </table>
        </div>

        <div class="button-group-ex" style="float: left;">
            <span class="button-ex" id="sr-add-record">
                <button type="button">Add <br>Record</button>
            </span>
            <span class="button-ex" id="sr-delete-record">
                <button type="button" disabled>Delete <br>Record</button>
            </span>
        </div>
        <div class="button-group-ex" id="sr-save-update" style="float: right;">
            <span class="button-ex">
                <button type="submit">Update/<br>Save</button>
            </span>
            <span class="button-ex">
                <button type="submit" id="sr-revert-cancel" disabled>Revert/<br>Cancel</button>
            </span>
            <span class="status-pane" id="sr-status"></span>
        </div>
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