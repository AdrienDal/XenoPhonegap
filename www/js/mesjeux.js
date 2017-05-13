myApp.onPageInit('mesjeux', function (page) {
    initMesJeuxPage ();
});

myApp.onPageInit('jeuxDetails',function (page) {
    initJeuxDetailsPage(page.query.id,page.query.favdetail);
});

function initJeuxDetailsPage(id,favdetail) {
    $.get(apiHost + '/wp/v2/xenogame/'+id).then(function (response) {
        $('#nomJeu').html(response.title.rendered);
        $('#infoJeu').html("Joueur(s) : de "+response.player_min+ " à "+response.player_max);
        $('#imgJeu').prop('src',response.featured_image);
        $('#textJeu').append(response.content.rendered+"<li id='liJeu' tag='"+response.id+"' style='display : none;'></li>");
        //$('#checkFavoris').prop('checked',favdet);
    });
}

function initMesJeuxPage () {
    $.ajax({
        url: apiHost+'/xeno/users/jeux',
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader
    }).done(function(response) {
            var au_moins_1_fav = false;
            $.each(response,function() {
                var fav;
                var star = ""
                var addOrRemove ="<a href='#' onClick='addToFavorite($(this).parent().parent())' class='bg-green'>Ajouter aux favoris</a>";
                (!$(this)[0].favoris)  ? fav = "" :
                    (fav = "fav",
                        star ="<i class='f7-icons size-10'>star_fill</i>",
                        addOrRemove = "<a href='#' onClick='delFromFavorite($(this).parent().parent())' class='bg-red'>Supprimer des favoris</a>",
                        au_moins_1_fav = true);
                $("#listViewJeux").append("" +
                    "<li class='swipeout "+fav+"' tag='"+$(this)[0].ID+"'>" +
                        "<a onClick=\"mainView.router.loadPage('jeuxDetails.html?id="+$(this)[0].ID+"&favdetail="+$(this)[0].favoris+"');\" class='item-link swipeout-content item-content'>" +
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
        $("#loader").remove();
        $("#listViewJeux").fadeIn();
        if (au_moins_1_fav) {
            showOrHideFavJeux(true);
        }else {
            myApp.swipeoutOpen($("#listViewJeux li:first-child"), 'right',function(){myApp.alert("Ajoutez vos jeux favoris en swippant dessus !", "Aide")
            });
        }
    })
};

function addToFavorite(li) {
    $.ajax({
        url: apiHost+'/xeno/users/addfav',
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
        url: apiHost+'/xeno/users/favoris/' +li.attr('tag'),
        type: 'DELETE',
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

/*
function checkboxFavoris(li) {
    if ($("#checkFavoris").is(':checked')) {
        addToFavorite(li);
    }else {
        delFromFavorite(li);
    }
}*/
