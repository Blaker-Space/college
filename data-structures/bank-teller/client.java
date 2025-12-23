public class client {
    private String fname;
    private String lname;
    private long account;
    private double balance;
    private client next;

    public client(String fn, String ln, long a, double b) {
        fname = fn;
        lname = ln;
        account = a;
        balance = b;
    }

    public String getFname() {
        return fname;
    }

    public void setNext(client n) {
        next = n;
    }

    public client getNext() {
        return next;
    }

    public String getLname() {
        return lname;
    }

    public long getAccount() {
        return account;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double b) {
        balance = b;
    }

    public void setAccount(long a) {
        this.account = a;
    }
}