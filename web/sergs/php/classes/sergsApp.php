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
switch ($pageId)
{
    case "dashboard":
        $this->generateDashboardUI();
        break;
    case "view":
        $this->generateViewSRUI();
        break;
    case "view-my-sr":
        $this->generateViewMySRUI();
        break;
    case "new-request":
        $this->generateNewRequestUI();
        break;
    case "view-other-sr":
    case "requests":
    case "my-requests":
    case "for-encode":
    case "for-certify":
    case "for-approve":
    case "for-release":
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
} ?>

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
        ?>
    <section id="main-dashboard">
        <h2>Dashboard</h2>

        <form id="redir-requests">
            <input type="hidden" name="redir" value="/sergs/requests/">
        </form>
        <form id="redir-new-request">
            <input type="hidden" name="redir" value="/sergs/requests/new_request/">
        </form>
        <form id="redir-my-service-record">
            <input type="hidden" name="redir" value="/sergs/view/my_service_record">
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
                    <!-- Not available [<a href="/sergs/requests/new_request/" title="Request for my service record">Request</a>]<br> -->
                    Not available <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Request for my service record">Request</button><br>
                    <!-- Available [<a href="/sergs/view/my_service_record/" title="View my service record">View</a>] [<a href="/sergs/requests/new_request/" title="Request for a service record update">Update</a>]<br> -->
                    <!-- Available <button type="submit" form="redir-my-service-record" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="View my service record">View</button> <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Request for a service record update">Update</button> -->
                </div>
            </div>

            <div class="div-ex dashboard-my-requests-history">
                <h4 class="label-ex">My Requests History <a class="dashboard-refresh-link" href="?a=refresh" title="Refresh"><span class="material-icons-round">refresh</span></a></h4>
                <div class="dashboard-item-contents">
                    <!-- None to show [<a href="/sergs/requests/new_request/">Transact</a>]<br> -->
                    None to show <button type="submit" form="redir-new-request" formaction="" formenctype="application/x-www-form-urlencoded" formmethod="post" title="Request Service Record">Request</button>
                </div>
            </div>
        </div>
    </section><?php
    }

    protected function generateViewSRUI()
    {
        $accessLevel = $this->getUserAccessLevel(); ?>
    <section id="main-view">
        <h2>View Service Record</h2>
        
        <div class="div-ex view-contents">
            <ul class="card-link">
                <li><a href="/sergs/view/my_service_record/">My Service Record</a></li> <?php
            if ($accessLevel < 9 && $accessLevel > 1)
            { ?>
                <li><a href="/sergs/view/other/">Other Service Record</a></li> <?php
            } ?>
            </ul>
        </div>
    </section><?php
    }

    protected function generateViewMySRUI()
    {
        $accessLevel = $this->getUserAccessLevel(); ?>
    <section id="main-view-my-sr">
        <h2>My Service Record</h2>
        
        <div class="div-ex view-contents">
            <div class="div-ex my-sr">
                <div class="div-ex my-sr-name">
                    <span class="label-ex">Name:</span>
                    Dela Cruz, Juan Santos
                </div>
                <div class="div-ex my-sr-birthdate">
                    <span class="label-ex">Birthdate:</span>
                    June 12, 1998
                </div>
                <div class="div-ex my-sr-birthplace">
                    <span class="label-ex">Birthplace:</span>
                    Santo Tomas, Batangas
                </div>
                <div class="div-ex my-sr-emp-no">
                    <span class="label-ex">Emp. No.:</span>
                    4144524
                </div>

                <div class="div-ex sr-table-wrapper">
                    Not available. <a href="/sergs/requests/new_request/" title="Request for a service record">Request a copy</a>
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
        $accessLevel = $this->getUserAccessLevel(); ?>
    <section id="main-new-request">
        <h2>New Request</h2>
<?php 
        if ($accessLevel < 9 && $accessLevel > 1)
        { ?>
        <div class="div-ex radio-button-group-ex center" id="radio-select-sr-owner">
            <span class="radio-ex" title="Request encoding or updating of my own service record">
                <input type="radio" id="radio-select-sr-owner0" title="Request encoding or updating of my own service record" name="radio-select-sr-owner" value="0" checked>
                <label class="label-ex" for="radio-select-sr-owner0" title="Request encoding or updating of my own service record">For me</label>
            </span>
            <span class="radio-ex" title="Request encoding or updating of another employee's service record">
                <input type="radio" id="radio-select-sr-owner1" title="Request encoding or updating of another employee's service record" name="radio-select-sr-owner" value="1">
                <label class="label-ex" for="radio-select-sr-owner1" title="Request encoding or updating of another employee's service record">For another employee</label>
            </span>
        </div><?php
        }
        else // end-user access only
        { ?>
            <input type="hidden" id="radio-select-sr-owner" name="radio-select-sr-owner" value="0" /><?php
        } ?>
        
    </section><?php
    }

    protected function generateTempUI($pageId)
    { ?>
    <section id="main-<?php echo $pageId;?>">
        <h2><?php echo strtoupper($pageId[0]) . substr($pageId, 1);?></h2>
    </section><?php
    }
}
?>