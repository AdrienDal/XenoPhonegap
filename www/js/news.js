myApp.onPageInit('news', function (page) {
    initNewsPage ();
});
myApp.onPageInit('newsDetails',function (page) {
	initNewsDetailsPage(page.query.id);
});

function initNewsDetailsPage(id) {
		var apiHost = 'http://adrien.dallinge.ch/cave/wp-json';
        $.get(apiHost + '/wp/v2/posts/'+id).then(function (response) {
			$('#nomNews').html(response.title.rendered);
			$('#dateNews').html(response.date);
            $('#textNews').append(response.content.rendered);
        });
}

function pad(n){return n<10 ? '0'+n : n}

function convertDate(date) {
    var months = Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Decembre");
    var jours=Array(" ","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche");
    return jours[date.getDay()]+" "+date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear();
}

function initNewsPage () {
    $.ajax({
        url: 'http://adrien.dallinge.ch/cave/wp-json/wp/v2/posts?',
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader
    }).done(function(response) {
            $("#listViewNews").fadeIn();
            $("#loader").remove();
            $.each(response,function() {
            	var subtitle=$(this)[0].excerpt.rendered;
            	var subtitleGood=subtitle.slice(0,70);
                $("#listViewNews").append("" +
                           "<div onClick=\"mainView.router.loadPage('newsDetails.html?id="+$(this)[0].id+"');\" class='item-link card demo-card-header-pic'>" +
                         				   "<div style='background-image:url();background-color : green;' valign='bottom' class='card-header color-white no-border'>"+$(this)[0].title.rendered+"</div>"+
 										 "<div class='card-content'>"+
   										 "<div class='card-content-inner'>"+
      											"<p class='color-gray'>"+$(this)[0].date+"</p>"+
      											"<p>"+subtitleGood+"...</p>"+
 									   "</div>" +
									   "</div>" +
					"</div>" 
                    );
            })
        })
        
}
