<form class="sign-form" action="/login?src=<?php echo $_SERVER['PHP_SELF']; ?>" method="POST">
    <input type="hidden" name="src" value="<?php echo $_SERVER['PHP_SELF']; ?>">
    <button class="sign-in-button" type="submit">Sign In</button><br>
</form>
<!-- <a class="sign-in-out-link" href="<?php echo('/login?src=' . $_SERVER['PHP_SELF']);?>">Sign-in</a> -->
