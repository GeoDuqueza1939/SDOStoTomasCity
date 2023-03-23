<?php E_STRICT;
session_start();

define('__ROOT__', '/home/geovaniduqueza1939/Code/GitHub/SDOStoTomasCity/web');
require_once(__ROOT__ . '/php/enums/pagetypes.php');
require_once(__ROOT__ . '/php/secure/validateUser.php');

$requiresSignIn = true;
$pageTitle = 'Sign-in to SDO Services | Sto. Tomas City SDO';
$pageType = PageType::SignIn;
$addDebug = true;
?>
<!DOCTYPE html>
<html lang="en">
<?php require_once(__ROOT__ . '/php/snippets/html_head.php');?>
<body>
<?php
if (isset($_SESSION['user']))
{
    // MODE: operation; should redirect to source URL, if available, or to the root directory
    header('Location: ' . (isset($_REQUEST['src']) ? $_REQUEST['src'] : '/'));
}
else
{
    if (isset($_REQUEST['a']) && $_REQUEST['a'] == 'login')
    {
        // MODE: signing in
        if (isset($_POST['unm']) && isset($_POST['pwd']) && isValidCredentials($_POST['unm'], $_POST['pwd']))
        {
            require_once(__ROOT__ . '/php/secure/process_signin.php');
        }
        else
        {
            // MODE: sign in form (sign-in error)
            require(__ROOT__ . '/php/snippets/signin_form.php');
            echo "Invalid credentials";
        }
    }
    else
    {
        // MODE: sign in form
        require(__ROOT__ . '/php/snippets/signin_form.php');
    }
}
require_once(__ROOT__ . '/php/snippets/html_tail.php');
?>
</body>
</html>
