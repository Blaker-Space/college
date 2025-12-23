/*Blake Mills
 * COSC 1337 001
 * 11/21/2023
 * Purpose: To encapsulate data about a Passenger (Program5Trains)
 * 
 */
package trainsDemo;

/**Encapsulates information about a Passenger
 * @author bmills5
 */
public class Passenger {
	/**The name of the Passenger*/
	private String name;
	/**Holds whether the Passenger is in first class*/
	private boolean isFirstClass;
	
	/**Creates a Passenger object containing the Passenger's name and
	 * whether or not the Passenger is in first class
	 * 
	 * @param name the name of the Passenger
	 * @param isFirstClass whether the Passenger is in first class or not
	 */
	public Passenger(String name, boolean isFirstClass) {
		setName(name);
		setFirstClass(isFirstClass);
	}
	
	/**Gets the name of the Passenger
	 * 
	 * @return the name of the Passenger
	 */
	public String getName() {
		return name;
	}
	
	/**Sets the name of the Passenger
	 * 
	 * @param name the name of the Passenger
	 */
	public void setName(String name) {
		this.name=name;
	}
	
	/**Returns true iff the Passenger is in first class
	 * 
	 * @return true iff the Passenger is in first class
	 */
	public boolean isFirstClass() {
		return isFirstClass;
	}
	
	/**Sets whether this Passenger is in first class or not
	 * 
	 * @param isFirstClass true iff the Passenger is in first class
	 */
	public void setFirstClass(boolean isFirstClass) {
		this.isFirstClass = isFirstClass;
	}
	
	/**Returns true iff this Passenger's data equals
	 * the data of the Object passed to this method
	 * 
	 * @param o the object to compare this Passenger to
	 */
	@Override
	public boolean equals(Object o) {
		return toString().equals(o.toString());
	}
	
	/**Returns a String representation of this Passenger's
	 * data, including the Passenger's name and "!" if the
	 * passenger is in first class
	 * 
	 * @return a String representation of this Passenger's
	 * data
	 */
	@Override
	public String toString() {
		if(isFirstClass())
			return getName()+"\t\t!";
		return getName();
	}
}
