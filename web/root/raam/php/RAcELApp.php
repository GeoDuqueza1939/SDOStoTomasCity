<?php
class RAcEL_App
{
    public function __construct()
    {

    }

    public function run()
    {
        if (isset($_REQUEST) && array_key_exists('proc', $_REQUEST))
        {
            $this->process();
        }
        else if (isset($_REQUEST) && array_key_exists('ui', $_REQUEST) && isset($_REQUEST['ui']))
        {
            
        }
        else
        {
            
        }    
    }

    private function isLoggedOn() : bool
    {
        return true;
    }

    private function writeHTMLHead()
    {}

    private function writeHTMLTail()
    {}

    public function process()
    {
        echo("PROCESS API<br>");
    }
}

?>