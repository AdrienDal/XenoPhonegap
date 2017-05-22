myApp.onPageInit('index', function (page) {
    initIndexPage();
});

/*$$(document).on('page:init', function (e) {
 initIndexPage ();
 });*/

myApp.onPageBack('index', function (page) {
    initIndexPage();
});

hello.init({
    google: '656984324806-sr0q9vq78tlna4hvhlmcgp2bs2ut8uj8.apps.googleusercontent.com',
    facebook: '198728560590653'
}, {
    redirect_uri: 'https://adodson.com/hello.js/redirect.html'
});

if (localStorage.getItem('login_native') != 'undefined' && localStorage.getItem('password_native') != 'undefined') {
    $("#login_native").val(localStorage.getItem('login_native'));
    $("#password_native").val(localStorage.getItem('password_native'));
}

if (localStorage.getItem('user') != 'undefined') {
    user = JSON.parse(localStorage.getItem('user'));
    initIndexPage()
    myApp.closeModal('.login-screen');
}

function logout() {
    user = "";
    localStorage.removeItem('user');
    hello(user.connexion).logout().then(function () {
        alert('Signed out');
    }, function (e) {
        alert('Signed out');
    });
    myApp.loginScreen();
}

function login(network) {
    var hi = hello(network);
    hi.login().then(function (r) {
        return hi.api('me').then(function (json) {
            user = json;
            user.connexion = network;
            $.post(apiHost+"/xeno/users", {
                    facebookId: (user.connexion == 'facebook') ? user.id : "",
                    googleId: ((user.connexion == 'google') ? user.id : ""),
                    name: user.name,
                    thumbnail: user.thumbnail
                },
                function (reponse) {
                    user.token = reponse;
                    localStorage.setItem('user', JSON.stringify(user));
                    initIndexPage();
                    myApp.closeModal('.login-screen');
                })
        }, function (e) {
            alert('Whoops! ' + e.error.message);
        });
    })
}


function setHeader(xhr) {
    xhr.setRequestHeader('Authorization', user.token);
}


function initIndexPage() {
    $.ajax({
        url: apiHost+'/xeno/users/me',
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader
    }).done(function (data) {
        user.role = "";
        user.name = data.name;
        user.thumbnail = data.thumbnail;
        user.connexion = data.connexion;
        user.email = data.email;
        user.id = data.id_user;
        user.role = data.role;

        $("#nameUser").html(user.name);
        $("#imgUser").prop('src', "./img/avatar/" + user.thumbnail + ".png");
        if (user.role == "administrator" || user.role == "bbp_moderator") {
            $("#viaUser").html("rôle " + user.role);
            $("#btnProfil").html("Modération");
        }else {
            $("#viaUser").html("via " + user.connexion);
            $("#btnProfil").html("<i class='f7-icons size-15'>person</i>Profil");
        }

        if (data.first_connect < 1) {
            $.ajax({
                url: apiHost+'/xeno/users/firstconnect/me',
                type: 'PUT',
                beforeSend: setHeader
            });
            mainView.router.loadPage('mesjeux.html');
        }
    });
}

/*********************************************** INSCRIPTION ET CONNEXION NATIVE ****************************************/

function validationCharte() {

    myApp.confirm("" +
        "<div align='left' style='text-transform:  none; font-size : 12px; ' >Xenomorphe SARL offre, à des fins ludiques, un système de messagerie instantanée pour communiquer entre joueurs.<br /><br />" +
        "La messagerie ne doit pas être utilisée pour diffuser des informations contraires à la morale et aux lois en vigueur.<br /><br />" +
        "En cas de non-respect de ces directives, un modérateur peut sans préavis supprimer et exclure l'utilisateur de l'application.<br /> <br />" +
        "Xenomorphe SARL se delecte de toutes responsabilités par rapport à l'application, la messagerie et les données.<br /><br />" +
        "<b>En cliquant sur OK, je confirme l'approbation de ces règles.</b></div>"
        , "Régles d'utilisation", function () {

        }, function () {
            myApp.closeModal('.popup-inscription');
        });
}

function inscriptionNative() {

    var login_inscription = $("#login_inscription").val();
    var password_inscription = $("#password_inscription").val();
    var password_repeat_inscription = $("#password_repeat_inscription").val();
    var email_inscription = $("#email_inscription").val();


    if (password_inscription == password_repeat_inscription) {
        $.post(apiHost+"/xeno/users/native",
            {
                login: login_inscription,
                password: password_inscription,
                email: email_inscription,
                thumbnail: 0
            },
            function (reponse) {
                if (reponse == false) {
                    myApp.alert("Nom d'utilisateur ou email existant", "Erreur");
                } else {
                    myApp.alert("", 'Inscription terminée avec succès');
                    $("#login_native").val(login_inscription);
                    $("#password_native").val(password_inscription);
                    myApp.closeModal('.popup-inscription');
                }
            }).fail(function () {
            alert("error");

        })
    } else {
        alert('password incorrect');
    }
}


function connexionNative() {
    var login_native = $("#login_native").val();
    var password_native = $("#password_native").val();
    if (login_native.length > 0 && password_native.length > 0) {
        $.post(apiHost+"/jwt-auth/v1/token", {
            username: login_native,
            password: password_native
        }, function (reponse) {
            user = reponse;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('login_native', login_native);
            localStorage.setItem('password_native', password_native);
            initIndexPage();
            myApp.closeModal('.login-screen');
        }).fail(function () {
            alert("error");
        });
    }
}