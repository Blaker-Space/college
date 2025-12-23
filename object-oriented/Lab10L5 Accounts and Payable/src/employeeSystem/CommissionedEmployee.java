/*Blake Mills
 * COSC 1337 001
 * 11/17/2023
 * Purpose: To encapsulate information about an Employee that is paid
 * according to how much he or she sells (Lab10L5)
 */
package employeeSystem;

/**Encapsulates information about an Employee that is paid based on
 * his or her sales
 * @author bmills5
 *
 */
public class CommissionedEmployee extends Employee {
	/**The amount that this Employee has sold this period*/
	protected double grossSales;
	/**The percentage the Employee gets paid of the amount he or she sold*/
	protected double commissionRate;

	/**Creates a new CommissionedEmployee from the incoming data
	 * @param firstName the first name of the Employee
	 * @param lastName the last name of the Employee
	 * @param eid the id of the Employee
	 * @param commissionRate the commission rate of this Employee
	 */
	public CommissionedEmployee(String firstName, String lastName, String eid,
			double commissionRate) {
		super(firstName, lastName, eid);
		setCommissionRate(commissionRate);
		setGrossSales(0);
	}

	/**Gets the gross sales of this Employee
	 * @return the grossSales
	 */
	public double getGrossSales() {
		return grossSales;
	}

	/**Sets the gross sales of this Employee
	 * @param grossSales the grossSales to set
	 */
	public void setGrossSales(double grossSales) {
		this.grossSales = (grossSales>=0?grossSales:0);
	}

	/**Gets the commission rate for this Employee
	 * @return the commissionRate
	 */
	public double getCommissionRate() {
		return commissionRate;
	}

	/**Sets the commission Rate for this Employee
	 * @param commissionRate the commissionRate to set
	 */
	public void setCommissionRate(double commissionRate) {
		this.commissionRate = (commissionRate>=0 && commissionRate<=1.0?
				commissionRate:0);
	}
	
	/**Returns the earnings for this period for this Employee
	 * 
	 * @return the earnings for this period for this Employee
	 */
	@Override
	public double getEarnings() {
		return getGrossSales()*getCommissionRate();
	}
	
	/**Gets a String version of this CommissionedEmployee
	 * 
	 * @return a String version of this CommissionedEmployee
	 */
	@Override
	public String toString() {
		return "Commissioned "+super.toString()+"\nCommission Rate: "+
				PERC.format(getCommissionRate());
	}



}
