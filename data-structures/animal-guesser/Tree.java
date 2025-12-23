
public class Tree{

    node root = new node("");

    public boolean isLeaf(node n){
        if((n.no == null) && (n.yes == null)){
            return true;
        } else{
            return false;
        }
    }

    public void addNode(node currentNode, node nodeToAdd, String branch){
        if(branch.equalsIgnoreCase("y")){
            currentNode.yes = nodeToAdd;
        }
        else if(branch.equalsIgnoreCase("n")){
            currentNode.no = nodeToAdd;
        }
    }
    public void addQuestionAndAnimal(node currentNode, node questionToAdd, node animalToAdd, char differenceChoice){
        node bucketNode = new node(currentNode.question);
        switch(differenceChoice){
            case 'y':
            case 'Y':
                currentNode.question=questionToAdd.question;
                currentNode.yes = animalToAdd;
                currentNode.no = bucketNode;
                break;

            case 'n':
            case 'N':
                currentNode.question=questionToAdd.question;
                currentNode.yes = bucketNode;
                currentNode.no = animalToAdd;
                break;

            default:
                System.out.println("Error in addNode function of Tree.java.");
        }
    }
}