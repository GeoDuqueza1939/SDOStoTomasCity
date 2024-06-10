<?php
// if (version_compare(phpversion(), '8.1', '>='))
// {
//     enum PageType
//     {
//         case Landing;
//         case SignIn;
//         case SignOut;
//         case SERGS;
//         case OPMS;
//         case MPASIS;
//     }
// }
// else
// {
//     exit();
// }
class PageType
{
    const Landing = 1;
    const SignIn = 2;
    const SignOut = 3;
    const SERGS = 4;
    const OPMS = 5;
    const MPASIS = 6;
    const QMIS = 7;
    const QMISPROPER = 8;
}
?>