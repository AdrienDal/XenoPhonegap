myApp.onPageInit('mesjeux', function (page) {
    initMesJeuxPage ();
});

function initMesJeuxPage () {
    $.ajax({
        url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/jeux',
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader
    }).done(function(response) {
            $("#listViewJeux").fadeIn();
            $("#loader").remove();
            $.each(response,function() {
                var fav;
                var star = ""
                var addOrRemove ="<a href='#' onClick='addToFavorite($(this).parent().parent())' class='bg-green'>Ajouter aux favoris</a>";
                (!$(this)[0].favoris)  ? fav = "" :
                    (fav = "fav",
                        star ="<i class='f7-icons size-10'>star_fill</i>",
                        addOrRemove = "<a href='#' onClick='delFromFavorite($(this).parent().parent())' class='bg-red'>Supprimer des favoris</a>");
                $("#listViewJeux").append("" +
                    "<li class='swipeout "+fav+"' tag='"+$(this)[0].ID+"'>" +
                        "<a class='item-link swipeout-content item-content'>" +
                            "<div class='item-media'>" +
                                "<img src='"+$(this)[0].featured_image_thumbnail_url+"' width='80' max-height='70'/>" +
                            "</div>" +
                            "<div class='item-inner'>" +
                                "<div class='item-title-row'>" +
                                    "<div class='item-title'>"+$(this)[0].post_title+"</div>" +
                                    "<div class='item-after'>"+star+"</div>" +
                                "</div>" +
                            "</div>" +
                            "<div class='item-subtitle'></div>" +
                            "<div class='item-text'></div>" +
                        "</a>" +
                        "<div class='swipeout-actions-right'>"+
                            addOrRemove +
                        "</div>" +
                    "</li>");
            })
        showOrHideFavJeux(true)
        })
};

function addToFavorite(li) {
    $.ajax({
        url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/addfav',
        type: 'POST',
        data : {jeuId : li.attr('tag')},
        beforeSend: setHeader
    });
    li.addClass("fav");
    li.find('.item-title-row').append("<i class='f7-icons size-10'>star_fill</i>");
    var swipeAction = li.find('.swipeout-actions-right a');
    swipeAction.attr('onClick', 'delFromFavorite($(this).parent().parent())');
    swipeAction.text('Supprimer des favoris');
    swipeAction.removeClass('bg-green');
    swipeAction.addClass('bg-red');
}

function delFromFavorite(li) {
    $.ajax({
        url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/remfav',
        type: 'POST',
        data : {jeuId : li.attr('tag')},
        beforeSend: setHeader
    });
    li.removeClass("fav");
    li.find('.item-title-row').find('i').remove();
    if ($(".favBtn").first().hasClass("active"))
        li.fadeOut();
    var swipeAction = li.find('.swipeout-actions-right a');
    swipeAction.attr('onClick', 'addToFavorite($(this).parent().parent())');
    swipeAction.text('Ajouter aux favoris');
    swipeAction.removeClass('bg-red');
    swipeAction.addClass('bg-green');
}

function showOrHideFavJeux(favoris,btn) {
    if (favoris) {
        $("#favJeux").addClass("active");
        $("#tousJeux").removeClass("active");
        $("#listViewJeux li:not('.fav')").each(function() {
            $(this).fadeOut();
        })
    }else {
        $("#favJeux").removeClass("active");
        $("#tousJeux").addClass("active");
        $("#listViewJeux li").each(function() {
            $(this).fadeIn();
        })
    }
}