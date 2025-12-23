/*Blake Mills
 * COSC 1337 001
 * 9/27/2023
 * Purpose: To encapsulate information about a Car including the model,
 * the miles driven, and the amount of gas used. (Lab7L1)
 * Insight: The data would become inconsistent if the derived data was
 * stored instead of being derived then some of the data that it was
 * based on changed.
 */
package automobiles;

public class Car {
	//Fields
	private String model;
	private int milesDriven;
	private double gallonsOfGas;

	//Static Initializers

	//Constructors
	public Car() {
		setModel("Unknown");
	}
	public Car(String model, int milesDriven, double gallonsOfGas) {
		setModel(model);
		setMilesDriven(milesDriven);
		setGallonsOfGas(gallonsOfGas);
	}
	//Methods - getters and setters
	public String getModel() {
		return model;
	}
	public void setModel(String model) {
		this.model=model;
	}
	public int getMilesDriven() {
		return milesDriven;
	}
	public void setMilesDriven(int milesDriven) {
		if(milesDriven>=0)
			this.milesDriven=milesDriven;
		else
			this.milesDriven=0;
	}
	public double getGallonsOfGas() {
		return gallonsOfGas;
	}
	public void setGallonsOfGas(double gallonsOfGas) {
		if(gallonsOfGas>=0)
			this.gallonsOfGas=gallonsOfGas;
		else
			this.gallonsOfGas=0;
	}
	//Methods - data manipulation methods
	public double getMilesPerGallon() {
		if (getGallonsOfGas()>0.001)
			return getMilesDriven()/getGallonsOfGas();
		return 0.0;
	}
	public double getMoneySpentOnGas(double pricePerGallon) {
		return pricePerGallon*getGallonsOfGas();
	}
	//Methods - overridden methods - none

}
