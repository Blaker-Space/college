/*Blake Mills
 *COSC 3355.001
 *Submission Date: 1/29/2025
*/

//stdio.h is used in this program for printf to output to the console and fgets for user input into the character buffer
#include <stdio.h>

//string.h is used to get the length of user's string input as the condition for the for loop
#include <string.h>

//stdbool.h is used for creating a boolean to track if we are currently processing a word or not
#include <stdbool.h>

int main(){

	//declare a character buffer with max 1024 characters to hold user input (1025 to account for new line)
	char characterBuffer[1025];
	
	//declare wordCount to hold the number of words in the user's input
	int wordCount = 0;

	//declare onAWord to determine whether or not we are currently on a word
	bool onAWord = false;

	//prompt user for input, store input in characterBuffer using fgets
	printf("Enter a list of words separated by one or more spaces:\n=> ");
	fgets(characterBuffer,sizeof(characterBuffer),stdin);

	//for each character in the characterBuffer excluding the newline character
	for(int i=0; i<strlen(characterBuffer)-1; i++){
		
		//if the current character is not a space and onAWord isn't set
		if(characterBuffer[i]!=' ' && onAWord==false){
			//set onAWord to true and add one to the word count
			onAWord = true;
			wordCount++;
		}
		//otherwise, if we are on a space and we just finished iterating through a word (onAWord=true)
		else if(characterBuffer[i] == ' ' && onAWord==true){
			//set onAWord to false
			onAWord=false;
		}
	}

	//print out the final number of words that the user's input had
	printf("You entered %d word",wordCount);
	
	if(wordCount == 1){
		printf(".\n");
	}
	else{
		printf("s.\n");
	}

	//return 0 upon successful completion of the program
	return 0;
}
