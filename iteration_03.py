
#!C:\python36
'''
Created on Mar 25, 2017

@author: Kyle Doubleday
'''

import pronouncing, random, sys, requests
from bs4 import BeautifulSoup
from readability.readability import Document

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
#print(text)
textList = text.split()

if(sys.argv[2] == "rhyme"):                                             # if we want a rhyming poem:      
    textSet = set(textList)

    while(len(rhymePairs) < 16):                                        #Until there are 16 words, 8 rhyming pairs:
        x = random.randrange(0, len(textList))                          #Pick a random word in the text
        rhymeSet = set(pronouncing.rhymes(textList[x]))
        rhymeCouple = (textSet & rhymeSet)
        if(rhymeCouple):                                                #If there is another word in the text that rhymes with it
            if(''.join(list(rhymeCouple)[0]) not in rhymePairs):
                rhymePairs.append(textList[x])                          #Write the pair to the rhymePairs list
                rhymePairs.append(''.join(list(rhymeCouple)[0]))

    for line in range(0, 16):                                           #For 16 lines:
        lineLength = random.randrange(6,9)                              #Make them a random WORD length (can change this later)***
        wordCount = 0
        while(wordCount < lineLength):                                  
            index = random.randrange(0,len(textList))                   #Fill lines with random words
            if (textList[index] not in output):                         #Trying to get unique words, NOT working***
                output.append(' ' + textList[index])
                wordCount = wordCount + 1
        output.append(' ' + rhymePairs[line])                           #End lines on rhyme pairs, make into stanzas
        output.append('\n')
        if((line+1) % 4 == 0):
            output.append('\n') 
     
elif(sys.argv[2] == "haiku"):                                           #if we want a haiku:     
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
     
    for x in range(0, 3):                                               #For 3 lines with 5,7,5 syllables:
        if (x == 1):
            lineSyllables = 7
        else:
            lineSyllables = 5
        while (lineSyllables > 0):
            index = random.randrange(0, len(syllableCounts))            #Fill line with random words until syllables are full.
            if(syllableCounts[index] <= lineSyllables and syllableCounts[index] != 0):
                output.append(textList[index] + ' ')
                lineSyllables = lineSyllables - syllableCounts[index] 
        output.append('\n')

elif(sys.argv[2] == "freeverse"):
    for line in range(1, random.randrange(0,20)):                                       #For random number of lines:
        lineLength = random.randrange(1,9)                              #Make them a random WORD length (can change this later)***
        wordCount = 0
        while(wordCount < lineLength):                                  
            index = random.randrange(0,len(textList))                   #Fill lines with random words
            if (textList[index] not in output):                         #Trying to get unique words, NOT working***
                output.append(' ' + textList[index])
                wordCount = wordCount + 1
        output.append('\n')
        if((random.randrange(1,5)) % 4 == 0):
            output.append('\n') 
else:
    print("Please choose appropriate poetic form")
    
with open("output.txt", mode="a") as outputFile:                        #Write to an output file
    outputFile.write('\n' + ''.join(output))