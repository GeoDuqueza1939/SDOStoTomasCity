<?php E_STRICT;

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
?>