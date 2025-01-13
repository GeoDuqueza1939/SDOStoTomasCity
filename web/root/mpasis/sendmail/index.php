<?php E_STRICT;

function mail_demo()
{
    if (isset($_REQUEST['send']) && $_REQUEST['send'])
    {
        // recipient email address
        $to = "geovaniduqueza1939@gmail.com";
        
        // subject of the email
        $subject = "Test Email with Attachment";
        
        // message body
        $messagebody = "This is a <b><i>sample</i> email</b> with <u>attachment</u>.";
        // $messagebody = "This is a sample email with attachment.";
        
        // from
        $from = "sdo.santotomas@deped.gov.ph";
    
        // CC
        $cc = "geovaniduqueza1939@outlook.com";
        $bcc = "geovaniduqueza1939@yahoo.com";
        $replyto = "geovani.duqueza@deped.gov.ph";
        
        // boundary
        // $boundary = uniqid();
        $boundary = "PHP-mixed-".md5(time());
        
        // header information
        $headers = "From: $from\r\n";
        // $headers .= "CC: $cc\r\n";
        // $headers .= "BCC: $bcc\r\n";
        $headers .= "Reply-To: $replyto\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
        
        // attachment
        $attachment = chunk_split(base64_encode(file_get_contents('file.pdf')));
        
        // message with attachment
        $message = "\r\n--".$boundary."\r\n";
        $message .= "Content-Type: text/html; charset=\"UTF-8\";\r\n";
        $message .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $message .= chunk_split(base64_encode($messagebody));
        // $message .= $messagebody."\r\n";
        $message .= "\r\n--".$boundary."\r\n";
        $message .= "Content-Type: application/octet-stream; name=\"file.pdf\"\r\n";
        $message .= "Content-Transfer-Encoding: base64\r\n";
        $message .= "Content-Disposition: attachment; filename=\"file.pdf\"\r\n";
        $message .= $attachment;
        $message .= "\r\n--".$boundary."--";
        
        // send email
        if (mail($to, $subject, $message, $headers)) {
            echo "Email with attachment sent successfully.";
        } else {
            echo "Failed to send email with attachment.";
        }
    }
    else
    { ?>
    <form method="GET" action="<?php echo $_SERVER['PHP_SELF']; ?>">
    <input type="hidden" name="send" value="true">
    <button type="submit">Send Email</button>
    </form>
    
    <?php
    
    // var_dump(chunk_split(base64_encode(file_get_contents('file.pdf'))));
    
    }
}

function send_email() : bool
{
    $debug = false;

    $eol = PHP_EOL;

    $headers = '';
    $message = '';
    $boundary = "MPaSIS-".md5(time());

    $from = (isset($_REQUEST['from']) ? trim($_REQUEST['from']) : null);
    $to = (isset($_REQUEST['to']) ? trim($_REQUEST['to']) : null);
    $cc = (isset($_REQUEST['cc']) ? trim($_REQUEST['cc']) : null);
    $bcc = (isset($_REQUEST['bcc']) ? trim($_REQUEST['bcc']) : null);
    $replyTo = (isset($_REQUEST['reply-to']) ? trim($_REQUEST['reply-to']) : null);

    $emailContentType = (isset($_REQUEST['email-content-type']) ? trim($_REQUEST['email-content-type']) : 'text/plain');

    $subject = (isset($_REQUEST['subject']) ? $_REQUEST['subject'] : '');
    $body = (isset($_REQUEST['body']) ? $_REQUEST['body'] : '');

    $attachment = (isset($_FILES['attachment']) && $_FILES['attachment']['name'][0] !== '' ? chunk_split(base64_encode(file_get_contents($_FILES['attachment']['tmp_name']))) : null);

    if (!is_null($from) && !is_null($to))
    {
        $headers .= "From: $from\r\n";
        if (!is_null($cc) && trim($cc) !== '')
        {
            $headers .= "CC: $cc\r\n";
        }
        if (!is_null($bcc) && trim($bcc) !== '')
        {
            $headers .= "BCC: $bcc\r\n";
        }
        if (!is_null($replyTo) && trim($replyTo) !== '')
        {
            $headers .= "Reply-To: $replyTo\r\n";
        }
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
    }
    else
    {
        return false;
    }

    $message .= "\r\n--".$boundary."\r\n";
    $message .= "Content-Type: $emailContentType; charset=\"UTF-8\";\r\n";
    $message .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $message .= chunk_split(base64_encode($body));

    if (!is_null($attachment))
    {
        $message .= "\r\n--".$boundary."\r\n";
        $message .= "Content-Type: application/octet-stream; name=\"" . $_FILES['attachment']['name'] . "\"\r\n";
        $message .= "Content-Transfer-Encoding: base64\r\n";
        $message .= "Content-Disposition: attachment; filename=\"" . $_FILES['attachment']['name'] . "\"\r\n\r\n";
        $message .= $attachment;
    }

    $message .= "\r\n--".$boundary."--";

    if ($debug)
    {
        echo "<pre>";
        echo $to;
        echo "\r\n";
        echo $subject;
        echo "\r\n";
        echo $headers;
        echo "\r\n";
        echo $message;
        echo "</pre>";

        // return true; // mail();
    }
    else
    {
        return mail($to, $subject, $message, $headers);
    }
}

function create_email_composer_ui()
{ ?>
    <main id="email-composer">
        <form id="email-composer-form" name="email-composer-form" method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>?sending" enctype="multipart/form-data">
            <label for="from">From:</label> <br><input id="from" name="from" type="email" value="<?php echo (isset($_REQUEST['from']) ? $_REQUEST['from'] : 'sdo.santotomas@deped.gov.ph'); ?>" placeholder="Enter email address" required><br>
            <label for="to">To:</label> <br><input id="to" name="to" type="email" value="<?php echo (isset($_REQUEST['to']) ? $_REQUEST['to'] : ''); ?>" placeholder="Enter email address" required><br>
            <label for="cc">CC:</label> <br><input id="cc" name="cc" type="email" value="<?php echo (isset($_REQUEST['cc']) ? $_REQUEST['cc'] : 'sdostc.personnel@deped.gov.ph'); ?>" placeholder="Enter email address"><br>
            <label for="reply-to">Reply To:</label> <br><input id="reply-to" name="reply-to" type="email" value="<?php echo (isset($_REQUEST['reply-to']) ? $_REQUEST['reply-to'] : 'sdostc.personnel@deped.gov.ph'); ?>" placeholder="Enter email address" required><br>
            <label for="email-content-type">Email type:</label> <br><select id="email-content-type" name="email-content-type">
                <option value="text/plain">text/plain</option>
                <option value="text/html" selected>text/html</option>
            </select><br>
            <label for="subject">Subject:</label> <br><input id="subject" name="subject" type="text" value="<?php echo (isset($_REQUEST['subject']) ? $_REQUEST['subject'] : ''); ?>" placeholder="Enter subject" required><br>
            <label for="body">Body:</label> <br><textarea id="body" name="body" placeholder="Type content" style="width: 100%; height: 10em;"><?php echo (isset($_REQUEST['body']) ? $_REQUEST['body'] : "<p>Dear Applicant,</p>
<p>Thank you for your interest in the <b>Project Development Officer II</b> position. Attached is the result of our initial evaluation of your application. Qualified applicants are hereby invited to the Open Ranking/Comparative Assessment, the schedule and venue of which shall be announced via the SDO's official issuances and memorandums. For updates, visit <a href=\"https://www.depedstotomascity.com\">www.depedstotomascity.com</a>, the SDO Sto. Tomas City Personnel Unit Facebook page at <a href=\"https://www.facebook.com/SDOStoTomasCityPersonnelSection/\">www.facebook.com/SDOStoTomasCityPersonnelSection/</a>, or the Schools Division Office for more information.</p>
<p>Kindly acknowledge the receipt of this communication by replying to this email or sending your response to <a href=\"mailto:sdostc.personnel@deped.gov.ph\">sdostc.personnel@deped.gov.ph</a>.</p>
<p>Regards,</p>
<p><b>The Personnel Unit Team</b></p>"); ?></textarea><br>
            <span style="float: left;"><label for="attachment">Attachment:</label> <input id="attachment" name="attachment" type="file"></span>
            <button type="submit">Send Email</button>
        </form>
        <?php if (isset($_REQUEST['sending'])) echo (send_email() ? 'Email sent.' : 'Sending failed.' );// var_dump (isset($_FILES['attachment']) && $_FILES['attachment']['name'][0] !== '' ? chunk_split(base64_encode(file_get_contents($_FILES['attachment']['tmp_name']))) : ''); ?>
    </main>
<?php
}

create_email_composer_ui();
?>