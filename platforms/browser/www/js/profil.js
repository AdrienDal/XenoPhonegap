myApp.onPageInit('profil', function (page) {
    initUserPage ();
});


myApp.onPageInit('profil_Details', function (page) {
    initUserDetails ();
});
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

function initUserDetails() {
        $.ajax({
            url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/me',
            type: 'GET',
            dataType: 'json',
            beforeSend: setHeader
        }).done(function( data ) {
            user.name = data.name;
            user.thumbnail = data.thumbnail;
            user.connexion = data.connexion;
            user.mail=data.user_mail;
            user.id = data.id_user;
	 $("#nomUtilisateur").val(user.name);
            $(".email").val(user.mail);
            $(".imgAvatarD").prop('src',user.thumbnail);
});
}


function initUserPage () {
        $.ajax({
            url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/me',
            type: 'GET',
            dataType: 'json',
            beforeSend: setHeader
        }).done(function( data ) {
            user.name = data.name;
            user.thumbnail = data.thumbnail;
            user.connexion = data.connexion;
            user.mail=data.user_mail;
            user.id = data.id_user;
            $(".nomUtilisateur").html(user.name);
            $(".imgAvatar").prop('src', user.thumbnail);
            $(".email").html(user.mail);
        });
    }