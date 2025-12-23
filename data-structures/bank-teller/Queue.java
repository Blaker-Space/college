public class Queue {
    client head = null;
    client tail = null;
    client current = null;

    public void add(client c) {
        if (head == null) {
            head = c;
            tail = c;
            current = c;
        } else {
            tail.setNext(c);
            tail = tail.getNext();
        }
    }

    public client peek() {
        return head;
    }

    public void serve() {
        //check if someone is in the Queue
        if (head != null) {
            //if so, see if they are the only one in the queue
            if (head == tail) {
                //if so, return the final person in the queue, set head and tail to null since
                //there is no one in queue
                current = head;
                head = null;
                tail = null;
            }
            //else, there are more than one person in the queue
            else {
                current = head;
                head = head.getNext();
            }
        }
    }

    public boolean checkAgainstQueue(client toCheck) {
        if (head != null) {
            current = head;
            while (current != null) {
                if (toCheck.getAccount() == current.getAccount()) {
                    return false;
                }
                current = current.getNext();
            }
        }
        return true;
    }
}
