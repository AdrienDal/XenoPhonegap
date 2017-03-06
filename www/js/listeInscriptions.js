myApp.onPageInit('listeInscriptions', function (page) {
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
    	var nb=0;
    	if (typeof $(this)[1]!=="undefined"){
    	nb=$(this).length}else {
    	nb=0;}
            $("#titreInscription").append("Liste des participants   - <span class='badge'>"+nb+"</span> inscrits");
            $.each(response,function() {
             $("#listInscription").append("" +
             			"<li>" +
      "<div class='item-content'>"+
        "<div class='item-inner'>"+
          "<div class='item-title-row'>"+
            "<div class='item-title'>"+$(this)[0].displayname+"</div>"+
        "</div>"+
      "</div>"+
   "</li>"
 );
   });
});

}