myApp.onPageInit('news', function (page) {
    initNewsPage ();
});
myApp.onPageInit('newsDetails',function (page) {
	initNewsDetailsPage(page.query.id);
});

function initNewsDetailsPage(id) {
        $.get(apiHost + '/wp/v2/posts/'+id).then(function (response) {
			$('#nomNews').html(response.title.rendered);
			$('#dateNews').html(convertDate(new Date(response.date)));
            $('#textNews').append(response.content.rendered);
        });
}


function initNewsPage () {
    $.ajax({
        url: apiHost+'/xeno/users/news?',
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader
    }).done(function(response) {
            $.each(response,function() {
                var date=new Date($(this)[0].customDate);
                var subtitle=$(this)[0].post_content;
            	var subtitleGood=subtitle.slice(0,70);
                $("#listViewNews").prepend("" +
                    "<div onClick=\"mainView.router.loadPage('newsDetails.html?id="+$(this)[0].ID+"');\" class='item-link card demo-card-header-pic'>" +
                        "<div style='background-image:url("+$(this)[0].featured_image_thumbnail_url+");  valign='bottom' class='card-header color-white no-border'></div>"+
                             "<div class='card-content'>"+
                             "<div class='card-content-inner'>"+
                                    "<p class='color-gray'>"+convertDate(date)+"</p>"+
                                    "<p>"+$(this)[0].post_title+"</p>"+
                             "</div>" +
                        "</div>" +
					"</div>" 
                    );
            })
            $("#loader").remove();
            $("#listViewNews").fadeIn();
        })
        
}
