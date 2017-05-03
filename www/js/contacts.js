myApp.onPageInit('contacts', function (page) {
    initContactsPage();
});

function initContactsPage() {
    var div = document.getElementById("map_canvas");
    var lat=46.201022;
    var lang=6.137838;
    var myLatlng = new google.maps.LatLng(lat,lang);
    var mapOptions = {zoom: 15,center: myLatlng}
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var marker = new google.maps.Marker({position: myLatlng,map: map});
    var service = new google.maps.places.PlacesService(map);
}

function sendEmail() {
    if (device.platform == "iOS") {
        window.open("mailto:dallingea@gmail.com", "_blank");
    }else if(device.platform == "Android") {
        alert('a');
        cordova.plugins.email.isAvailable( function(isAvailable) {
            alert ('ok');
        })
            cordova.plugins.email.open();
    }
}

function appel(){
    if (device.platform == "iOS"){
        window.open("tel:+41223297052", "_blank");
    }else if(device.platform == "Android") {
        window.open("tel:+41223297052");
    }
}
