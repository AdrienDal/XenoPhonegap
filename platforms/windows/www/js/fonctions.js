function pad(n){return n<10 ? '0'+n : n}

function convertDate(date) {
    var months = Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Decembre");
    var jours=Array(" ","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche");
    return jours[date.getDay()]+" "+date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear();
}

