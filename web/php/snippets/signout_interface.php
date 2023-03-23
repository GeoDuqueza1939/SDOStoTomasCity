<!-- <form action="<?php //echo($_SERVER['PHP_SELF']);?>" method="POST">
    <input type="hidden" name="a" value="logout">
    <button type="submit">Sign Out</button><br>
</form> -->
<a class="sign-out-link" href="<?php echo($_SERVER['PHP_SELF'] . '?a=logout');?>">Sign Out</a><br />