function displayPoem() {
  chrome.storage.sync.get('poemType', function(items) {
	  var poem = writePoem(items.poemType)
	  alert(poem);
	  prompt("Copy to clipboard: Ctrl+C, Enter", poem);
	  });
}

function isStopWord(word) {
	var regex = new RegExp("\\b"+word+"\\b","i");
	if(stopWords.search(regex) < 0)
	{
		return false;
	}else
	{
		return true;	
	}
}

var stopWords = "a,able,about,above,abst,accordance,according,accordingly,across,act,actually,added,adj,\
affected,affecting,affects,after,afterwards,again,against,ah,all,almost,alone,along,already,also,although,\
always,am,among,amongst,an,and,announce,another,any,anybody,anyhow,anymore,anyone,anything,anyway,anyways,\
anywhere,apparently,approximately,are,aren,arent,arise,around,as,aside,ask,asking,at,auth,available,away,awfully,\
b,back,be,became,because,become,becomes,becoming,been,before,beforehand,begin,beginning,beginnings,begins,behind,\
being,believe,below,beside,besides,between,beyond,biol,both,brief,briefly,but,by,c,ca,came,can,cannot,can't,cause,causes,\
certain,certainly,co,com,come,comes,contain,containing,contains,could,couldnt,d,date,did,didn't,different,do,does,doesn't,\
doing,done,don't,down,downwards,due,during,e,each,ed,edu,effect,eg,eight,eighty,either,else,elsewhere,end,ending,enough,\
especially,et,et-al,etc,even,ever,every,everybody,everyone,everything,everywhere,ex,except,f,far,few,ff,fifth,first,five,fix,\
followed,following,follows,for,former,formerly,forth,found,four,from,further,furthermore,g,gave,get,gets,getting,give,given,gives,\
giving,go,goes,gone,got,gotten,h,had,happens,hardly,has,hasn't,have,haven't,having,he,hed,hence,her,here,hereafter,hereby,herein,\
heres,hereupon,hers,herself,hes,hi,hid,him,himself,his,hither,home,how,howbeit,however,hundred,i,id,ie,if,i'll,im,immediate,\
immediately,importance,important,in,inc,indeed,index,information,instead,into,invention,inward,is,isn't,it,itd,it'll,its,itself,\
i've,j,just,k,keep,keeps,kept,kg,km,know,known,knows,l,largely,last,lately,later,latter,latterly,least,less,lest,let,lets,like,\
liked,likely,line,little,'ll,look,looking,looks,ltd,m,made,mainly,make,makes,many,may,maybe,me,mean,means,meantime,meanwhile,\
merely,mg,might,million,miss,ml,more,moreover,most,mostly,mr,mrs,much,mug,must,my,myself,n,na,name,namely,nay,nd,near,nearly,\
necessarily,necessary,need,needs,neither,never,nevertheless,new,next,nine,ninety,no,nobody,non,none,nonetheless,noone,nor,\
normally,nos,not,noted,nothing,now,nowhere,o,obtain,obtained,obviously,of,off,often,oh,ok,okay,old,omitted,on,once,one,ones,\
only,onto,or,ord,other,others,otherwise,ought,our,ours,ourselves,out,outside,over,overall,owing,own,p,page,pages,part,\
particular,particularly,past,per,perhaps,placed,please,plus,poorly,possible,possibly,potentially,pp,predominantly,present,\
previously,primarily,probably,promptly,proud,provides,put,q,que,quickly,quite,qv,r,ran,rather,rd,re,readily,really,recent,\
recently,ref,refs,regarding,regardless,regards,related,relatively,research,respectively,resulted,resulting,results,right,run,s,\
said,same,saw,say,saying,says,sec,section,see,seeing,seem,seemed,seeming,seems,seen,self,selves,sent,seven,several,shall,she,shed,\
she'll,shes,should,shouldn't,show,showed,shown,showns,shows,significant,significantly,similar,similarly,since,six,slightly,so,\
some,somebody,somehow,someone,somethan,something,sometime,sometimes,somewhat,somewhere,soon,sorry,specifically,specified,specify,\
specifying,still,stop,strongly,sub,substantially,successfully,such,sufficiently,suggest,sup,sure,t,take,taken,taking,tell,tends,\
th,than,thank,thanks,thanx,that,that'll,thats,that've,the,their,theirs,them,themselves,then,thence,there,thereafter,thereby,\
thered,therefore,therein,there'll,thereof,therere,theres,thereto,thereupon,there've,these,they,theyd,they'll,theyre,they've,\
think,this,those,thou,though,thoughh,thousand,throug,through,throughout,thru,thus,til,tip,to,together,too,took,toward,towards,\
tried,tries,truly,try,trying,ts,twice,two,u,un,under,unfortunately,unless,unlike,unlikely,until,unto,up,upon,ups,us,use,used,\
useful,usefully,usefulness,uses,using,usually,v,value,various,'ve,very,via,viz,vol,vols,vs,w,want,wants,was,wasn't,way,we,wed,\
welcome,we'll,went,were,weren't,we've,what,whatever,what'll,whats,when,whence,whenever,where,whereafter,whereas,whereby,wherein,\
wheres,whereupon,wherever,whether,which,while,whim,whither,who,whod,whoever,whole,who'll,whom,whomever,whos,whose,why,widely,\
willing,wish,with,within,without,won't,words,world,would,wouldn't,www,x,y,yes,yet,you,youd,you'll,your,youre,yours,yourself,\
yourselves,you've,z,zero";

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

	if(type == "rhyme"){
		var textSet = new Set(textList);
		var rhymePairs = new Array();

		while(rhymePairs.length < 16){                                       //Until there are 16 words, 8 rhyming pairs:
			
			var x = Math.floor((Math.random() * textList.length) + 1);                        //Pick a random word in the text
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
					if(((pronouncing.syllableCount(pronouncing.phonesForWord(textList[index])[0])) != 0) && (typeof (pronouncing.syllableCount(pronouncing.phonesForWord(textList[index])[0])) != "undefined")){  
						output.push(' ' + textList[index]);
						lineSyllables = lineSyllables - (pronouncing.syllableCount(pronouncing.phonesForWord(textList[index])[0]));
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
			var index = Math.floor((Math.random() * textList.length) + 1);            //Fill line with random words until syllables are full.
			while (lineSyllables > 0){
				if((pronouncing.syllableCount(pronouncing.phonesForWord(textList[index])[0])) <= lineSyllables && (pronouncing.syllableCount(pronouncing.phonesForWord(textList[index])[0])) != 0){
					if (output.indexOf(textList[index] + ' ') == -1 && isStopWord(textList[index]) == false){  //If the word chosen is non-stop word, 
						output.push(textList[index] + ' ');                                      // Use it to start a phrase
						lineSyllables = lineSyllables - (pronouncing.syllableCount(pronouncing.phonesForWord(textList[index])[0]));
					}
					else if(index % 3 == 0){                               // accept non-stop words 1/5 of the time
						output.push(textList[index] + ' ');
						lineSyllables = lineSyllables - (pronouncing.syllableCount(pronouncing.phonesForWord(textList[index])[0]));
					}
					index = index + 1; 
				}
				else{
					index = index = Math.floor((Math.random() * textList.length) + 1); 
				}
			}
			output.push('\n');
		}
	}
	else if(type == "freeverse"){
		for (i = 2; i < Math.floor((Math.random() * 20) + 1); i++){                                       //For random number of lines:
			var lineLength = Math.floor((Math.random() * 9) + 1);                              //Make them a random WORD length (can change this later)***
			var wordCount = 0;
			var index = Math.floor((Math.random() * textList.length) + 1);                   //Fill lines with random words
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