import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;
import java.util.ArrayList;

public class Guess{

	public static String outFile = "Animals.csv";
    public static String inFile = "Animals.csv";
    public static Tree tree = new Tree();

	public static void main(String[] args){
        tree = treeImport();
        boolean playing = true;
        Scanner s = new Scanner(System.in);

        node current = tree.root;
        String Astr;
        char a;
        boolean leaf;
        String outString;

        System.out.println("Animal Guessing Game\n");

        while(playing){
            if (tree.isLeaf(current)){
                leaf = true;
                outString = "Is it a/an " + current.question + "?";
            } else {
                leaf = false;
                outString = current.question;
            }
            System.out.print(outString + " Y/N/Q >");
            Astr = s.nextLine();
            a = Astr.charAt(0);
            
            //this switch statement was mostly completed in class. I added a while loop for input validation.
            switch(a){
            	
            	//yes
                case 'Y':
                case 'y':
                    if (leaf){
                        System.out.print("I am so smart. I bet I can beat you again.\nWant to play again? Y/N >");
                        Astr = s.nextLine();
                        a = Astr.charAt(0);
                        if((a == 'n') || (a == 'N')){
                            playing = false;
                        }else if(a=='y' || a=='Y'){
                            current = tree.root;
                        }
                    } else {
                        current = current.yes;
                    }
                    break;
                    
                //no
                case 'N':
                case 'n':
                	
                    if (leaf){
                        System.out.print("I give up! What is your animal? >");
                        String animalName = s.nextLine();
                        node newAnimalNode = new node(animalName);

                        System.out.print("What is a question to differentiate between a/an "+
                                current.question + " and a/an " + animalName + "? >");
                        String newQuestion = s.nextLine();
                        node newQuestionNode = new node(newQuestion);

                        String yesOrNo;
                        System.out.print("Is this question true for a/an " + animalName + "? Y/N >");
                        yesOrNo = s.next();
                        
                        //self-completed input validation
                        while((!yesOrNo.equalsIgnoreCase("n")) && !yesOrNo.equalsIgnoreCase("y")) {
                            System.out.println(yesOrNo +" is invalid. Type either \"Y\" or \"N\".");
                            System.out.print("Is this question true for a/an " + animalName + "? Y/N >");
                            yesOrNo = s.nextLine();
                        }
                        char yesOrNoChar = yesOrNo.charAt(0);
                        switch(yesOrNoChar) {

                            case 'y':
                            case 'Y':
                                tree.addQuestionAndAnimal(current, newQuestionNode, newAnimalNode,'y');
                                break;

                            case 'N':
                            case 'n':
                                tree.addQuestionAndAnimal(current, newQuestionNode,newAnimalNode,'n');
                                break;

                            default:
                                System.out.println("Error in yesOrNoChar switch.");
                                break;
                        }
                        s.nextLine();
                        System.out.print("Okay, I'll remember that... Do you want to play again? Y/N >");
                        Astr = s.nextLine();
                        if(Astr.charAt(0) =='Y'||Astr.charAt(0)=='y'){
                            System.out.println("Okay! Think of an animal...");
                            current=tree.root;
                        } else{
                            playing = false;
                        }
                    } else {
                        current = current.no;
                    }
                    break;
                    
                //quit
                case 'Q':
                case 'q':
                    playing = false;
                    break;

                default:
                    System.out.println("Y/N/Q only");
                    break;
            }
        }
        exportFile(tree);
        System.out.println("Goodbye");
        s.close();
    }
    
	//this function was completed in class
    public static void writeTree(node r, FileWriter fw, int i) {
    	if(r.yes != null) {
    		
    		writeTree(r.yes,fw,i*2);
    	}
    	try {
    		String outLine= i + ","+r.question+ "\n";
    		fw.write(outLine);
    	}
    	catch(IOException e){
    		System.out.println("Error writing to file");
    	}
    	if(r.no != null) {
    		
    		writeTree(r.no,fw,((i*2)+1));
    	}
    }
    
    //this function was partially completed in class and partially self-completed
    public static Tree treeImport() {
    	Tree importTree = new Tree();
    	ArrayList<node> aList = new ArrayList<>();

    	try {
    		FileReader fr = new FileReader(inFile);
    		BufferedReader br = new BufferedReader(fr);
    		String splitBy = ",";
    		String line = br.readLine();
    		
    		//code from this comment on was self-completed for this function
    		while(line !=null) {
    			String[] data = line.split(splitBy);
    			node n = new node(data[1]);
                while(Integer.parseInt(data[0])>=aList.size())
                    aList.add(null);
    			aList.set(Integer.parseInt(data[0]),n);
    			line = br.readLine();
    		}

            importTree=buildTree(aList, 1);
    		br.close();
    		fr.close();
    	}
    	catch(IOException e) {
    		System.out.println("File read error: "+ outFile);
    	}
    	return importTree;
    }
    
    //this function is entirely self-completed
    public static Tree buildTree(ArrayList<node> listOfNodes, int i){
        node currentNode;
        if(i==1){
            tree.root=listOfNodes.get(i);
        }
        if(listOfNodes.get(i)!=null) {
            currentNode = listOfNodes.get(i);
        }
        else{
            currentNode = null;
        }

        if(listOfNodes.size()-1>=i*2 && listOfNodes.get(i*2) !=null){
            node yesChild = listOfNodes.get(i*2);
            tree.addNode(currentNode, yesChild, "y");
            buildTree(listOfNodes, i*2);
        }
        if((listOfNodes.size()-1>=((i*2)+1)) && (listOfNodes.get((i*2)+1)!= null)){
            node noChild = listOfNodes.get((i*2)+1);
            tree.addNode(currentNode,noChild,"n");
            buildTree(listOfNodes, (i*2)+1);
        }

        return tree;
    }
    
    //this function was completed in-class
    public static void exportFile(Tree exportTree) {
		try {
			FileWriter fw = new FileWriter(outFile);
			writeTree(exportTree.root,fw,1);
			fw.close();
			
		} catch (IOException e) {
			System.out.println("File Error: " + outFile);
			e.printStackTrace();
		}
	}
}
