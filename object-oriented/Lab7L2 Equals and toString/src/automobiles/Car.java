/*Blake Mills
 * COSC 1337 001
 * 10/4/2023
 * Purpose: To encapsulate information about a Car including the model,
 * the miles driven, and the amount of gas used. (Lab7L2)
 */
package automobiles;

import java.text.DecimalFormat;

public class Car {
	//Fields
	private String model;
	private int milesDriven;
	private double gallonsOfGas;
	private DecimalFormat decimalFormat = new DecimalFormat("0.0");

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

	//Methods - overridden methods
	@Override
	public boolean equals(Object o) {
		if(!(o instanceof Car))
			return false;
		Car otherCar = (Car) o;
		return otherCar.getModel().equals(getModel()) &&
				otherCar.getMilesDriven() == getMilesDriven() &&
				otherCar.getGallonsOfGas() == getGallonsOfGas();
	}

	@Override
	public String toString() {
		return "Car: "+getModel()+"\n\tMiles Driven: "+
				getMilesDriven()+". Gas Used: "+
				decimalFormat.format(getGallonsOfGas())+
				" Fuel Efficiency: "+
				decimalFormat.format(getMilesPerGallon());
	}
}
