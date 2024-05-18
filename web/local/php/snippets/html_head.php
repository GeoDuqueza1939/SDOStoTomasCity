<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<title><?php echo($pageTitle);?></title>
<link href="<?php echo(__BASE__); ?>/styles/default.css" rel="stylesheet" />
<link href="<?php echo(__BASE__); ?>/styles/main.css" rel="stylesheet" />
<link href="<?php echo(__BASE__); ?>/styles/ExClass.css" rel="stylesheet" />
<link href="<?php echo(__BASE__); ?>/styles/UIEx.css" rel="stylesheet" />
<!-- FAVICON START -->
<link rel="apple-touch-icon" sizes="180x180" href="<?php echo(__BASE__); ?>/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="<?php echo(__BASE__); ?>/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="<?php echo(__BASE__); ?>/favicon-16x16.png">
<link rel="manifest" href="<?php echo(__BASE__); ?>/site.webmanifest">
<!-- FAVICON END -->
<script src="<?php echo(__BASE__); ?>/js/ajax.js"></script>
<script src="<?php echo(__BASE__); ?>/js/elements.js"></script>
<script src="<?php echo(__BASE__); ?>/js/types.js"></script>
<script src="<?php echo(__BASE__); ?>/js/async.js"></script>
<script src="<?php echo(__BASE__); ?>/js/classes/ExClass.js"></script>
<script src="<?php echo(__BASE__); ?>/js/classes/UIEx.js"></script>
<script src="<?php echo(__BASE__); ?>/js/libs/jsbn/base64.js"></script>
<!-- <script src="<?php echo(__BASE__); ?>/js/libs/jsbn/sha1.js"></script> -->
<script src="<?php echo(__BASE__); ?>/js/libs/jsbn/jsbn.js"></script>
<script src="<?php echo(__BASE__); ?>/js/libs/jsbn/jsbn2.js"></script>
<script src="<?php echo(__BASE__); ?>/js/libs/jsbn/prng4.js"></script>
<script src="<?php echo(__BASE__); ?>/js/libs/jsbn/rng.js"></script>
<script src="<?php echo(__BASE__); ?>/js/libs/jsbn/rsa.js"></script>
<script src="<?php echo(__BASE__); ?>/js/libs/jsbn/rsa2.js"></script>
<?php
require_once(__FILE_ROOT__ . '/php/enums/pagetypes.php');

switch ($pageType)
{
    case PageType::Landing:
        break;
    case PageType::SignIn: ?>
<link href="<?php echo(__BASE__); ?>/styles/signin.css" rel="stylesheet" /><?php
        break;
    case PageType::SignOut:
        break;
    case PageType::SERGS:
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet"> ?>
<link href="<?php echo(__BASE__); ?>/styles/material.io/material-icons.css" rel="stylesheet">
<link href="<?php echo(__BASE__); ?>/sergs/styles/main.css" rel="stylesheet" /><?php
        if ($pageId === 'print')
        { ?>

<link href="<?php echo(__BASE__); ?>/styles/print.css" rel="stylesheet" />
<link href="<?php echo(__BASE__); ?>/sergs/styles/print.css" rel="stylesheet" /><?php
        }
        break;
    case PageType::OPMS:
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" /> ?>
<link href="<?php echo(__BASE__); ?>/styles/material.io/material-icons.css" rel="stylesheet">
<link href="<?php echo(__BASE__); ?>/opms/styles/main.css" rel="stylesheet" /><?php
        break;
    case PageType::MPASIS:
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
        // <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" /> ?>
<link href="<?php echo(__BASE__); ?>/styles/material.io/material-icons.css" rel="stylesheet">
<link href="<?php echo(__BASE__); ?>/mpasis/styles/main.css" rel="stylesheet" /><?php
        break;
    }

if ($addDebug)
{ ?>

<link href="<?php echo(__BASE__); ?>/styles/debug.css" rel="stylesheet" /><?php
}
?>

<style>
.app.landing > section {
    background-image: url("<?php echo(__BASE__); // TRANSFERRED FROM styles/main.css ?>/images/makiling-stotomas.jpg");
}
</style>

</head>
