public class Stack {
    private Card head;

    public Stack(Card head) {
        this.head = head;
    }

    public void push(Card c) {
        c.setNext(null);
        if (head == null) {
            head = c;
        } else {
            c.setNext(head);
            head = c;
        }
    }

    public Card pop() {
        Card p = head;
        if (head != null) {
            head = head.getNext();
            p.setNext(null);
        }
        return p;
    }

    public boolean notEmpty() {
        if (head == null) {
            return false;
        } else {
            return true;
        }
    }

    public boolean empty() {
        if (head == null) {
            return true;
        } else {
            return false;
        }
    }

    public int addCards() {
        Card current = head;
        int total = 0;
        while (current != null) {
            total += current.getValue();
            current = current.getNext();
        }
        return total;
    }

    public Card peekTop() {
        return head;
    }

    public int countCards() {
        int total = 0;
        Card current = head;
        while (current != null) {
            current = current.getNext();
            total++;
        }
        return total;
    }
}
