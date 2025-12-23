/*Blake Mills
 *COSC 3355.001
 *Submission Date: 3/27/2025
*/
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

// outputMenuAndGetChoice gives the user a list of commands to run on the specified file
// outputMenuAndGetChoice then reads in the user's menu choice and returns it to main
int outputMenuAndGetChoice(){
    int menuChoice = 0;
    printf("Action to perform:\n");
    printf("(1) Display file contents.\n");
    printf("(2) Print newline, word, and character count.\n");
    printf("(3) Print directory details.\n");
    printf("(4) Exit.\n\n");
    printf("=> ");
    
    //read in the user's menu choice and clear buffer
    menuChoice = getchar() - '0';
    while(getchar() != '\n');

    printf("\n");
    //check for valid input
    while (menuChoice < 1 || menuChoice > 4){
        printf("Invalid choice. Please enter a number from 1-4\n\n");
        printf("=> ");
        menuChoice = getchar() - '0';
        while(getchar() != '\n');
        printf("\n");
    }
    return menuChoice;
}

int main(int argc, char *argv[]){
    
    // check for correct amount of command-line arguments
    if(argc != 2){
        fprintf(stderr, "Usage: ./filedat <filename>\n");
        exit(1);
    }

    printf("\nFile to be processed: %s\n",argv[1]);
    int userMenuChoice = outputMenuAndGetChoice();

    while (userMenuChoice != 4){
        int rc = fork();

        if (rc < 0){ //fork failed
            perror("Fork failed!\n");
            exit(1);
        }

        else if (rc == 0){ //new child process running
            switch(userMenuChoice){
                case 1:
                    char *catArgs[] = {"cat", argv[1], NULL};
                    execvp("cat", catArgs);
                    break;
                case 2:
                    char *wcArgs[] = {"wc", argv[1], NULL};
                    execvp("wc", wcArgs);
                    break;
                case 3:
                    char *lsArgs[] = {"ls", "-l", argv[1], NULL};
                    execvp("ls", lsArgs);
                    break;
                default:
                    printf("Invalid choice\n");
                    break;
            }
            perror("Execution failed!\n");
            exit(1);
        }

        else { //parent process running since rc > 0
            wait(NULL);
            printf("\n");
        }

        printf("File to be processed: %s\n",argv[1]);
        userMenuChoice = outputMenuAndGetChoice();
    }
    return 0;
}