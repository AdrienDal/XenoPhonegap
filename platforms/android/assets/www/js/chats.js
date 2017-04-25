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
        url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/getlastchatmessages/'+idpost+'?premier='+idDernierMsg+'&nombre=30',
        type: 'GET',
        dataType: 'json',
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
        url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/getchats',
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader
    }).done(function (response) {
        $.each(response, function () {
            var fav;
            var lastmsg;
            (!$(this)[0].favoris) ? fav = "" : fav = "fav";
            (!$(this)[0].lastMsg) ?
                lastmsg = "<div class='item-subtitle'>Aucun message</div>" +
                "<div class='item-text'>Soyez le premier à écrire dans ce chat !</div>" +
                "</div>" :
                lastmsg = "<div class='item-subtitle'>" + $(this)[0].lastMsg[0].message_datetime +"</div>" +
                "<div class='item-text'>"+  $(this)[0].lastMsg[0].display_name +" : "+  $(this)[0].lastMsg[0].message_texte +"</div>" +
                "</div>";
            $("#listViewChats").append("" +
                "<li class='" + fav + "' onClick=\"mainView.router.loadPage('chats.html?id="+$(this)[0].ID+"')\">" +
                "<a class='item-link item-content'>" +
                "<div class='item-media'>" +
                "<img src='" + $(this)[0].featured_image_thumbnail_url + "' width='80' max-height='70'/>" +
                "</div>" +
                "<div class='item-inner'>" +
                "<div class='item-title-row'>" +
                "<div class='item-title'>" + $(this)[0].post_title + "</div>" +
                "</div>" +
                lastmsg +
                "</a>" +
                "</li>"
            );
        })
        $("#loaderChat").remove();
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