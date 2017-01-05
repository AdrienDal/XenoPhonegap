myApp.onPageInit('evenements', function (page) {
    initEvenementsPage ();
});

myApp.onPageInit('evenementsDetails',function (page) {
	initEvenementsDetailsPage(page.query.id);
});

function initEvenementsDetailsPage(id) {
		var apiHost = 'http://adrien.dallinge.ch/cave/wp-json';
    $.get(apiHost + '/wp/v2/tribe_events/'+id)
        .then(function (response) {
        	var date=new Date(response.startDate);
			$('#nomEvent').html(response.title.rendered);
			$('#dateEvent').html(convertDate(date)+" "+date.getHours()+":"+pad(date.getMinutes()));
        $('#imgEvent').prop('src',response.featured_image);
        $('#textEvent').append(response.content.rendered);
        });
}

function pad(n){return n<10 ? '0'+n : n}

function convertDate(date) {
 var months = Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Decembre");
var jours=Array(" ","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche");
return jours[date.getDay()]+" "+date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear();
}

function initEvenementsPage () {
    var apiHost = 'http://adrien.dallinge.ch/cave/wp-json';
    $.get(apiHost + '/wp/v2/tribe_events?per_page=1000')
        .then(function (response) {
            $("#listViewEvents").fadeIn();
            $("#loader").remove();
            $.each(response,function() {
                var fav;
                var star = "";
                 var date=new Date($(this)[0].startDate);
                Math.random() > 0.5 ? fav = "" :
                    (fav = "fav",
                        star ="<i class='f7-icons size-10'>star_fill</i>");
                $("#listViewEvents").append("" +
                    "<li class='"+fav+"' onClick=\"mainView.router.loadPage('evenementsDetails.html?id="+$(this)[0].id+"');\" >" +
                        "<a class='item-link item-content'>" +
                            "<div class='item-media'>" +
                                "<img src='"+$(this)[0].featured_image_thumbnail_url+"' width='80' max-height='70'/>" +
                            "</div>" +
                            "<div class='item-inner'>" +
                                "<div class='item-title-row'>" +
                                    "<div class='item-title'>"+$(this)[0].title.rendered+"</div>" +
                                    "<div class='item-after'>"+star+"</div>" +
                                "</div>" +
                               
                            "<div class='item-subtitle'>"+convertDate(date)+"</div>" +
                            "<div class='item-text'>"+date.getHours()+":"+pad(date.getMinutes())+"</div>" +
                            "</div>" +
                        "</a>" +
                         "</li>"
                        
                    );
            })
           showOrHideFavEv(true);
        })
};




function showOrHideFavEv(favoris) {
    if (favoris) {
        $(".favBtn").first().addClass("active");
        $(".favBtn").last().removeClass("active");
        $("#listViewEvents li:not('.fav')").each(function() {
            $(this).fadeOut();
        })
    }else {
        $(".favBtn").first().removeClass("active");
        $(".favBtn").last().addClass("active");
        $("#listViewEvents li").each(function() {
            $(this).fadeIn();
        })
    }
}