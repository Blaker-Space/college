/*Blake Mills
 * COSC 1337 001
 * 11/10/2023
 * Purpose: To encapsulate an hourly employee based on Employee (Lab10L3)
 */
package employeeSystem;

/**Encapsulates information about an Employee that is paid by the hour.
 * @author bmills5
 *
 */
public class HourlyEmployee extends Employee{

	/**The Employee's hours this period*/
	protected double hours;
	/**The Employee's pay per hour*/
	protected double wage;

	/**Creates a new HourlyEmployee based on the incoming data
	 * 
	 * @param firstName The first name of the Employee
	 * @param lastName The last name of the Employee
	 * @param eid The id of the Employee
	 * @param wage The wage of the Employee
	 */
	public HourlyEmployee(String firstName, String lastName, String eid,
			double wage) {
		super(firstName,lastName,eid);
		setWage(wage);
		setHours(0);
	}

	/**Gets the hours of this Employee
	 * 
	 * @return the hours of this Employee
	 */
	public double getHours() {
		return hours;
	}

	/**Sets the hours of this Employee if hours >= 0
	 * 
	 * @param hours the hours to set
	 */
	public void setHours(double hours) {
		if(hours>=0)
			this.hours = hours;
	}

	/**Gets the wage of this Employee
	 * @return the wage of this Employee
	 */
	public double getWage() {
		return wage;
	}

	/**Sets the wage of this employee if wage >= 0
	 * @param wage the wage to set
	 */
	public void setWage(double wage) {
		if(wage>=0)
			this.wage = wage;
	}

	/**Returns a String version of the hourly Employee
	 * 
	 * @return a String version of the hourly Employee
	 */
	@Override
	public String toString() {
		return "Hourly "+super.toString()+ "\nWage: "+getWage();
	}
}
