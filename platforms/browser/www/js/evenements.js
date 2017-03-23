myApp.onPageInit('evenements', function (page) {
    initEvenementsPage();
});

myApp.onPageInit('evenementsDetails',function (page) {
	initEvenementsDetailsPage(page.query.id,page.query.inscrit);
});

myApp.onPageInit('evenementsInscriptions', function (page) {
    initlisteInscriptionPage(page.query.id);
});

function initlisteInscriptionPage (id) {
    $.ajax({
        url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/listeinscritevent',
        type: 'POST',
        dataType: 'json',
        data:{"event":id},
        beforeSend: setHeader
    }).done(function(response) {
        $("#loader").remove();
        var nb=  response.length;
        $("#titreInscription").append("Liste des participants   - <span class='badge'>"+nb+"</span> inscrits");
        if (nb > 0 ) {
            $.each(response, function (key,value) {
                $("#listInscription").append("" +
                    "<li>" +
                    "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                    "<div class='item-title-row'>" +
                    "<div class='item-title'>" + value.display_name + "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</li>"
                );
            });
        }
    });
}

function initEvenementsDetailsPage(id,inscrit) {
		var apiHost = 'http://adrien.dallinge.ch/cave/wp-json';
        $.get(apiHost + '/wp/v2/tribe_events/'+id).then(function (response) {
        	var date=new Date(response.startDate);
			$('#nomEvent').html(response.title.rendered);
			$('#dateEvent').html(convertDate(date)+" "+date.getHours()+":"+pad(date.getMinutes()));
            $('#imgEvent').prop('src',response.featured_image);
            $('#textEvent').append(response.content.rendered);
            $("#linkViewList").attr("onClick","mainView.router.loadPage('evenementsInscriptions.html?id="+id+"')");
            $("#linkViewList").attr('tag', id);
        });

        $.ajax({
            url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/listeinscritevent',
            type: 'POST',
            dataType: 'json',
            data:{"event":id},
            beforeSend: setHeader
        }).done(function(response) {
            var nb=  response.length;
            if (nb==0){
                $('#resNbr').html("Il n'y a pas d'inscrits");
                $('#resNbr').attr('class','chColor')}
            else if (nb==1) {
                $('#resNbr').html("1 personne est inscrite");
                $('#resNbr').attr('class','chColor')}
            else {
                $('#resNbr').html(nb+" personnes sont inscrites");
                $('#resNbr').attr('class','chColor')}
        });

        if (inscrit == "true") {
            var btnInscription = $("#btnInscription");
            btnInscription.addClass("button-fill");
            btnInscription.html("Inscrit");
        }
}

function initEvenementsPage () {
    $.ajax({
        url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/events',
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader
    }).done(function(response) {
            $.each(response,function() {
                var fav;
                var star = "";
                var date=new Date(+$(this)[0].startDate);
                (!$(this)[0].favoris) ? fav = "" :
                    (fav = "fav",
                        star ="<i class='f7-icons size-10'>star_fill</i>");

                var classInscrit = "";
                (!$(this)[0].inscrit) ? classInscrit = "" :
                    (fav = "fav",classInscrit = "inscrit");

                $("#listViewEvents").append("" +
                    "<li class='"+fav+" "+classInscrit+"' onClick=\"mainView.router.loadPage('evenementsDetails.html?id="+$(this)[0].ID+"&inscrit="+$(this)[0].inscrit+"');\" >" +
                        "<a class='item-link item-content'>" +
                            "<div class='item-media'>" +
                                "<img src='"+$(this)[0].featured_image_thumbnail_url+"' width='80' max-height='70'/>" +
                            "</div>" +
                            "<div class='item-inner'>" +
                                "<div class='item-title-row'>" +
                                    "<div class='item-title'>"+$(this)[0].post_title+"</div>" +
                                    "<div class='item-after'>"+star+"</div>" +
                                "</div>" +
                            "<div class='item-subtitle'>"+convertDate(date)+"</div>" +
                            "<div class='item-text'>"+date.getHours()+":"+pad(date.getMinutes())+"</div>" +
                            "</div>" +
                        "</a>" +
                         "</li>"
                    );
            })
            $("#loader").remove();
            $("#listViewEvents").fadeIn();
            showOrHideFavEv(true);
        })
};

function showOrHideFavEv(favoris) {
    if (favoris) {
        $("#favEvents").addClass("active");
        $("#tousEvents").removeClass("active");
        $("#listViewEvents li:not('.fav')").each(function() {
            $(this).fadeOut();
        })
    }else {
        $("#favEvents").removeClass("active");
        $("#tousEvents").addClass("active");
        $("#listViewEvents li").each(function() {
            $(this).fadeIn();
        })
    }
}

function inscription(){
    var btnInscription =  $("#btnInscription");
    btnInscription.toggleClass("button-fill");
    var idEvent = $("#linkViewList").attr('tag');
    if (btnInscription.hasClass("button-fill")){
        $.ajax({
            url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/inscription',
            type: 'POST',
            dataType: 'json',
            data:{"event": idEvent},
            beforeSend: setHeader
        }) .done(function(){
            mainView.router.refreshPreviousPage();
        });
        btnInscription.html("Inscrit");
    }else{
        $.ajax({
            url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/desinscription',
            type: 'POST',
            dataType: 'json',
            data: {"event": idEvent},
            beforeSend: setHeader
        }) .done(function(){
            mainView.router.refreshPreviousPage();
        });
        btnInscription.html("S'inscrire");
    }
}