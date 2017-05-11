myApp.onPageInit('profil', function (page) {
    initUserPage ();
});

myApp.onPageInit('profil_Details', function (page) {
    initUserDetails ();
});


function initUserPage () {
    $("#nameUserProfil").html(user.name);
    $("#imgUserProfil").prop('src',"./img/avatar/"+user.thumbnail+".png");
    $("#viaUserProfil").html("via " + user.connexion);
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
    $("#login_update").html(user.name);
    $("#email_update").html(user.email);
    avatarImg.css('border','red solid 2px');
}

$(".choixAvatar").on('click',function() {
    $(".choixAvatar").css('border','none');
    var avatarImg = $(this);
    avatarImg.css('border','red solid 2px');
});