# animal-guesser
<h1>General Functionality of Animal Guesser</h1>
<hr/>
<p>This program reads in questions, animals, and integers representing the position of the node in a binary tree from Animals.csv</p>
<br/>
<p>The program then creates a binary tree of nodes with each node containing either a question or an animal, a "yes" node, and a "no" node used to point to the next branches of the tree (set to null if the node is a leaf).</p>
<br/>
<p>If the user's animal is <strong>not found</strong> in the binary tree (the user gets to a node containing an animal name and the animal name is not what the user is thinking of), the program will ask the user for their animal's name, and a question to differentiate between their animal and the animal contained at the leaf node that did not match the user's animal. With the new question to differentiate between the two animals, the program asks if the question is true for the user's animal.</p>
<br/>
<p>If the question given to differentiate between the animals by the user is <strong>true</strong> for the animal the user thought of, the program replaces the animal node that it is currently at with the differentiation question given by the user, creates a new node for the animal the user thought of, sets this new node as the "yes" node for the question node, and sets the incorrect animal node (the one that was replaced by the new question node) as the "no" node for the new question node.</p>
<br/>
<p>If the question given to differentiate between the animals by the user is <strong>false</strong> for the animal the user thought of, the program does the same thing, but the newly-created animal node is set to the "no" node for the new question node, and the original animal node is set to the "yes" node for the question node.</p>
<br/>
<p>Once the user no longer wants to play by answering 'n' to the question "Do you want to play again? Y/N", the current state of the binary tree is saved to Animals.csv by using the writeTree() function to assign an integer corresponding to the node's position, and generate a string representing the node (ex. "2,Does it have spots?" represents a node with the question "Does it have spots?" in position 2 of the binary tree). This string is written to Animals.csv to prime for the next time the program is ran.</p>
