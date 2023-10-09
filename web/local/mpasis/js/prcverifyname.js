// https://online.prc.gov.ph/verification

function checkverifyNa()
{
    emptycheck = 0;
    var verNaProf = $("#verNaProf").val(); 
    var verNaFname = $("#verNaFname").val(); 
    var verNaLname = $("#verNaLname").val(); 

    if (verNaProf == null || verNaProf.replace(/\s/g, '') == "") {
        $( "span[aria-labelledby='select2-verNaProf-container']" ).css("border-color", "red");
        emptycheck = 1;
    }
    else
        $("span[aria-labelledby='select2-verNaProf-container']" ).css("border-color", "");

    if (verNaFname == null || verNaFname.replace(/\s/g, '') == "") {
        $("#verNaFname").css("border-color", "red");
        emptycheck = 1;
    }
    else
        $("#verNaFname").css("border-color", "");
    
    if (verNaLname == null || verNaLname.replace(/\s/g, '') == "") {
        $("#verNaLname").css("border-color", "red");
        emptycheck = 1;
    }
    else
        $("#verNaLname").css("border-color", "");

    return emptycheck;
}

function verifyNa()
{
    var verNaProf = $("#verNaProf").val();
    var verNaFname = $("#verNaFname").val(); 
    var verNaLname = $("#verNaLname").val(); 

    $("#loadersss").show();

    if(checkverifyNa() != 0)
    {
        setTimeout(function () {
            $("#loadersss").hide();
            
            swal({
                   title: "NOTIFICATION",
                   text: "Please Fill Out All Required Fields.",
                   type: "info",
                   confirmButtonColor: "#336699",
                   confirmButtonText: "OK",
                   closeOnConfirm: false,
                   closeOnCancel: false
               });
        }, 500);
    }
    else
    {
        $.ajax({
            type: "POST",
            async: true,
            url: "Verification/verifyNa",
            data: {
                Prof : verNaProf,
                Fname: verNaFname,
                Lname: verNaLname,
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                if(data["msg"] == "success"){
                    $("#tableResult").html(data["build"]);
                    setTimeout(function () {
                        $("#myModalVerify").modal("show");
                        $("#loadersss").hide();
                    }, 100);
                }
                else if(data["msg"] == "notFound"){
                    setTimeout(function () {
                       swal({
                             title: "INFORMATION",
                             text: "No results found.",
                             type: "info",
                             confirmButtonColor: "#336699",
                             confirmButtonText: "OK",
                             closeOnConfirm: false,
                             closeOnCancel: false
                         });
                        $("#loadersss").hide();
                    }, 100);
                }
                else
                {
                    setTimeout(function () {
                        showError();
                        $("#loadersss").hide();
                    }, 100);
                }

            },
            error: function (data) {
                if(initErr <= initErrMax){
                    verifyNa();
                    initErr++;
                }
                else{
                        showserverError();
                    $("#loadersss").hide();
                }
            }
        });
    }
}
