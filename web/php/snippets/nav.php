<ul id="nav">
<?php
    $dbResults = $this->getDBConn(0)->select('Nav', '*', 'WHERE information_systemId = 4 AND type = 1 AND parent_nav = 0 ORDER BY nav_index');

    if (is_null($this->getDBConn(0)->lastException))
    {
        foreach($dbResults as $navItem)
        {
            $id = $navItem['id'];
            $icon = $navItem['icon_tag'];
            $text = trim($navItem['text']);
            $url = trim($navItem['url']);
            $navId = trim($navItem['nav_id']);

            echo('<li' . (isset($navId) && $navId != '' ? " id = $navId" : '') . '>');
            echo((isset($url) && $url != '' ? "<a href=\"$url\">" : ''));
            echo("$icon $text");
            echo((isset($url) && $url != '' ? '</a>' : ''));

            $dbResults2 = $this->getDBConn(0)->select('Nav', '*', "WHERE information_systemId = 4 AND type = 1 AND parent_nav = $id ORDER BY nav_index");

            if (is_null($this->getDBConn(0)->lastException) && count($dbResults2) > 0)
            {
                echo(' <span class="nav-dropdown-icon">&#xe5cf;</span>
                <ul>');
                foreach($dbResults2 as $navItem2)
                {
                    $id = $navItem2['id'];
                    $text = trim($navItem2['text']);
                    $url = trim($navItem2['url']);
                    $navId = trim($navItem2['nav_id']);

                    echo('<li' . (isset($navId) && $navId != '' ? " id = $navId" : '') . '>');
                    echo((isset($url) && $url != '' ? "<a href=\"$url\">" : ''));
                    echo($text);
                    echo((isset($url) && $url != '' ? '</a>' : ''));
                    echo('</li>');
                }
                echo('</ul>');
            }

            echo('</li>');
        }
    }
    else
    {
        // ERROR
        var_dump($dbconn->lastException->getMessage());
    }
?>
</ul>