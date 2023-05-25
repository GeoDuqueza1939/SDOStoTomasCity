<form class="sign-form" action="<?php echo($_SERVER['PHP_SELF']);?>" method="POST">
    <input type="hidden" name="a" value="logout">
    <button class="sign-out-button" type="submit">Sign Out</button><br>
</form>
<!-- <a class="sign-in-out-link" href="<?php echo($_SERVER['PHP_SELF'] . '?a=logout');?>">Sign Out</a><br /> -->