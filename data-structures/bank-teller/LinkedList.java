public class LinkedList {
    private client head = null;
    private client tail = null;
    private client current = null;

    public void add(client element) {
        if (head == null) {
            head = element;
            current = head;
            tail = head;
        } else {
            tail.setNext(element);
            tail = element;
        }
    }

    public void deleteAfter(client element) {
        //removes node after given node
        element.setNext(element.getNext().getNext());
    }

    public client getFirst() {
        return head;
    }

    public client getLast() {
        return tail;
    }

    public void resetCurrent() {
        current = head;
    }

    public client getNextElement() {
        client c = current;
        if (current != null) {
            current = current.getNext();
        } else {
            return null;
        }
        return c;
    }

    public client getNth(int index) {
        client answer = null;
        current = head;
        for (int i = 1; i <= index; i++) {
            answer = getNextElement();
        }
        return answer;
    }

    public client findNode(long accountToFind) {
        current = head;
        while (current != null) {
            if (current.getAccount() == accountToFind) {
                return current;
            }
            current = current.getNext();
        }
        return null;
    }

    public void deleteNode(long accountToDelete) {

        //call findNode to find the node we want to delete
        client toDelete = findNode(accountToDelete);

        // make previous and current start at the head of the list
        client previous = head;
        current = head;

        //while our current is not equal to the node we want to delete
        while (current != toDelete) {
            //move one node forward for previous and current
            previous = current;
            current = current.getNext();
        }
        //if we are on the head of the list
        if (toDelete == head) {
            //set head to the next element and current and previous to head
            head = head.getNext();
            current = head;
            previous = head;
        } else {
            //set current to the next node and point previous to current
            current = current.getNext();
            previous.setNext(current);
        }
        //reset current
        current = head;
    }
}