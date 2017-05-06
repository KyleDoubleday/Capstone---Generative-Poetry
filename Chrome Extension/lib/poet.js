var pronouncing = require('pronouncing');

function displayPoem() {
  alert(writePoem());
}

function getText() {
  var loc = document.location;
  var uri = {
    spec: loc.href,
    host: loc.host,
    prePath: loc.protocol + "//" + loc.host,
    scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
    pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
  };
  var docClone = document.cloneNode(true);
  var article = new Readability(uri, docClone).parse();
  var text = jQuery(article.content).text();
  return text;
}

function writePoem(){
	var text = getText();
	var textFilt = text.replace('\n',' ').replace('\r','').toLowerCase().replace('[a-z]\.','');     //filter non alpha-characters, make it all lowercase	
	var textList = textFilt.split(" ");
	var phones = new Array(), syllableCounts = new Array();
	var i = 0; 
		
	alert("Finding phones");														// Get phonetics for each word
	for(i = 0; i < textList.length; i++){
		if (pronouncing.phonesForWord(textList[i])){									 
			phones[i] = (pronouncing.phonesForWord(textList[i]))[0];
		}
		else{
			phones[i] = ('0');
		}
	}
	alert("Finding Sylls");
	for(i = 0; i < phones.length; i++){                                       //Get syllables for each phonetic
		if (phones[i] != '0'){
			syllableCounts[i] = (pronouncing.syllableCount(phones[i]));
		}
		else{
			syllableCounts[i] = (0);
		}
	}
	return phones; 
}
displayPoem();	

