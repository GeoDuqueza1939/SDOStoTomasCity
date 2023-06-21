    <a id="nav-logo-link" href="https://www.depedstotomascity.com.ph/" title="DepEd-Sto. Tomas City SDO"><img src="/images/logo-depedstotomas.webp" alt="Logo-Department of Education, Sto. Tomas City SDO" id="nav-logo" /></a>
    <ul id="nav">
<?php
    $ISId = ($pageType === PageType::SERGS ? 2 : ($pageType === PageType::OPMS ? 3 : ($pageType === PageType::MPASIS ? 4 : 1)));
    $dbResults = $this->getDBConn(0)->select('Nav', '*', "WHERE information_systemId = $ISId AND type = 1 AND parent_nav = 0 ORDER BY nav_index");
    
    $accessLevel = (isset($_SESSION['user']) && isset($_SESSION['user']['sergs_access_level']) ? $_SESSION['user']['sergs_access_level'] : 0);

    if (is_null($this->getDBConn(0)->lastException))
    {
        foreach($dbResults as $navItem)
        {
            if ($navItem['access_level'] <= $accessLevel)
            {
                $id = $navItem['nav_itemId'];
                $icon = $navItem['icon_tag'];
                $text = trim($navItem['nav_text']);
                $url = trim($navItem['url']);
                $navId = trim($navItem['nav_html_id']);
    
                echo('        <li' . (isset($navId) && $navId != '' ? " id=\"$navId\"" : '') . '>');
                echo((isset($url) && $url != '' ? "<a href=\"$url\">" : ''));
                echo("$icon $text");
                echo((isset($url) && $url != '' ? '</a>' : ''));
    
                $dbResults2 = $this->getDBConn(0)->select('Nav', '*', "WHERE information_systemId = $ISId AND type = 1 AND parent_nav = $id ORDER BY nav_index");
    
                if (is_null($this->getDBConn(0)->lastException) && count($dbResults2) > 0)
                {
                    echo(" <span class=\"nav-dropdown-icon\">&#xe5cf;</span>\n            <ul>\n");
                    foreach($dbResults2 as $navItem2)
                    {
                        if ($navItem2['access_level'] <= $accessLevel)
                        {
                            $id = $navItem2['nav_itemId'];
                            $text = trim($navItem2['nav_text']);
                            $url = trim($navItem2['url']);
                            $navId = trim($navItem2['nav_html_id']);
        
                            echo('                <li' . (isset($navId) && $navId != '' ? " id=\"$navId\"" : '') . '>');
                            echo((isset($url) && $url != '' ? "<a href=\"$url\">" : ''));
                            echo($text);
                            echo((isset($url) && $url != '' ? '</a>' : ''));
                            echo("</li>\n");
                        }
                    }
                    echo("            </ul>\n        ");
                }
    
                echo("</li>\n");
            }
        }
    }
    else
    {
        // ERROR
        var_dump($dbconn->lastException->getMessage());
    }
?>
    </ul>
