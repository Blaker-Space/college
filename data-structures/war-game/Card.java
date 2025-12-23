public class Card {
    private String number;
    private char suit = ' ';
    private int value = 0;
    private Card next = null;

    public Card(String n, char s, int v) {
        number = n;
        suit = s;
        value = v;
    }

    public void setNext(Card n) {
        next = n;
    }

    public Card getNext() {
        return next;
    }

    public String getNumber() {
        return number;
    }

    public char getSuit() {
        return suit;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
}
