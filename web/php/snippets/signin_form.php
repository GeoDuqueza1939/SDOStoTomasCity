<div class="app landing login-page">
    <?php E_STRICT; require_once(__FILE_ROOT__ . '/php/snippets/header_full.php'); ?>
    <section>
        <form action="<?php echo $_SERVER['PHP_SELF'] . (isset($_REQUEST['src']) || isset($_REQUEST['app']) ? '?' . (isset($_REQUEST['app']) ? 'app=' . $_REQUEST['app'] : '') . (isset($_REQUEST['app']) && isset($_REQUEST['src']) ? '&' : '')  . (isset($_REQUEST['src']) ? 'src=' . $_REQUEST['src'] : '') : '');?>" method="POST">
            <fieldset>
                <legend>Please enter your user credentials</legend>
                <!-- <span class="textbox"><input type="email" name="unm" id="unm" placeholder="Username/Email address"></span> -->
                <span class="textbox"><input type="text" name="unm" id="unm" placeholder="Username/Email address"></span>
                <span class="textbox"><input type="password" name="pwd" id="pwd" placeholder="Password"></span>
                <span class="button"><button class="btn btn-primary" type="submit">Login</button></span>
                <span class="button"><button class="btn btn-secondary" type="button">Create Account</button> </span><?php if ($isInvalidSignIn)
                { ?>
                    <p style="font-style: italic; color: red;">Invalid username or password</p>
                <?php } ?>
                <span class="link"><a href="">Forgot password...</a></span>
                <input type="hidden" name="a" value="login">
            </fieldset>
        </form>
    </section>
</div>
