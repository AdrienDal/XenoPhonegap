myApp.onPageInit('profil', function (page) {
    initUserPage ();
});



function initUserPage () {
    $("#nameUserProfil").html(user.name);
    $("#imgUserProfil").prop('src',"./img/avatar/"+user.thumbnail+".png");

    if (user.role == "administrator" || user.role == "bbp_moderator") {
        $("#viaUserProfil").html("rôle " + user.role);
    }else {
        $("#viaUserProfil").html("via " + user.connexion);
    }
 }

function changeColorTheme(btn,color) {
    removeClassByPrefix(document.body,'theme');
    $('body').addClass('theme-'+color);
}

function changeLayoutTheme(btn,color) {
    removeClassByPrefix(document.body,'layout');
    $('body').addClass('layout-'+color);
}

function removeClassByPrefix(el, prefix) {
    var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
    el.className = el.className.replace(regx, '');
    return el;
}

function openUpdateProfil() {
    myApp.popup('.popup-profil');
    var avatarImg = $("#img"+user.thumbnail);
    $("#login_update").val(user.name);
    $("#email_update").val(user.email);
    avatarImg.css('border','red solid 2px');
}

$(".choixAvatar").on('click',function() {
    $(".choixAvatar").css('border','none');
    var avatarImg = $(this);
    avatarImg.css('border','red solid 2px');
    user.thumbnail = $(this).attr('tag');
});

function updateProfil(){
    var login_update = $("#login_update").val();
    var password_update = $("#password_update").val();
    var password_repeat_update = $("#password_repeat_update").val();
    var email = $("#email_update").val();
    var bool_password = false;

    if ( password_update.length > 0) {
        if (password_update == password_repeat_update) {
            bool_password = true;
        }else {
            myApp.alert("Mots de passe différents", "Erreur");
            return;
        }
    }

    $.ajax({
        url: apiHost+'/xeno/users/me',
        type: 'PUT',
        dataType: 'json',
        data: {"login": login_update, "image":  user.thumbnail, "boolpassword" : bool_password ,"email" : email, "password" : password_update },
        beforeSend: setHeader
    }).done(function (data) {
        if (data) {
            user.name = data.name;
            user.email = data.email;

            initIndexPage();

            localStorage.setItem('login_native', user.name);
            $("#login_native").val(localStorage.getItem('login_native'));
            if (bool_password) {
                localStorage.setItem('password_native', password_update);
                $("#password_native").val(localStorage.getItem('password_native'));
            }

            $("#password_update").val("");
            $("#password_repeat_update").val("");

            myApp.closeModal('.popup-profil');
            mainView.router.refreshPage();
            myApp.alert("Modification acceptée", "Information");
        }else {
            myApp.alert("Une erreur est survenue lors de la modification", "Erreur");
        }
    }).fail(function (error) {
        alert(error);
    });
}