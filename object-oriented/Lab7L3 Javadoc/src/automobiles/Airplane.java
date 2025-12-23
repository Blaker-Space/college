/*Blake Mills
 * COSC 1337 001
 * 10/18/2023
 * Purpose: Encapsulate an Airplane including a model, milesFlown,
 * and the gallons of fuel used so far (Lab7L3)
 * Insight: Since many of the fields, constructors, and methods
 * used in Airplane and Car classes are similar, it would not
 * be unreasonable to combine the two into one class. To do so,
 * a new class would need to be made with an appropriate name
 * (such as "Automobile"), and the names of the methods and fields
 * would need to be adjusted since there are many field names and
 * method names shared between the two. A strategy for renaming
 * would be to add "airplane" or "car" before the field or method
 * name and after "get" or "set" for methods ("model" goes to
 * "carModel" and "airplaneModel", "getModel" goes to "getCarModel"
 * and "getAirplaneModel").
 */
package automobiles;
/**A class that encapsulates information about an Airplane including
 * the model, the miles flown, and the amount of fuel used. <hr> Some stuff
 * I want to say
 * 
 * @author bmills5
 *
 */
public class Airplane {

	/**The model of the Airplane*/
	private String model;
	/**The miles flown by this Airplane*/
	private int milesFlown;
	/**The amount of fuel this Airplane has used so far*/
	private double gallonsOfFuel;

	/**Creates a new Airplane with the input information
	 * 
	 * @param model The model of the new Airplane
	 * @param milesFlown The number of miles flown by this Airplane
	 * @param gallonsOfFuel The amount of fuel used by this Airplane so far
	 */
	public Airplane(String model, int milesFlown, double gallonsOfFuel) {
		setModel(model);
		setMilesFlown(milesFlown);
		setGallonsOfFuel(gallonsOfFuel);
	}

	/**Gets the model of the Airplane
	 * 
	 * @return the model of the Airplane
	 */
	public String getModel() {
		return model;
	}

	/**Set the model of the Airplane
	 * 
	 * @param model the new model of the Airplane
	 */
	public void setModel(String model) {
		this.model = model;
	}

	/**Gets the miles flown by the Airplane
	 * 
	 * @return the miles flown by the Airplane
	 */
	public int getMilesFlown() {
		return milesFlown;
	}

	/**Sets the miles flown by the Airplane
	 * 
	 * @param milesFlown the new miles flown by the Airplane
	 */
	public void setMilesFlown(int milesFlown) {
		this.milesFlown = milesFlown;
	}

	/**Gets the gallons of fuel used by this Airplane so far
	 * 
	 * @return the gallons of fuel used by this Airplane so far
	 */
	public double getGallonsOfFuel() {
		return gallonsOfFuel;
	}

	/**Sets the gallons of fuel used by the Airplane so far
	 * 
	 * @param gallonsOfFuel the new gallons of fuel used by the Airplane so far
	 */
	public void setGallonsOfFuel(double gallonsOfFuel) {
		this.gallonsOfFuel = gallonsOfFuel;
	}

	//data manipulation method for airplane
	/**Gets the fuel efficiency of this Airplane. Note that if 
	 * gallonsOfFuel <= .001, this method just returns 0.
	 * 
	 * @return the number of miles per gallon for this Airplane
	 */
	public double getMilesPerGallon() {
		if (getGallonsOfFuel() > .001)
			return getMilesFlown() / getGallonsOfFuel();
		else
			return 0.0;
	}

	/**Returns a String representation of this Airplane
	 * 
	 * @return the String representation of this Airplane
	 */
	@Override
	public String toString() {
		return "Airplane: "+getModel()+"\n\tMiles Flown: "+getMilesFlown()+". Fuel Used: "+getGallonsOfFuel()+
				" gallons.\n\tFuel efficiency: "+getMilesPerGallon()+ " mpg.";
	}

	/**Returns true if and only if the input Airplane has the same data
	 * as this Airplane
	 * 
	 * @param o the Object to compare this Airplane to
	 * @return true iff the two Airplanes have the same data
	 */
	@Override
	public boolean equals(Object o) {
		return o.toString().equals(toString());
	}
}
