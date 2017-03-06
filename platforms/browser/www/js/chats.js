myApp.onPageInit('listechats', function (page) {
    initListeChatsPage ();
});

function initListeChatsPage () {
    $.ajax({
        url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/jeux',
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader
    }).done(function(response) {
        $("#listViewChats").fadeIn();
        $("#loader").remove();
        $.each(response,function() {
            var fav;
            (!$(this)[0].favoris) ? fav = "" :
                fav = "fav";
            $("#listViewChats").append("" +
                "<li class='"+fav+"' >" +
                    "<a class='item-link item-content'>" +
                        "<div class='item-media'>" +
                            "<img src='"+$(this)[0].featured_image_thumbnail_url+"' width='80' max-height='70'/>" +
                        "</div>" +
                        "<div class='item-inner'>" +
                            "<div class='item-title-row'>" +
                                "<div class='item-title'>"+$(this)[0].post_title+"</div>" +
                                "<div class='item-after'><span class='badge theme-red'>5</span></div>" +
                            "</div>" +
                            "<div class='item-subtitle'>Dernier message - Jeudi 3 février</div>" +
                            "<div class='item-text'>bla bla bla bla bla bla bla</div>" +
                        "</div>" +
                    "</a>" +
                "</li>"
            );
        })
        showOrHideFavChats(true);
    })
};

function showOrHideFavChats(favoris) {
    if (favoris) {
        $("#favChats").addClass("active");
        $("#tousChats").removeClass("active");
        $("#listViewChats li:not('.fav')").each(function() {
            $(this).fadeOut();
        })
    }else {
        $("#favChats").removeClass("active");
        $("#tousChats").addClass("active");
        $("#listViewChats li").each(function() {
            $(this).fadeIn();
        })
    }
}