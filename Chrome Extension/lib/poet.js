function displayPoem() {
  alert(chrome.storage.sync.get('poemType', function(items) {console.log(items.poemType); return(items.poemType);}));
  alert(writePoem(chrome.storage.sync.get('poemType', function(items) {console.log(items.poemType); return(items.poemType);})));
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

function writePoem(type){
	var text = getText();
	var textFilt = text.replace(/(\r\n|\n|\r)/gm,' ').replace(/[^0-9a-z]\s/gi, ' ').toLowerCase();     //filter non alpha-characters, make it all lowercase	
	var textList = textFilt.split(" ");
	var phones = new Array(), syllableCounts = new Array(), output = new Array();

	var len = textList.length;

	if(len >= 1500){
		return("Please select a shorter text for the web-version or use the Python version instead.")
	}
	
	for(i = 0; i < len; i++){                                       //Get syllables for each phonetic
		if (pronouncing.phonesForWord(textList[i])){
			if (i%100 ==0){console.log(i);}
			syllableCounts[i] = (pronouncing.syllableCount(pronouncing.phonesForWord(textList[i])[0]));
		}
		else{
			syllableCounts[i] = (0);
		}
	}
	
	if(type == "rhyme"){
		var textSet = new Set(textList);
		var rhymePairs = new Array();

		while(rhymePairs.length < 16){                                       //Until there are 16 words, 8 rhyming pairs:
			
			var x = Math.floor((Math.random() * syllableCounts.length) + 1);                        //Pick a random word in the text
			rhymeSet = new Set(pronouncing.rhymes(textList[x]));
			var rhymeCouple = new Set( [...textSet].filter(y => rhymeSet.has(y)));
			
			var k = 0;
			if(Array.from(rhymeCouple).length != 0){
				while(textList.indexOf == -1){
					k = k+1;
				}
				if(rhymePairs.indexOf(textList[(textList.indexOf((Array.from(rhymeCouple))[k]))-2] + ' ' + textList[(textList.indexOf((Array.from(rhymeCouple))[k]))-1] + ' ' + textList[textList.indexOf((Array.from(rhymeCouple))[k])]) == -1){  //If there is another word in the text that rhymes with it
					rhymePairs.push(textList[x-2] + ' ' + textList[x-1] + ' ' + textList[x]);                          //Write the pair to the rhymePairs list
					rhymePairs.push(textList[(textList.indexOf((Array.from(rhymeCouple))[k]))-2] + ' ' + textList[(textList.indexOf((Array.from(rhymeCouple))[k]))-1] + ' ' + textList[textList.indexOf((Array.from(rhymeCouple))[k])]);
				}
			}
		}
		for(i = 0; i < 8; i++){        
			var lineSyllablesPair = Math.floor((Math.random() * 7) + 4);               //Make them a random syllable length (can change this later)***
			for(j = 0; j < 2; j++){                                     //For 16 lines:
				var lineSyllables = lineSyllablesPair;
				var index = Math.floor((Math.random() * textList.length) + 1);                       //Fill lines with random words
				while(lineSyllables > 0){  					
					if((syllableCounts[index] != 0) && (typeof syllableCounts[index] != "undefined")){  
						output.push(' ' + textList[index]);
						lineSyllables = lineSyllables - syllableCounts[index];
					}
					index = index + 1;
				}
				output.push(' ' + rhymePairs[(2*i)+j]);                           //End lines on rhyme pairs, make into stanzas
				output.push('\n');
			}
			if((i+1) % 2 == 0){
				output.push('\n');
			}
		}
	}
	else if(type == "haiku"){
		var lineSyllables;
		for(i = 0; i < 3; i++){                                             //For 3 lines with 5,7,5 syllables:
			if (i == 1){
				lineSyllables = 7;
			}
			else{
				lineSyllables = 5;
			}
			var index = Math.floor((Math.random() * syllableCounts.length) + 1);            //Fill line with random words until syllables are full.
			while (lineSyllables > 0){
				if(syllableCounts[index] <= lineSyllables && syllableCounts[index] != 0){
					if (output.indexOf(textList[index]) == -1 && textList[index].isStopWord == false){  //If the word chosen is non-stop word, 
						output.push(textList[index] + ' ');                                      // Use it to start a phrase
						lineSyllables = lineSyllables - syllableCounts[index];
					}
					else if(index % 3 == 0){                               // accept non-stop words 1/3 of the time
						output.push(textList[index] + ' ');
						lineSyllables = lineSyllables - syllableCounts[index];
					}
					index = index + 1; 
				}
				else{
					index = index = Math.floor((Math.random() * syllableCounts.length) + 1); 
				}
			}
			output.push('\n');
		}
	}
	else if(type == "freeverse"){
		for (i = 2; i < Math.floor((Math.random() * 20) + 1); i++){                                       //For random number of lines:
			var lineLength = Math.floor((Math.random() * 9) + 1);                              //Make them a random WORD length (can change this later)***
			var wordCount = 0;
			var index = Math.floor((Math.random() * syllableCounts.length) + 1);                   //Fill lines with random words
			while(wordCount < lineLength){
				output.push(textList[index] + ' ');
				wordCount = wordCount + 1;
				index = index + 1;
			}
			output.push('\n');
			if(Math.floor((Math.random() * 5) + 1) % 4 == 0){
				output.push('\n');
			}
		}
	}
	else{output.push("Please select valid poem type in options menu");}
	return output.join(""); 
}
displayPoem();	