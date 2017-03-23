myApp.onPageInit('listechats', function (page) {
    initListeChatsPage();
});

myApp.onPageInit('chats', function (page) {
    initChatsPage(page.query.id);
});

function initChatsPage(id) {
    idpost = id;
    idDernierMsg =  0;
    myMessages = myApp.messages('.messages', {
        autoLayout: true
    });
    getLastMessages(idpost,true);
    interval = setInterval(function(){getLastMessages(idpost,true)}, 5000);
}

function getLastMessages(async) {
    var chatMessages = [];
    $.ajax({
        url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/getchatmessages',
        type: 'POST',
        dataType: 'json',
        data: {"post": idpost, "premier": idDernierMsg, "nombre": 1000},
        async : async,
        beforeSend: setHeader
    }).done(function (response) {
        if (idDernierMsg < response[0].id_message) {
            $.each(response, function (key, value) {
                chatMessages.push({
                    text: value.message_texte,
                    date: value.message_datetime,
                    name: value.display_name,
                    avatar: value.image,
                    type: (user.id == value.id_user) ? 'sent' : 'received'
                });
            });
            idDernierMsg = response[response.length - 1].id_message;
            myMessages.addMessages(chatMessages);
        }
    });
}

function envoieMsg() {
    clearInterval(interval);
    var messageText = $("#tAMessage").val().trim();
    $("#tAMessage").val('');
    $.ajax({
        url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/addmessage',
        type: 'POST',
        dataType: 'json',
        data: {"post": idpost, "message": messageText},
        beforeSend: setHeader
    }).done(function(response) {
        myMessages.addMessage({
            text: messageText,
            type: 'sent',
            avatar: user.thumbnail,
            name: user.name
        }, 'append', true);
        idDernierMsg = response;
        interval = setInterval(function(){getLastMessages(idpost,true)}, 5000);
    });
}

function initListeChatsPage() {
    $.ajax({
        url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/jeux',
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader
    }).done(function (response) {
        $.each(response, function () {
            var fav;
            (!$(this)[0].favoris) ? fav = "" :
                fav = "fav";
            $("#listViewChats").append("" +
                "<li class='" + fav + "' onClick=\"mainView.router.loadPage('chats.html?id="+$(this)[0].ID+"')\">" +
                "<a class='item-link item-content'>" +
                "<div class='item-media'>" +
                "<img src='" + $(this)[0].featured_image_thumbnail_url + "' width='80' max-height='70'/>" +
                "</div>" +
                "<div class='item-inner'>" +
                "<div class='item-title-row'>" +
                "<div class='item-title'>" + $(this)[0].post_title + "</div>" +
                "<div class='item-after'><span class='badge theme-red'>5</span></div>" +
                "</div>" +
                "<div class='item-subtitle'>Dernier message - Jeudi 3 février</div>" +
                "<div class='item-text'>bla bla bla bla bla bla bla</div>" +
                "</div>" +
                "</a>" +
                "</li>"
            );
        })
        $("#loader").remove();
        $("#listViewChats").fadeIn();
        showOrHideFavChats(true);
    })
};

function showOrHideFavChats(favoris) {
    if (favoris) {
        $("#favChats").addClass("active");
        $("#tousChats").removeClass("active");
        $("#listViewChats li:not('.fav')").each(function () {
            $(this).fadeOut();
        })
    } else {
        $("#favChats").removeClass("active");
        $("#tousChats").addClass("active");
        $("#listViewChats li").each(function () {
            $(this).fadeIn();
        })
    }
}