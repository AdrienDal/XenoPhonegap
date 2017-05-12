myApp.onPageInit('listechats', function (page) {
    initListeChatsPage();
});

myApp.onPageInit('chats', function (page) {
    initChatsPage(page.query.id,page.query.title);
});



function initChatsPage(id,title) {
    $("#titre_navbar").html(title);
    loadMessageProcess = false;
    idpost = id;
    idDernierMsg =  0;
    idPremierMsg = -1;
    myMessages = myApp.messages('.messages', {
        autoLayout: true,
        messageTemplate:
        '{{#if day}}' +
        '<div class="messages-date">{{day}} {{#if time}}, <span>{{time}}</span>{{/if}}</div>' +
        '{{/if}}' +
        '<div tag="{{id}}" class="message message-{{type}} {{#if hasImage}}message-pic{{/if}} {{#if avatar}}message-with-avatar{{/if}} {{#if position}}message-appear-from-{{position}}{{/if}}">' +
        '{{#if name}}<div class="message-name">{{name}}</div>{{/if}}' +
        '<div tag="{{id}}" class="message-text">{{text}}{{#if date}}<div tag="{{id}}" class="message-date">{{date}}</div>{{/if}}</div>' +
        '{{#if avatar}}<div class="message-avatar" style="background-image:url({{avatar}})"></div>{{/if}}' +
        '{{#if label}}<div class="message-label">{{label}}</div>{{/if}}' +
        '</div>'}
    );
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
                    avatar: "./img/avatar/"+value.image+".png",
                    id : value.id_message,
                    type: (user.id == value.id_user) ? 'sent' : 'received'
                });
            });
            if (idPremierMsg == -1) idPremierMsg = response[0].id_message;
            idDernierMsg = response[response.length - 1].id_message;
            myMessages.addMessages(chatMessages);
        }
    });
}

function getBeforeMessages(async) {
    if (loadMessageProcess) return;
    var chatMessages = [];
    loadMessageProcess = true;
    $.ajax({
        url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/getchatmessages/'+idpost+'?premier='+idPremierMsg+'&nombre=10',
        type: 'GET',
        dataType: 'json',
        async : async,
        beforeSend: setHeader
    }).done(function (response) {
            $.each(response, function (key, value) {
                myMessages.prependMessage({
                    text: value.message_texte,
                    date: value.message_datetime,
                    name: value.user_login,
                    avatar: "./img/avatar/"+value.image+".png",
                    id : value.id_message,
                    type: (user.id == value.id_user) ? 'sent' : 'received'
                },false);
            });
            idPremierMsg = response[response.length - 1].id_message;
            if (response.length < 10) $("#btnAncienMsg").remove();
            $(".page-content").animate({ scrollTop: 0});
            loadMessageProcess = false;
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
        idDernierMsg = response;
        myMessages.addMessage({
            text: messageText,
            type: 'sent',
            avatar: "./img/avatar/"+user.thumbnail+".png",
            date: "à l'instant",
            name: user.name,
            id : idDernierMsg,
        }, 'append', true);
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
                "<div class='item-text'>"+  $(this)[0].lastMsg[0].user_login +" : "+  $(this)[0].lastMsg[0].message_texte +"</div>" +
                "</div>";
            $("#listViewChats").append("" +
                "<li class='" + fav + "' onClick=\"mainView.router.loadPage('chats.html?id="+$(this)[0].ID+"&title="+$(this)[0].post_title+"')\">" +
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



$(document).on('touchstart',"div.message-sent > div.message-text", function (event){
    if ($(event.target).hasClass('message-sent')) {
        var msgtodel = event.currentTarget;
    } else {
        var msgtodel = event.currentTarget.parentNode;
    }
    $(msgtodel).append("<img src='./img/loader.gif' width='120' id='loaderMsg' style='position : absolute; margin-left : -80px; margin-top : -74px;' />");
}).on('touchend',"div.message-sent", function(){
    $("#loaderMsg").remove();
});

$(document).on("taphold","div.message-sent > div.message-text",function (event){
        $("#loaderMsg").remove();
        if ($(event.target).hasClass('message-sent')) {
            var msgtodel = event.currentTarget;
        } else {
            var msgtodel = event.currentTarget.parentNode;
        }
        var idmsg = $(msgtodel).attr('tag');
        myApp.confirm('êtes-vous sûr?', 'Supprimer le message : '+ $(msgtodel).html(),
            function () {
                $.ajax({
                    url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/chats/' +idpost + '/messages/'+ idmsg,
                    type: 'DELETE',
                    dataType: 'json',
                    beforeSend: setHeader
                }) .done(function(){
                    $(msgtodel).fadeOut();
                });
            }
        );
});
