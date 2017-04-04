#!C:\python36
'''
Created on Feb 18, 2017

@author: Kyle Doubleday
'''
import pronouncing, random, sys

phones = []
haikuString = []
workingText = []
myListofSyllableCounts = []

with open(sys.argv[1], mode="r") as inputFile:
    text = inputFile.read() 
    
text = text.replace('\n',' ').replace('\r','').lower()

for p in text.split():
    if (pronouncing.phones_for_word(p)):
        phones.append(pronouncing.phones_for_word(p)[0])
    else:
        phones.append('0')

for x in range(0, len(phones)):
    if (phones[x] != '0'):
        myListofSyllableCounts.append(pronouncing.syllable_count(phones[x])) 
    else:
        myListofSyllableCounts.append(0)

for x in range(0, 3):
    if (x == 1):
        lineSyllables = 7
    else:
        lineSyllables = 5
    while (lineSyllables > 0):
        index = random.randrange(0, len(myListofSyllableCounts))
        if(myListofSyllableCounts[index] <= lineSyllables and myListofSyllableCounts[index] != 0):
            haikuString.append(text.split()[index] + ' ')
            lineSyllables = lineSyllables - myListofSyllableCounts[index] 
    haikuString.append('\n')
    
with open("output.txt", mode="a") as outputFile:
    outputFile.write('\n' + ''.join(haikuString))
        
        
        
        