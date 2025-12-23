/*Blake Mills
 * COSC 1337 001
 * 11/17/2023
 * Purpose: To encapsulate information about an Account (Lab10L5)
 */
package businessServices;

import java.text.NumberFormat;

/**Encapsulates information about an Account
 * @author bmills5
 *
 */
public class Account {
	/**The balance for the Account*/
	private double balance;
	/**Formatter for currency*/
	public static final NumberFormat MONEY_FORMATTER =
			NumberFormat.getCurrencyInstance();
	
	/**Creates a new Account with input balance
	 * @param balance the balance for the new account
	 */
	public Account(double balance) {
		setBalance(balance);
	}
	
	/**Creates a new Account with a balance of $5000
	 * 
	 */
	public Account() {
		setBalance(5000);
	}

	/**Gets the balance for this Account
	 * 
	 * @return the balance
	 */
	public double getBalance() {
		return balance;
	}

	/**Sets the balance for this Account
	 * @param balance the balance to set
	 */
	public void setBalance(double balance) {
		this.balance = balance;
	}
	
	/**Returns a String version of the Account
	 * 
	 * @return a String version of the Account
	 */
	@Override
	public String toString() {
		return "Account Balance: " + MONEY_FORMATTER.format(getBalance());
	}
	
	/**Returns true iff o has the same data as this Account
	 * 
	 * @param o the object to compare this Account to
	 * @return true iff o has the same data as this Account
	 */
	@Override
	public boolean equals(Object o) {
		return toString().equals(o.toString());
	}
}
