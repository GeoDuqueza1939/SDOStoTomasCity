<?php E_STRICT;

require_once(__FILE_ROOT__ . '/php/classes/app.php');
require_once(__FILE_ROOT__ . '/php/enums/pagetypes.php');

class MPASIS_App extends App
{
    public function __construct()
    {
        $this->setName("Merit Promotion and Selection Information System");
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

    public function run()
    {
        $requiresSignIn = true;
        $pageTitle = 'Department of Education | Sto. Tomas City SDO';
        $pageType = PageType::MPASIS;
        // $addDebug = true;  
?>
<!DOCTYPE html>
<html lang="en">
<?php require_once(__FILE_ROOT__ . '/php/snippets/html_head.php');?>
<body>
    <div id="mpasis" class="app">
<?php
if (isset($_SESSION['user']))
{
    if (isset($_REQUEST['a']) && $_REQUEST['a'] == 'logout' || !isset($_COOKIE['user']))
    {
        require_once(__FILE_ROOT__ . '/php/secure/process_signout.php');
    }
    // elseif (isset($_COOKIE['user']))
    // {
    //     setcookie('user', $_POST['unm'], time() + 500, '/'); // EXPIRE IN 500 SECONDS
    // }
}
else
{
    echo('NO USER<br>');

    if ($requiresSignIn)
    {
        header('Location: /login?src=' . $_SERVER['PHP_SELF']);
    }
}

require_once(__FILE_ROOT__ . '/php/snippets/header_full.php'); // general header
require_once(__FILE_ROOT__ . '/php/snippets/nav_full.php'); // general nav

?>
    <main>
        <section id="main-dashboard">
            <h2>Dashboard</h2>
            
            <h3>Summary</h3>
            <ul>
                <li><b>Available Positions:</b> 0</li>
                <li><b>Applications Entered:</b> 0</li>
                <li><b>Unique Applicants:</b> 0</li>
            </ul>

            <h3>Applications</h3>
            <ul>
                <li><b>Shortlisted Applications:</b> 0</li>
                <li><b>Disqualified Applications:</b> 0</li>
                <li><b>Applications Under Processing:</b> 0</li>
            </ul>
        </section>
    </main>
<?php
require_once(__FILE_ROOT__ . '/php/snippets/footer_full.php');        
require_once(__FILE_ROOT__ . '/php/snippets/html_tail.php');
?>
    </div>
</body>
<script src="/mpasis/js/app.js"></script>
</html>
<?php
    } // function run()
}
?>