/*Blake Mills
 *COSC 3355.001
 *Submission Date: 2/18/2025
*/
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(int argc, char *argv[]){

    if(argc == 1){
        printf("Usage: ./graywc <filename>\n");
        return 1;
    }

    for(int i = 1; i < argc; i++){

        int fileDescriptor = open(argv[i],0);

        if(fileDescriptor == -1){
            fprintf(stderr,"Error: Unable to open file with path %s\n",argv[i]);
            return 1;
        }
        //variables for holding and tracking 
        // word count, number of bytes,
        //and new line characters
        int onAWord = 0;
        int wordCount = 0;
        int totalBytes = 0;
        int newLines = 0;
        char buffer[1];
        int bytesRead = 0;

        while((bytesRead = read(fileDescriptor,buffer,1)) > 0){
            
            if(bytesRead == -1){
                fprintf(stderr,"Error: Unable to read from the file with path %s\n",argv[i]);
                return 1;
            }

            totalBytes++;

            //increment newLines and reset onAWord if on a newline character
            if(buffer[0] == '\n'){
                newLines++;
                onAWord = 0;
            }
            else {
                //increment wordCount if first letter of a new word
                if(buffer[0] != ' ' && buffer[0] != '\t'){
                    if(onAWord == 0){
                        onAWord = 1;
                        wordCount++;
                    }
                }
                else {
                    onAWord = 0;
                }
            }
        }

        printf(" %d %d %d %s\n",newLines,wordCount,totalBytes,argv[i]);
        if(close(fileDescriptor) == -1){
            fprintf(stderr,"Error: Unable to close file with path %s,",argv[i]);
            return 1;
        }
        
    }
    return 0;
}