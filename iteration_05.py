#!C:\python36
'''
Created on Apr 24, 2017

@author: Kyle
'''

# This iteration should use whole phrases instead of randomly chosen words. Refining word selection.
# NLTK introduced

import pronouncing, random, sys, requests, re
from bs4 import BeautifulSoup
from readability.readability import Document
from nltk.corpus import stopwords

stop_word_list = stopwords.words('english')
stop_word_set = set(stop_word_list)

phones = []             #list to store phonetic representation of words in the text
textList = []           #list of individual words in the text
output = []             #list of words to be joined as an output string
rhymePairs = []         #list of pairs of rhyming words; element 0+n and 1+n rhyme for any int n
syllableCounts = []     #list of syllable counts for every word in textList

url = sys.argv[1]
r = requests.get(url)
#print(r.text)
text = BeautifulSoup(Document(r.content).summary(), "lxml").text    

text = text.replace('\n',' ').replace('\r','').lower()      #filter non alpha-characters, make it all lowercase\
re.sub('[a-z]\.','',text)
print(text)
textList = text.split()

for p in textList:
    if (pronouncing.phones_for_word(p)):
        phones.append(pronouncing.phones_for_word(p)[0])
    else:
        phones.append('0')

for x in range(0, len(phones)):                                       #Get syllables for each word
    if (phones[x] != '0'):
        syllableCounts.append(pronouncing.syllable_count(phones[x])) 
    else:
        syllableCounts.append(0)   

if(sys.argv[2] == "rhyme"):                                             # if we want a rhyming poem:      
    textSet = set(textList)

    while(len(rhymePairs) < 16):                                       #Until there are 16 words, 8 rhyming pairs:
        x = random.randrange(0, len(textList))                          #Pick a random word in the text
        rhymeSet = set(pronouncing.rhymes(textList[x]))
        rhymeCouple = (textSet & rhymeSet)
        i = 0;
        if(rhymeCouple != set()):
            while((list(rhymeCouple))[i] not in textList):
                i = i+1
            if(''.join(list(rhymeCouple)[i]) not in rhymePairs):  #If there is another word in the text that rhymes with it
                rhymePairs.append(textList[x-2] + ' ' + textList[x-1] + ' ' + textList[x])                          #Write the pair to the rhymePairs list
                rhymePairs.append(textList[(textList.index(''.join(list(rhymeCouple)[i]))-2)] + ' ' + textList[(textList.index(''.join(list(rhymeCouple)[i]))-1)] + ' ' + textList[textList.index(''.join(list(rhymeCouple)[i]))])

    for pair in range(0, 8):        
        lineSyllablesPair = random.randrange(4,7)               #Make them a random syllable length (can change this later)***
        for line in range(0, 2):                                     #For 16 lines:
            lineSyllables = lineSyllablesPair
            index = random.randrange(0,len(textList))                       #Fill lines with random words
            while(lineSyllables > 0):     
                if(syllableCounts[index] != 0):                 
                    output.append(' ' + textList[index])
                    lineSyllables = lineSyllables - syllableCounts[index]
                index = index + 1
            output.append(' ' + rhymePairs[(2*pair)+line])                           #End lines on rhyme pairs, make into stanzas
            output.append('\n')
        if((pair+1) % 2 == 0):
            output.append('\n') 
     
elif(sys.argv[2] == "haiku"):                                           #if we want a haiku:     
     
    for x in range(0, 3):                                               #For 3 lines with 5,7,5 syllables:
        if (x == 1):
            lineSyllables = 7
        else:
            lineSyllables = 5
        index = random.randrange(0, len(syllableCounts))            #Fill line with random words until syllables are full.
        while (lineSyllables > 0):
            if(syllableCounts[index] <= lineSyllables and syllableCounts[index] != 0):
                if (textList[index] not in output and textList[index] not in stop_word_set):  #If the word chosen is non-stop word, 
                    output.append(textList[index] + ' ')                                      # Use it to start a phrase
                    lineSyllables = lineSyllables - syllableCounts[index]
                elif(index % 3 == 0):                               # accept non-stop words 1/3 of the time
                        output.append(textList[index] + ' ')
                        lineSyllables = lineSyllables - syllableCounts[index]
                index = index + 1; 
            else:
                index = random.randrange(0, len(syllableCounts)) 
        output.append('\n')

elif(sys.argv[2] == "freeverse"):
    for line in range(1, random.randrange(0,20)):                                       #For random number of lines:
        lineLength = random.randrange(1,9)                              #Make them a random WORD length (can change this later)***
        wordCount = 0
        index = random.randrange(0,len(textList))                   #Fill lines with random words
        while(wordCount < lineLength):                                  
            #if (textList[index] not in output):                         #Trying to get unique words, NOT working***
            output.append(' ' + textList[index])
            wordCount = wordCount + 1
            index = index + 1
        output.append('\n')
        if((random.randrange(1,5)) % 4 == 0):
            output.append('\n') 
else:
    print("Please choose appropriate poetic form")
    
with open("output.txt", mode="a") as outputFile:                        #Write to an output file
    outputFile.write('\n//\n' + ''.join(output))
