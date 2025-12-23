/*Blake Mills
 * COSC 1337 001
 * 10/06/2023
 * Purpose: To encapsulate information about an Airplane, including
 * the model, the miles flown, and the amount of fuel used (Lab7L2)
 * Insight: Yes! Because the Airplane uses the toString() method,
 * and the toString() method includes all of the data items.
 */
package automobiles;

public class Airplane {
	//Fields
	private String model;
	private int milesFlown;
	private double gallonsOfFuel;
	//Static Initializers - none

	//Constructors
	public Airplane(String model, int milesFlown, double gallonsOfFuel) {
		setModel(model);
		setMilesFlown(milesFlown);
		setGallonsOfFuel(gallonsOfFuel);
	}

	//Methods - getters and setters
	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public int getMilesFlown() {
		return milesFlown;
	}

	public void setMilesFlown(int milesFlown) {
		this.milesFlown = milesFlown;
	}

	public double getGallonsOfFuel() {
		return gallonsOfFuel;
	}

	public void setGallonsOfFuel(double gallonsOfFuel) {
		this.gallonsOfFuel = gallonsOfFuel;
	}

	//Methods - data manipulation
	public double getMilesPerGallon() {
		if(getGallonsOfFuel()>.001)
			return (getMilesFlown()/getGallonsOfFuel());
		return 0;
	}

	//Methods - overridden methods
	@Override
	public String toString() {
		return "Airplane: "+ getModel()+ "\n\tMiles Flown: "+
				getMilesFlown()+ ". Fuel Used: "+ getGallonsOfFuel()+ 
				" gallons.\n\tFuel Efficiency: "+ getMilesPerGallon()+
				" mpg.";
	}

	@Override
	public boolean equals(Object o) {
		return o.toString().equals(toString());
	}
}
