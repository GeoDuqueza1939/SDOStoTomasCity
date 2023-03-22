<?php E_STRICT;
session_start();

define('__ROOT__', '/home/geovaniduqueza1939/Code/GitHub/SDOStoTomasCity/web');
require_once(__ROOT__ . '/php/secure/validateUser.php');

?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sign-in to SDO Services | Sto. Tomas City SDO</title>
</head>
<body>
<?php
if (isset($_REQUEST['a']) && $_REQUEST['a'] == 'login')
{
    // MODE: signing in
    if (isset($_POST['unm']) && isset($_POST['pwd']) && isValidCredentials($_POST['unm'], $_POST['pwd']))
    {
        require_once(__ROOT__ . '/php/secure/process_signin.php');
    }
    else
    {
        // $_REQUEST['err'] = 'Sign-in Error';
        echo "Invalid credentials";
    }
}
else
{
?>
    <!-- DEBUG -->
    <form action="<?php echo $_SERVER['PHP_SELF'] . (isset($_REQUEST['src']) ? '?src=' . $_REQUEST['src'] : '');?>" method="post">
        <input type="text" name="unm" id="unm"><br>
        <input type="password" name="pwd" id="pwd"><br>
        <button type="submit">Sign In</button>
        <input type="hidden" name="a" value="login">
    </form>
    <!-- DEBUG -->
<?php
}
?>


<?php
// if (isset($_SESSION['user']) || isset($_REQUEST['a']))
// {
//     if (isset($_REQUEST['a']) && $_REQUEST['a'] == 'login')
//     {
//         // MODE: signing in
//         if (isset($_POST['unm']) && isset($_POST['pwd']))
//         {
//             require_once(__ROOT__ . '/php/secure/process_signin.php');
//         }
//     }
//     elseif (isset($_REQUEST['a']) && $_REQUEST['a'] == 'logout' || !isset($_COOKIE['user']))
//     {
//         // MODE: signing out
//         require_once(__ROOT__ . '/php/secure/process_signout.php');
//     }
//     else
//     {
//         // MODE: operation
//         header('Location: ' . $_REQUEST['src']);
?>
<!--
    <form action="<?php //$_SERVER['PHP_SELF'];?>" method="post">
        <input type="hidden" name="a" value="logout">
        <button type="submit">Sign Out</button><br>
    </form>
-->
<?php
//     }
// }
// else
// {
?>
    <!-- DEBUG -->
<!--    <form action="<?php echo $_SERVER['PHP_SELF'] . '?src=' . $_REQUEST['src'];?>" method="post">
        <input type="text" name="unm" id="unm"><br>
        <input type="password" name="pwd" id="pwd"><br>
        <button type="submit">Sign In</button>
        <input type="hidden" name="a" value="login">
    </form> -->
    <!-- DEBUG -->
<?php
// }
?>

</body>
</html>
<?php
echo '<br><br>SESSION:<br>';
var_dump($_SESSION);
echo '<br><br>REQUEST:<br>';
var_dump($_REQUEST);
echo '<br><br>POST:<br>';
var_dump($_POST);
echo '<br><br>GET:<br>';
var_dump($_GET);
echo '<br><br>COOKIE:<br>';
var_dump($_COOKIE);
?>