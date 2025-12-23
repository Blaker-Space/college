/*Blake Mills
 * COSC 1337 001
 * 11/10/2023
 * Purpose: To encapsulate a salaried employee based on Employee (Lab10L3)
 */
package employeeSystem;

/**Encapsulates information about an Employee that is paid the same
 * every pay period.
 * @author bmills5
 * 
 */
public class SalariedEmployee extends Employee{
	/**The Employee's salary*/
	protected double salary;

	/**Creates a new SalariedEmployee based on incoming data
	 * 
	 * @param firstName the first name of the Employee
	 * @param lastName the last name of the Employee
	 * @param eid the id of the Employee
	 * @param salary the salary of the Employee
	 */
	public SalariedEmployee(String firstName, String lastName, String eid,
			double salary) {
		super(firstName, lastName, eid);
		setSalary(salary);
	}

	/**Gets the salary of this Employee
	 * @return the salary
	 */
	public double getSalary() {
		return salary;
	}

	/**Sets the salary of this Employee if salary >= 0
	 * @param salary the salary to set
	 */
	public void setSalary(double salary) {
		if(salary>=0)
			this.salary = salary;
	}

	/**Returns a String version of the SalariedEmployee
	 * 
	 * @return a String version of the SalariedEmployee
	 */
	@Override
	public String toString() {
		return "Salaried "+super.toString()+"\nSalary: "+getSalary();
	}
}
