<?php E_STRICT;
session_start();

require_once('../path.php');


require_once(__FILE_ROOT__ . '/php/enums/pagetypes.php');
require_once(__FILE_ROOT__ . '/php/secure/validateUser.php');

$requiresSignIn = true;
$pageTitle = 'Sign-in to SDO Services | Sto. Tomas City SDO';
$pageType = PageType::SignIn;
$addDebug = false;

if (isValidUserSession())
{
    // MODE: operation; should redirect to source URL, if available, or to the root directory
    // header('Location: ' . (isset($_REQUEST['src']) ? $_REQUEST['src'] : '/') . (isset($_REQUEST['app']) ? '?app=' . $_REQUEST['app'] : ''));
    ?><script>window.location.replace("<?php echo(isset($_REQUEST['src']) ? $_REQUEST['src'] : '/') . (isset($_REQUEST['app']) ? '?app=' . $_REQUEST['app'] : ''); ?>");</script><?php
}
else
{
    if (isset($_REQUEST['a']) && $_REQUEST['a'] == 'login')
    {
        // MODE: signing in
        $userInfo = getValidCredentials($_POST['unm'], $_POST['pwd']);

        if (isset($_POST['unm']) && isset($_POST['pwd']) && !is_null($userInfo))
        {
            require_once(__FILE_ROOT__ . '/php/secure/process_signin.php');
        }
        else
        {
            // MODE: sign in form (sign-in error)
            $isInvalidSignIn = true;

            require(__FILE_ROOT__ . '/php/snippets/signin_form.php');
        }
    }
    else
    {
        // MODE: sign in form
        $isInvalidSignIn = false;
        
        require(__FILE_ROOT__ . '/php/snippets/signin_form.php');
    }
}
?>
