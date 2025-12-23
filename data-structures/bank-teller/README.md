# bank-teller
<h1>Linked List and Queue Practice!</h1>
<h2>Importing data from a file and making a linked list<h2>
<hr>
<p>The importFile() function is very useful in this program! It is responsible for taking a String representing the path of the file to import (set with fileToImport in main()) and a LinkedList object as arguments. It then takes in tokens of data separated by commas, creates client objects from these tokens, and adds them to a linked list!</p>
<hr>
<h2>Functionality once a client Linked List is made</h2>
<p>After importing and creating the linked list, a CLI is used to output different input options in a menu for a bank teller to use. Options include adding a client to the queue, peeking to see who is next in the queue, serving clients (leading to other input options such as deposit, withdraw, close account, or never mind), and exiting the program. When serving clients, changes made to clients' accounts update the linked list. Checks are done to prevent any invalid actions, such as exiting the program while there are still clients in the queue or serving a client when there is no one in the queue.</p>
<hr>
<h2>After the Queue is empty and the UT Tyler Bank is closed:</h2>
<p>If there are no more clients in the queue, the teller has the option to close the program. Choosing this option will automatically export the updated client linked list to a new file as set with the fileToExport variable in main()!</p>
