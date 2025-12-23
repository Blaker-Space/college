/*Blake Mills
 * COSC 1337 001
 * 11/17/2023
 * Purpose: Allows a base interface for Objects that are Payable (Lab10L5)
 */
package businessServices;

/**Allows a base interface for Objects that are Payable
 * @author bmills5
 *
 */
public interface Payable {
	/**Pays this Payable Object
	 * 
	 * @param amount the amount to pay
	 * @return a String representing the payment
	 */
	public abstract String processPayment(double amount);
}
