function displayPoem() {
  alert(writePoem("rhyme"));
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
	var textFilt = text.replace(/(\r\n|\n|\r)/gm," ").toLowerCase().replace(/[a-z]\./gm,"");     //filter non alpha-characters, make it all lowercase	
	var textList = textFilt.split(" ");
	var phones = new Array(), syllableCounts = new Array(), output = new Array();
		
	console.log("Finding phones");													// Get phonetics for each word
	console.log(textList.length);
	for(i = 0; i < textList.length; i++){
		if (i%100 ==0){console.log(i);}
		if (pronouncing.phonesForWord(textList[i])){		 
			phones[i] = (pronouncing.phonesForWord(textList[i]))[0];
		}
		else{
			phones[i] = ('0');
		}
	}
	for(i = 0; i < phones.length; i++){                                       //Get syllables for each phonetic
		if (phones[i] != '0'){
			syllableCounts[i] = (pronouncing.syllableCount(phones[i]));
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
				while(textList.indexOf((Array.from(rhymeCouple))[k]) == -1){
					k = k+1;
				}
				if(rhymePairs.indexOf((Array.from(rhymeCouple))[k]) == -1){  //If there is another word in the text that rhymes with it
					rhymePairs.push(textList[x-2] + ' ' + textList[x-1] + ' ' + textList[x]);                          //Write the pair to the rhymePairs list
					rhymePairs.push(textList[(textList.indexOf((Array.from(rhymeCouple))[k]))-2] + ' ' + textList[(textList.indexOf((Array.from(rhymeCouple))[k]))-1] + ' ' + textList[textList.indexOf((Array.from(rhymeCouple))[k])]);
				}
			}
		}
		console.log(rhymePairs);
		for(i = 0; i < 8; i++){        
			var lineSyllablesPair = Math.floor((Math.random() * 7) + 4);               //Make them a random syllable length (can change this later)***
			console.log("Linesyllables Pair = " + lineSyllablesPair);
			for(j = 0; j < 2; j++){                                     //For 16 lines:
				var lineSyllables = lineSyllablesPair;
				var index = Math.floor((Math.random() * textList.length) + 1);                       //Fill lines with random words
				while(lineSyllables > 0){  
					console.log(lineSyllables);				
					if((syllableCounts[index] != 0) && (syllableCounts[index] != "undefined")){  
						console.log("Syllable of word is " + syllableCounts[index])
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
					if (output.indexOf(textList[index]) == -1){// & textList[index] not in stop_word_set){  //If the word chosen is non-stop word, 
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
	return output.join(""); 
}
displayPoem();	