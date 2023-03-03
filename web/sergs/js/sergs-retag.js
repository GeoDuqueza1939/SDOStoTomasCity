"use script";

function sergsRetag() {
    this.app = $("#sergs")[0];
    this.appName = $("#app-name")[0];
    this.nav = $("#nav")[0];
    this.main = $("main")[0];
    this.footer = $("footer")[0];

    $("#app-name").wrap("<header class='navbar justify-content-start p-2 position-fixed start-0 top-0 end-0 z-2'></header>")
    createElementEx("", "span", 
        createElementEx("", "button", this.appName.parentElement, this.appName,
            "", "class", "navbar-toggler me-2",// collapsed",
            "", "type", "button",
            "", "title", "Toggle navigation"
        ),
        null, "", "class", "navbar-toggler-icon"
    );

    $("header > .navbar-toggler").tabIndex = 0;

    $("header > .navbar-toggler").click(event, async () => {
        if ($(".app-content")[0].classList.contains("nav-open")) {
            $(".app-content")[0].classList.remove("nav-open");
            $(".app-content")[0].classList.add("nav-opening");
            await sleep(150);
            $(".app-content")[0].classList.remove("nav-opening");
        }
        else {
            $(".app-content")[0].classList.add("nav-opening");
            await sleep(150);
            $(".app-content")[0].classList.remove("nav-opening");
            $(".app-content")[0].classList.add("nav-open");
        }
    });
    
    $("#app-name").addClass("navbar-brand p-0 m-0");

    $("#nav").addClass("navbar-nav p-2 align-items-start");
    $("#nav").wrap("<div class='app-content nav-open'><nav id='navbar' class='navbar bg-primary p-0 align-items-start z-1'></nav></div>"); //collapse'></nav></div>");
    $("#nav li").addClass("navbar-item");
    $("#nav ul").addClass("nav navbar-nav");
    $("#nav li > a").addClass("navbar-link");
    $("#nav li > a").removeAttr("href");
    $("#nav li > a").toArray().forEach((el, aIndex, iArr) => {
        el.childNodes.forEach((node, nIndex, nArr) => {
            if (node.nodeType == 3) {
                var txt = node.textContent.trim();
                var parent = node.parentElement;
                node.remove();
                addText(" ", parent);
                addText(txt, createElementEx("", "span", parent, null, "", "class", "navbar-item-text"));
            }
        });
    });

    $("#nav li > ul").toArray().forEach((lev2list, index, arr) => {
        // lev2list.parentElement.classList.add("accordion-item");
        lev2list.id = "lev2list" + index;
        lev2list.classList.add("accordion-collapse", "collapse");
        lev2list.previousElementSibling.role = "button";
        lev2list.previousElementSibling.classList.add("accordion-button", "collapsed");
        lev2list.previousElementSibling.setAttribute("data-bs-toggle", "collapse");
        lev2list.previousElementSibling.setAttribute("data-bs-target", "#lev2list" + index);
        lev2list.previousElementSibling.setAttribute("aria-expanded", "false");
        lev2list.previousElementSibling.setAttribute("aria-controls", "lev2list" + index);
    });

    this.nav.parentElement.parentElement.appendChild(this.main);

    // $("main").addClass("col-9");

    $("footer").addClass("position-fixed start-0 bottom-0 end-0 d-flex align-items-center justify-content-center");

    $("body").addClass("pb-10");

    $("#sergs > .container-fluid").top = $("header")[0].height;
    $("#sergs > .container-fluid").bottom = $("footer")[0].height;

    $("#navbar").resize(() => {
        console.log("NAVBAR IS BEING RESIZED.")
        $("main").css("left", Math.trunc($("#navbar").width()) + "px");            
    });

    var interval = setInterval(() => {
        // TRY TO ADD A ROUTINE THAT WILL CHECK THE SCREEN DIMENSIONS
        console.log("updating...");
        $("main").css("left", Math.trunc($("#navbar").width()) + "px");
    }, 1000);

    $("#nav a").toArray().forEach((link, index, array) => {
        link.tabIndex = 0;
    });

    return this;
}

var sergs = sergsRetag();
