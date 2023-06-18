<header>
<?php E_STRICT;
// require_once('../path.php');

// require_once(__FILE_ROOT__ . '/php/enums/pagetypes.php');

if ($pageType == PageType::Landing || $pageType == PageType::SignIn)
{
    require_once(__FILE_ROOT__ . '/php/snippets/landing_header.php');
}
else
{
    require_once(__FILE_ROOT__ . '/php/snippets/header.php');
}
?>
</header>