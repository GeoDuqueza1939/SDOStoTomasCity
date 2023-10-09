<?php E_STRICT;
trait JsMsgDisplay
{
    private function jsMsgBox($caption, $msg, $type = 0, $funcName = "serverMsg")
    {
        $funcName .= $this->jsTailScriptCount;
        $typeIcon = ($type > 0 && $type < 8 ? '<span class=\"material-icons-round'
            . ($type === 1 ? ' blue' : ($type === 2 ? ' green' : ($type === 3 ? ' orange' : ($type === 4 ? ' orange' : ($type === 5 ? ' crimson' : ($type === 6 ? ' red' : ' magenta'))))))
            . ' message-box-icon\">'
            . ($type === 1 ? 'info' : ($type === 2 ? 'check_circle' : ($type === 3 ? 'cancel' : ($type === 4 ? 'warning' : ($type === 5 ? 'error' : ($type === 6 ? 'error' : 'bug_report'))))))
            . '</span> ' : '');
        
        ?>
<script>
function <?php echo($funcName); ?>() {
    new MessageBox().setup(app.main, "<?php echo(htmlentities($caption, ENT_QUOTES)); ?>", ("<?php echo($typeIcon . htmlentities($msg, ENT_QUOTES)); ?>").replace(/&lt;(.+?)&gt;/g, "<$1>"));
}
</script><?php
        $this->jsTailScripts .= "if ($funcName !== null && $funcName !== undefined && ElementEx.type($funcName) === \"function\")\n{\n    $funcName();\n}\n";
        $this->jsTailScriptCount++;
    }

    private function jsMsgConsole($msg, $funcName = "serverMsg")
    {
        $funcName .= $this->jsTailScriptCount; ?>
<script>
function <?php echo($funcName); ?>() {
    console.log(JSON.parse("<?php echo(preg_replace('/"/', '\"', $msg)); ?>"));
}
</script><?php
        $this->jsTailScripts += "if ($funcName !== null && $funcName !== undefined && ElementEx.type($funcName) === \"function\")\n{\n    $funcName();\n}\n";
        $this->jsTailScriptCount++;
    }

    private function jsSimpleMsgBox($msg)
    { 
        $this->jsMsgBox('SeRGS Message', $msg, 0, 'simpleMsg');
    }
        
    private function jsInfoMsgBox($msg)
    { 
        $this->jsMsgBox('SeRGS Info', $msg, 1, 'infoMsg');
    }
        
    private function jsSuccessMsgBox($msg)
    { 
        $this->jsMsgBox('SeRGS Info', $msg, 2, 'infoMsg');
    }
        
    private function jsFailMsgBox($msg)
    { 
        $this->jsMsgBox('SeRGS Info', $msg, 3, 'infoMsg');
    }
        
    private function jsWarningMsgBox($msg)
    { 
        $this->jsMsgBox('SeRGS Warning', $msg, 4, 'infoMsg');
    }
        
    private function jsExceptionMsgBox($exceptionMsg)
    { 
        $this->jsMsgBox('SeRGS Exception', $exceptionMsg, 5, 'exceptionMsg');
    }
        
    private function jsErrorMsgBox($errMsg)
    { 
        $this->jsMsgBox('SeRGS Error', $errMsg, 6, 'errorMsg');
    }

    private function jsDebugMsgBox($debugMsg)
    { 
        $this->jsMsgBox('SeRGS Debug', $debugMsg, 7, 'debugMsg');
    }

    private function jsDebugConsole($msg)
    { 
        $this->jsMsgConsole("SeRGS Debug:\n " . $msg);
    }

    private function jsDebugHTMLOutput($callback, $header = '')
    { ?>
        <div style="margin: 1em; padding: 1em; border: 1px ridge gray; overflow: auto; white-space: pre-wrap;"><?php echo(is_null($header) || !is_string($header) || $header === '' ? '' : "<h1 style=\"margin: -0.8em -0.8em 0.5em; padding: 0.25em; border-bottom: 1px ridge gray; font-size: 1.25em; color: white; background-color: gray; text-shadow: 1.5px 1.5px 2px black; letter-spacing: 0.1em;\">$header</h1>"); $callback(); ?></div><?php
    }
}
?>