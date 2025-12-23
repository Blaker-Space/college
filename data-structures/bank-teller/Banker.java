import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Scanner;
import java.io.FileWriter;
/**
 * The Banker class executes a CLI banking Queue and Service system using a Linked List and a Queue. Banker starts by
 * importing all clients from a file (fileToImport in main()) and storing them in a Linked List. It then presents the
 * user with service options: add client to queue, peek at next client in Queue, serve next client, and quit program. If
 * the client's account number is not found in the Linked List when adding the client to the Queue, the user can
 * <strong><em>open a new account to be added to the Linked List</em></strong>, try and search the Linked List again,
 * or exit the program. Upon choosing to quit the program, Banker writes content of the Linked List to a file
 * (fileToExport in main()) for long-term storage of the data.
 *
 * @author Bmills5
 */
public class Banker {
    public static Queue queue = new Queue();//Holds the line of clients to serve (FIFO)
    public static Scanner s = new Scanner(System.in);//Used for user input
    public static LinkedList dataList = new LinkedList();//Holds all of our clients after being read in by importFile()

    /**
     * The entry point of our program
     *
     * @param args NOT USED
     */
    public static void main(String[] args) {

        String fileToImport = "/home/blakerspace/Documents/clients.csv";//the file containing the contents of our Linked List
        String fileToExport = "/home/blakerspace/Documents/clients2.csv";//the file to write the Linked List to

        //import our file
        importFile(dataList, fileToImport);
        //show main menu for user choices
        int mainMenuChoice = showMainMenu();
        //handle the choice the user makes
        handleChoice(mainMenuChoice);
        //export our Linked List to our fileToExport
        exportFile(dataList, fileToExport);
        //close our Scanner
        s.close();
    }

    /**
     * showMainMenu() outputs the main menu of our program: Bank Queue. It waits for the user to choose an integer
     * that coincides with what service they would like to accomplish, and returns it once valid (between 1 and 4):
     * add a client to the Queue (option 1), peek to see who is at the front of the Queue (option 2), serve the next
     * person in the Queue (option 3), and quit the program (option 4)
     *
     * @return choice the choice, 1-4, of the operation the user wants to accomplish
     */
    public static int showMainMenu() {

        int choice = 0;
        while ((choice < 1) || (choice > 4)) {

            System.out.println("******************");
            System.out.println("*   BANK QUEUE   *");
            System.out.println("******************");
            System.out.println("*  1. Add Client *");
            System.out.println("*  2. Peek Next  *");
            System.out.println("*  3. Serve Next *");
            System.out.println("*  4. Quit       *");
            System.out.println("******************");
            System.out.print(" Choice: ");
            choice = s.nextInt();
        }
        return choice;
    }

    /**
     * handleChoice() is used for passing the choice of the user from showMainMenu() to the appropriate method for
     * proper handling of the user's request.
     *
     * @param choice the choice that the user made in showMainMenu()
     */
    public static void handleChoice(int choice) {
        boolean continueRunning = true;
        do {
            switch (choice) {

                case 1://add
                    System.out.println("Adding to Queue...");
                    addToQueue();
                    break;

                case 2://peek
                    System.out.println("Peeking Queue...");
                    peekQueue();
                    break;

                case 3://serve
                    System.out.println("Serving next in Queue...");
                    serveQueue();
                    break;

                case 4://quit
                    if (queue.peek() == null) {
                        System.out.println("Thank you for using the UT Tyler Banking System!\n");
                        continueRunning = false;
                    } else {
                        System.out.print("The Queue must be empty before quitting.\n\n");
                    }
                    break;

                default://oops
                    System.out.println("Invalid choice");
                    break;
            }
            if (continueRunning) {

                choice = showMainMenu();
            }

        } while (continueRunning);
    }

    /**
     * addToQueue() handles user option 1, adding the client to queue. It verifies that the client to be added to the
     * queue is not null, and that the account number, first and last names all match according to the file to import.
     * It further ensures that no clients are double-added to the queue
     */
    public static void addToQueue() {
        client clientToAdd; //the client we will add to our queue with next set to null
        client clientInList; //the client from our dataList with next set to the next node

        //Ask user for account number and  name. Store in variables
        System.out.print(" Enter your account number>");
        long accountNumberToAdd = s.nextLong();
        s.nextLine();//clear buffer
        System.out.print(" Enter your First name>");
        String firstNameToAdd = s.nextLine();
        System.out.print(" Enter your Last name>");
        String lastNameToAdd = s.nextLine();

        //find the appropriate node
        clientInList = dataList.findNode(accountNumberToAdd);

        //while unable to find node
        while (clientInList == null) {
            //Tell client we are unable to locate account, prompt for account number again, store account number
            System.out.printf("Account number %d is not in our system. Please try again.\n",
                    accountNumberToAdd);
            System.out.print(" Enter your account number>");
            accountNumberToAdd = s.nextLong();
            //search for node again
            clientInList = dataList.findNode(accountNumberToAdd);
        }

        //once findClientInList!=null, make sure first and last names are valid
        while (!clientInList.getFname().equalsIgnoreCase(firstNameToAdd) ||
                !clientInList.getLname().equalsIgnoreCase(lastNameToAdd) || clientInList.getAccount() != accountNumberToAdd) {
            System.out.printf("Account number %d doesn't match name %s %s in our system. Please try again.\n", accountNumberToAdd,
                    firstNameToAdd, lastNameToAdd);
            System.out.print(" Enter your account number>");
            accountNumberToAdd = s.nextLong();
            s.nextLine();//clear buffer
            System.out.print(" Enter your First name>");
            firstNameToAdd = s.nextLine();
            System.out.print(" Enter your Last name>");
            lastNameToAdd = s.nextLine();
        }
        clientToAdd = new client(clientInList.getFname(), clientInList.getLname(), clientInList.getAccount(), clientInList.getBalance());
        clientToAdd.setNext(null);

        //make sure client is not already in queue
        boolean clientNotInQueue = queue.checkAgainstQueue(clientToAdd);
        if (clientNotInQueue) {
            //if not, add client to queue and inform user
            queue.add(clientToAdd);
            System.out.printf("New Client in Queue: %s %s\n\n",
                    clientToAdd.getFname(), clientToAdd.getLname());
            //otherwise, tell client they are already in queue
        } else {
            System.out.printf("%s %s is already in the Queue...\n\n", clientToAdd.getFname(), clientToAdd.getLname());
        }
    }

    /**
     * peekQueue() handles user option 2, peek queue, which is designed to show the next person to be served in a
     * FIFO manner. peekQueue() outputs that the queue is empty if there is no client added to it
     */
    public static void peekQueue() {

        client frontOfLine = queue.peek();
        if (frontOfLine != null) {

            System.out.printf("%s %s is next in line\n\n",
                    frontOfLine.getFname(), frontOfLine.getLname());
        } else {

            System.out.println("Queue is empty\n\n");
        }
    }

    /**
     * serveQueue() handles the service processes (check balance, deposit, withdraw, close account, exit) along
     * with removing the user from the Queue. To determine the service option the client would like,
     * serveQueue() calls showServeMenu()
     */
    public static void serveQueue() {
        client clientInQueue = queue.peek();
        client clientInList = new client("", "", 0, 0.0);

        if (clientInQueue == null) {
            System.out.println("Queue is empty\n\n");
        } else {
            clientInList = dataList.findNode(clientInQueue.getAccount());
            System.out.printf("Now serving %s %s\n\n", clientInList.getFname(),
                    clientInList.getLname());

            int choice = showServeMenu();
            switch (choice) {
                case 1: //Check Balance
                    System.out.printf("Your current balance is: $%1.2f\n\n",
                            clientInList.getBalance());
                    break;
                case 2: //Deposit
                    double amountToDeposit = 0.0;
                    System.out.print("Please enter deposit amount>");
                    amountToDeposit = s.nextDouble();
                    clientInList.setBalance(clientInList.getBalance() + amountToDeposit);
                    System.out.printf("The new balance for account %d under the name %s %s is $%1.2f.\n\n",
                            clientInList.getAccount(), clientInList.getFname(), clientInList.getLname(),
                            clientInList.getBalance());
                    break;
                case 3: //Withdraw
                    double amountToWithdraw = 0.0;
                    System.out.print("Please enter withdrawal amount>");
                    amountToWithdraw = s.nextDouble();

                    while (amountToWithdraw > clientInList.getBalance()) {
                        System.out.printf("Your withdrawal amount of $%1.2f is greater than your" +
                                        " current balance of $%1.2f. Please try again.\n", amountToWithdraw,
                                clientInList.getBalance());
                        System.out.print("Please enter the amount you would like to withdraw>");
                        amountToWithdraw = s.nextDouble();
                    }
                    clientInList.setBalance(clientInList.getBalance() - amountToWithdraw);
                    System.out.printf("You withdrew $%1.2f from account number %d leaving its new" +
                                    " balance at $%1.2f.\n\n", amountToWithdraw, clientInList.getAccount(),
                            clientInList.getBalance());
                    break;
                case 4: //Close Account
                    System.out.printf("Closing account number %d under the name %s %s with a current balance of $%1.2f\n"
                            , clientInList.getAccount(), clientInList.getFname(), clientInList.getLname(), clientInList.getBalance());
                    s.nextLine();//clear buffer
                    System.out.print("Are you sure you want to close this account? (y/n)>");
                    String closeAccountChoice = s.nextLine();
                    if (closeAccountChoice.equalsIgnoreCase("y") || closeAccountChoice.equalsIgnoreCase("yes")) {
                        System.out.printf("Account number %d under the name %s %s has been closed.\n" +
                                        "Amount due to %s is $%1.2f.\n", clientInList.getAccount(),
                                clientInList.getFname(), clientInList.getLname(), clientInList.getFname(), clientInList.getBalance());
                        dataList.deleteNode(clientInList.getAccount());
                    }
                    System.out.print("Returning to Main Menu...\n\n");
                    break;
                case 5: //Never mind
                    System.out.print("Returning to Main Menu...\n\n");
                    break;
            }
        }
        queue.serve();
    }

    /**
     * showServeMenu() presents the user with a list of five service options (check balance, deposit, withdraw, close
     * account, and never mind), waits for the user to input a number 1-5, and returns the user's choice
     *
     * @return the service option the user has chosen
     */
    public static int showServeMenu() {

        int choice = 0;
        while ((choice < 1) || (choice > 5)) {

            System.out.println("*********************");
            System.out.println("*    SERVE NEXT     *");
            System.out.println("*********************");
            System.out.println("*  1. Check Balance *");
            System.out.println("*  2. Deposit       *");
            System.out.println("*  3. Withdraw      *");
            System.out.println("*  4. Close Account *");
            System.out.println("*  5. Never mind    *");
            System.out.println("*********************");
            System.out.print("  Choice: ");
            choice = s.nextInt();
        }
        return choice;
    }

    /**
     * importFile() creates a Linked List of clients by reading in data, with fields separated by commas (or something
     * else if the parseBy variable is changed to a different character), from a file as set by fileToImport.
     *
     * @param dataList     the Linked List we want to create from the file we are reading in
     * @param fileToImport the path to the file that we want to read in data from
     */
    private static void importFile(LinkedList dataList, String fileToImport) {
        try {
            //Create a FileReader to read from fileToImport
            FileReader fr = new FileReader(fileToImport);
            //Create a BufferedReader to read from fr
            BufferedReader br = new BufferedReader(fr);
            //Read in a line of data from bufferedReader
            String lineOfData = br.readLine();
            String parseBy = ",";
            //while our next line of data is not equal to null
            while (lineOfData != null) {
                //create a String array to hold a new line of data, split each line by parseBy
                String[] data = lineOfData.split(parseBy);
                //create a new reading with the data from this data's String array
                client currentClient = new client(data[1], data[2],
                        Long.parseLong(data[0]), Double.parseDouble(data[3]));
                dataList.add(currentClient);
                lineOfData = br.readLine();
            }
            br.close();
            fr.close();
        } catch (IOException e) {
            System.out.println("File Error\n" + e);
        }
    }

    /**
     * exportFile() is called in main() once the user decides to officially exit the program from the main menu. It
     * exports the clients of our Linked List (dataList) to a file (fileToOutput) with fields separated by commas.
     * Once done exporting, it informs the user how many clients were exported to the file, the path to the exported
     * file, and that the program is exiting.
     *
     * @param dataList     our Linked List that holds the data of our clients
     * @param fileToOutput the path to the file that we want to export our Linked List data to
     */
    public static void exportFile(LinkedList dataList, String fileToOutput) {
        dataList.resetCurrent();
        client currentClient = dataList.getNextElement();
        int outCount = 1;    //counts number of clients exported
        try {
            System.out.println("Exporting...");
            FileWriter writeToFile = new FileWriter(fileToOutput, false);

            while (currentClient != null) {
                String outString = String.format("%d,%s,%s,%1.2f\n", currentClient.getAccount(), currentClient.getFname(),
                        currentClient.getLname(), currentClient.getBalance());
                writeToFile.write(outString);
                currentClient = currentClient.getNext();
                outCount++;
            }
            System.out.println("Wrote " + (outCount - 1) + " clients to " + fileToOutput +
                    "\nQuitting program...");
            writeToFile.close();
        } catch (
                IOException e) {
            System.out.println("File " + fileToOutput + "ERROR\n");
            e.printStackTrace();
        }
    }
}

