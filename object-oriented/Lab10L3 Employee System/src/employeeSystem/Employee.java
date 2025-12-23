/*Blake Mills
 * COSC 1337 001
 * 11/8/2023
 * Purpose: To encapsulate information about an Employee (Lab10L3)
 */

package employeeSystem;

/**Encapsulates Employee information
 * @author bmills5
 *
 */
public class Employee {
	/**The Employee's first name*/
	protected String firstName;
	/**The Employee's last name*/
	protected String lastName;
	/**The Employee's id*/
	protected String eid;

	/**Creates a new Employee with input data
	 * @param firstName the first name of the new Employee
	 * @param lastName the last name of the new Employee
	 * @param eid the id of the new Employee
	 */
	public Employee(String firstName, String lastName, String eid) {
		super();
		setFirstName(firstName);
		setLastName(lastName);
		setEid(eid);
	}

	/**Sets the first name of the Employee
	 * 
	 * @param firstName the first name of this Employee
	 */
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	/**Sets the last name of the Employee
	 * 
	 * @param lastName the last name of the Employee
	 */
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	/**Sets the employee id of the Employee
	 * 
	 * @param eid the employee id to set
	 */
	public void setEid(String eid) {
		this.eid = eid;
	}

	/**Gets the first name of the Employee
	 * 
	 * @return the Employee's first name
	 */
	public String getFirstName() {
		return firstName;
	}

	/**Gets the last name of the Employee
	 * 
	 * @return the last name of the Employee
	 */
	public String getLastName() {
		return lastName;
	}

	/**Gets the employee id of the Employee
	 * 
	 * @return the employee id of the Employee
	 */
	public String getEid() {
		return eid;
	}

	/**Returns true iff the data in o is equal to this Employee
	 * @param o the object to compare this Employee to
	 * @return true iff the data in o is equal to this Employee
	 */
	@Override
	public boolean equals(Object o) {
		return toString().equals(o.toString());
	}

	/**Returns a String version of this Employee
	 * 
	 * @return a String version of this Employee
	 */
	@Override
	public String toString() {
		return "Employee: " + getFirstName() + " " + getLastName() + 
				"\nEmployee ID: "+ getEid();
	}
}
