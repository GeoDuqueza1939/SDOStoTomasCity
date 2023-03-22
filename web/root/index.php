<?php E_STRICT;
session_start();

define('__ROOT__', '/home/geovaniduqueza1939/Code/GitHub/SDOStoTomasCity/web');

?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Department of Education | Sto. Tomas City SDO</title>
</head>
<body>
<?php

if (isset($_SESSION['user']))
{
    if (isset($_REQUEST['a']) && $_REQUEST['a'] == 'logout')
    {
        require_once(__ROOT__ . '/php/secure/process_signout.php');
    }
    else
    {
    // User is signed in
    echo "OK<br>";
?>
    <form action="<?php $_SERVER['PHP_SELF'];?>" method="POST">
        <input type="hidden" name="a" value="logout">
        <button type="submit">Sign Out</button><br>
    </form>
<?php
    }
}
else
{
    // Signed out
    echo "NO USER<br>";

    // redirect to login
    header('Location: /login?src=' . $_SERVER['PHP_SELF']);
}
?>









<!--
<?php
// if (isset($_SESSION['user']))
// {
//     // if logging out or user cookie is expired
//     if (isset($_REQUEST['a']) && $_REQUEST['a'] == 'logout' || !isset($_COOKIE['user']))
//     {
//         // MODE: signing out
//         require_once(__ROOT__ . '/php/secure/process_signout.php');
//     }
//     else
//     {
//         // MODE: operation
//         echo 'OK<br>';
?>
    <form action="<?php //$_SERVER['PHP_SELF'];?>" method="post">
        <input type="hidden" name="a" value="logout">
        <button type="submit">Sign Out</button><br>
    </form>
<?php
//     }
// }
// else // user is not signed in and there is no action
// {
//     // MODE: sign-in prompt
//     // redirect to login
//     header('Location: /login?src=' . $_SERVER['PHP_SELF']);
// }

// echo 'USER: ' . $_SESSION['user'] . '<br>';
?>
-->
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