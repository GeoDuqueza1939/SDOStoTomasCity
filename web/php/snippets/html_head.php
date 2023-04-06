<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo($pageTitle);?></title>
<link href="/styles/default.css" rel="stylesheet" />
<link href="/styles/main.css" rel="stylesheet" />
<?php
require_once(__FILE_ROOT__ . '/php/enums/pagetypes.php');

switch ($pageType)
{
    case PageType::Landing:
        break;
    case PageType::SignIn:
        echo('<link href="/styles/signin.css" rel="stylesheet" />');
        break;
    case PageType::SignOut:
        break;
    case PageType::SERGS:
        echo('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');
        echo('<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">');
        echo('<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">');
        echo('<link href="/sergs/styles/main.css" rel="stylesheet" />');
        break;
    case PageType::OPMS:
        echo('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');
        echo('<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">');
        echo('<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">');
        echo('<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />');
        echo('<link href="/opms/styles/main.css" rel="stylesheet" />');
        break;
    case PageType::MPASIS:
        echo('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');
        echo('<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">');
        echo('<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">');
        echo('<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />');
        echo('<link href="/mpasis/styles/main.css" rel="stylesheet" />');
        break;
    }

if ($addDebug)
{
    echo('<link href="/styles/debug.css" rel="stylesheet" />');
}
?>
</head>
