function pad(n){return n<10 ? '0'+n : n}

function convertDate(date) {
    var months = Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Decembre");
    var jours=Array(" ","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche");
    return jours[date.getDay()]+" "+date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear();
}
//Clic sur le bouton d'envoi de la page contact 
function envoyMail() {
    //initialisation
    var email=document.getElementById('email-contact').value;
    var sujet=document.getElementById('sujet-contact').value;
    var message=document.getElementById('message-contact').value;
    
    //test si le mail a le bon format
    if(bonMail(email)){
        document.getElementById('email-contact').style.backgroundColor = "green";
        if(sujet!=""){
            document.getElementById('sujet-contact').style.backgroundColor = "green";
            if(message!=""){
                document.getElementById('message-contact').style.backgroundColor = "green";
                //Tableau json avec le mail, sujet, et le message à envoyer a l'adresse 
                var tabMail = {};
                tabMail.email = email;
                tabMail.sujet = sujet;
                tabMail.message=message;
                var chaineMailJSON = JSON.stringify(tabMail);   
                myApp.alert('Message envoyé', '', function () {
                    mainView.router.loadPage('contacts.html');
                });
                
            }else{
            //message vide
            myApp.alert('votre message est invalide', 'message');    
            document.getElementById('message-contact').style.backgroundColor = "red";
            }
        }else{
        //sujet vide 
        myApp.alert('votre sujet est invalide', 'sujet');
        document.getElementById('sujet-contact').style.backgroundColor = "red";
        }
    }else{
    //email invalide
    myApp.alert('votre email est invalide', 'Email');
    document.getElementById('email-contact').style.backgroundColor = "red";
    }
    

}

//test si le mail a le bon format
function bonMail(mailteste){
	var reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i');

	if(reg.test(mailteste))
	{
		return(true);
	}
	else
	{
		return(false);
	}
}