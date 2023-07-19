<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo($pageTitle);?></title>
<link href="/styles/default.css" rel="stylesheet" />
<link href="/styles/main.css" rel="stylesheet" />
<link href="/styles/ExClass.css" rel="stylesheet" />
<link href="/styles/UIEx.css" rel="stylesheet" />
<!-- FAVICON START -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<!-- FAVICON END -->
<script src="/js/ajax.js"></script>
<script src="/js/elements.js"></script>
<script src="/js/types.js"></script>
<script src="/js/async.js"></script>
<script src="/js/classes/ExClass.js"></script>
<script src="/js/classes/UIEx.js"></script>
<?php
require_once(__FILE_ROOT__ . '/php/enums/pagetypes.php');

switch ($pageType)
{
    case PageType::Landing:
        break;
    case PageType::SignIn: ?>
<link href="/styles/signin.css" rel="stylesheet" /><?php
        break;
    case PageType::SignOut:
        break;
    case PageType::SERGS:
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet"> ?>
<link href="/styles/material.io/material-icons.css" rel="stylesheet">
<link href="/sergs/styles/main.css" rel="stylesheet" /><?php
        if ($pageId === 'print')
        { ?>

<link href="/styles/print.css" rel="stylesheet" />
<link href="/sergs/styles/print.css" rel="stylesheet" /><?php
        }
        break;
    case PageType::OPMS:
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" /> ?>
<link href="/styles/material.io/material-icons.css" rel="stylesheet">
<link href="/opms/styles/main.css" rel="stylesheet" /><?php
        break;
    case PageType::MPASIS:
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" /> ?>
<link href="/styles/material.io/material-icons.css" rel="stylesheet">
<link href="/mpasis/styles/main.css" rel="stylesheet" /><?php
        break;
    }

if ($addDebug)
{ ?>

<link href="/styles/debug.css" rel="stylesheet" /><?php
}
?>

</head>
