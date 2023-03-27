<!-- <nav id="navbar" class="navbar bg-primary p-0 align-items-start z-1">
    <ul id="nav" class="navbar-nav p-2 align-items-start">
        <li id="home" class="nav-item"><a class="nav-link" tabindex="0"><span class="material-icons-round">home</span> <span class="nav-item-text">Home</span></a></li>
        <li id="dashboard" class="nav-item"><a class="nav-link" tabindex="0"><span class="material-icons-round">dashboard</span> <span class="nav-item-text">Dashboard</span></a></li>
        <li id="view-sr" class="nav-item"><a class="nav-link accordion-button collapsed" role="button" data-bs-toggle="collapse" data-bs-target="#lev2list0" aria-expanded="false" aria-controls="lev2list0" tabindex="0"><span class="material-icons-round">pageview</span> <span class="nav-item-text">View Service Record</span></a>
            <ul class="nav navbar-nav accordion-collapse collapse" id="lev2list0">
                <li id="view-my-sr" class="nav-item"><a class="nav-link" tabindex="0"> <span class="nav-item-text">My Service Record</span></a></li>
                <li id="search-sr" class="nav-item"><a class="nav-link" tabindex="0"> <span class="nav-item-text">Search</span></a></li>
            </ul>
        </li>
        <li id="requests" class="nav-item"><a class="nav-link accordion-button collapsed" role="button" data-bs-toggle="collapse" data-bs-target="#lev2list1" aria-expanded="false" aria-controls="lev2list1" tabindex="0"><span class="material-icons-round">task</span> <span class="nav-item-text">Requests</span></a>
            <ul class="nav navbar-nav accordion-collapse collapse" id="lev2list1">
                <li id="my-requests" class="nav-item"><a class="nav-link" tabindex="0"> <span class="nav-item-text">My Requests</span></a></li>
                <li id="new-request" class="nav-item"><a class="nav-link" tabindex="0"> <span class="nav-item-text">New Request</span></a></li>
                <li id="for-encode" class="nav-item"><a class="nav-link" tabindex="0"> <span class="nav-item-text">For Encode/Update</span></a></li>
                <li id="for-certify" class="nav-item"><a class="nav-link" tabindex="0"> <span class="nav-item-text">For Certification</span></a></li>
                <li id="for-approve" class="nav-item"><a class="nav-link" tabindex="0"> <span class="nav-item-text">For Approval</span></a></li>
                <li id="for-release" class="nav-item"><a class="nav-link" tabindex="0"> <span class="nav-item-text">For Release</span></a></li>
                <li id="requests-archive" class="nav-item"><a class="nav-link" tabindex="0"> <span class="nav-item-text">Archived Requests</span></a></li>
                <li id="search-requests" class="nav-item"><a class="nav-link" tabindex="0"> <span class="nav-item-text">Search</span></a></li>
            </ul>
        </li>
        <li id="logs" class="nav-item"><a class="nav-link" tabindex="0"><span class="material-icons-round">fact_check</span> <span class="nav-item-text">System Logs</span></a></li>
        <li id="account" class="nav-item"><a class="nav-link accordion-button collapsed" role="button" data-bs-toggle="collapse" data-bs-target="#lev2list2" aria-expanded="false" aria-controls="lev2list2" tabindex="0"><span class="material-icons-round">account_circle</span> <span class="nav-item-text">Account</span></a>
            <ul class="nav navbar-nav accordion-collapse collapse" id="lev2list2">
                <li id="my-account" class="nav-item"><a class="nav-link" tabindex="0"> <span class="nav-item-text">Edit My Account</span></a></li>
                <li id="other-account" class="nav-item"><a class="nav-link" tabindex="0"> <span class="nav-item-text">Edit Another Account</span></a></li>
                <li id="logout" class="nav-item"><a class="nav-link" tabindex="0"> <span class="nav-item-text">Logout</span></a></li>
            </ul>
        </li>
        <li id="settings" class="nav-item"><a class="nav-link" tabindex="0"><span class="material-icons-round">settings</span> <span class="nav-item-text">Settings</span></a></li>
    </ul>
</nav> -->
<nav id="navbar">
    <button id="nav-toggle"><span class="material-icons-rounded">menu</span></button>
    <ul id="nav">
        <li id="home"><a href="/sergs/"><span class="material-icons-round">home</span> Home</a></li>
        <li id="dashboard"><a href="/sergs/dashboard/"><span class="material-icons-round">dashboard</span> Dashboard</a></li>
        <li id="view-sr"><a href="/sergs/view/"><span class="material-icons-round">pageview</span> View Service Record</a> <span class="nav-dropdown-icon">&#xe5cf;</span>
            <ul>
                <li id="view-my-sr"><a href="/sergs/view/my_service_record/">My Service Record</a></li>
                <li id="search-sr"><a href="/sergs/view/search/">Search</a></li>
            </ul>
        </li>
        <li id="requests"><a href="/sergs/requests/"><span class="material-icons-round">task</span> Requests</a> <span class="nav-dropdown-icon">&#xe5cf;</span>
            <ul>
                <li id="my-requests"><a href="/sergs/requests/my_requests/">My Requests</a></li>
                <li id="new-request"><a href="/sergs/requests/new_request/">New Request</a></li>
                <li id="for-encode"><a href="/sergs/requests/for_update/">For Encode/Update</a></li>
                <li id="for-certify"><a href="/sergs/requests/for_certification/">For Certification</a></li>
                <li id="for-approve"><a href="/sergs/requests/for_approval/">For Approval</a></li>
                <li id="for-release"><a href="/sergs/requests/for_release/">For Release</a></li>
                <li id="requests-archive"><a href="/sergs/requests/archive/">Archived Requests</a></li>
                <li id="search-requests"><a href="/sergs/requests/search/">Search</a></li>
            </ul>
        </li>
        <li id="logs"><a href="/sergs/logs/"><span class="material-icons-round">fact_check</span> System Logs</a></li>
        <li id="account"><a href="/sergs/account/"><span class="material-icons-round">account_circle</span> Account</a> <span class="nav-dropdown-icon">&#xe5cf;</span>
            <ul>
                <li id="my-account"><a href="/sergs/account/edit/">Edit My Account</a></li>
                <li id="other-account"><a href="/sergs/account/edit_other/">Edit Another Account</a></li>
                <li id="logout"><a href="?a=logout">Logout</a></li>
            </ul>
        </li>
        <li id="settings"><a href="/sergs/settings/"><span class="material-icons-round">settings</span> Settings</a></li>
    </ul>
</nav>