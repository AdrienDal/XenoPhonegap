myApp.onPageInit('inscriptionslist', function (page) {
    initlisteInscriptionPage();
});


function initEvenementsPage (idevent) {
    $.ajax({
        url: 'http://adrien.dallinge.ch/cave/wp-json/xeno/users/listeinscritevent',
        type: 'POST',
        dataType: 'json',
        data:{event:idevent},
        beforeSend: setHeader
    }).done(function(response) {
            $("#listInscription").fadeIn();
            $("#loader").remove();
            $("#titreInscription").append(""+$(this)[0].post_title +" "+$(this)[0].length()+" Inscripts" );
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
   
   });