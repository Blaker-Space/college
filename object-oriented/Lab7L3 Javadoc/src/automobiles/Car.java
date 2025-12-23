/*Blake Mills
 * COSC 1337 001
 * 10/18/2023
 * Purpose: Encapsulate an Car including a model, milesDriven,
 * and the gallons of gas used so far (Lab7L3)
 */
package automobiles;

import java.text.DecimalFormat;
/**To encapsulate information about a Car including the model, the miles
 * driven, and the gallons of gas used so far
 * @author bmills5
 *
 */
public class Car {

	/**The model of the Car*/
	private String model;
	/**The miles driven by this Car*/
	private int milesDriven;
	/**The gallons of gas this Car has used so far*/
	private double gallonsOfGas;
	/**A formatter used for proper formatting of getMilesPerGallon()*/
	private DecimalFormat decFormat = new DecimalFormat("0.0");

	/**Sets the model of this Car object to unknown
	 * 
	 */
	public Car() {
		setModel("unknown");
	}

	/**Creates a new Car with the input information
	 * 
	 * @param model The model of the new Car
	 * @param milesDriven The number of miles driven by this Car
	 * @param gallonsOfGas The amount of gas used by this Car so far
	 */
	public Car(String model, int milesDriven, double gallonsOfGas) {
		setModel(model);
		setMilesDriven(milesDriven);
		setGallonsOfGas(gallonsOfGas);
	}

	/**Gets the model of the Car
	 * 
	 * @return the model of the Car
	 */
	public String getModel() {
		return model;
	}

	/**Set the model of the Car
	 * 
	 * @param model the new model of the Car
	 */
	public void setModel(String model) {
		this.model = model;
	}

	/**Gets the miles driven by the Car
	 * 
	 * @return the miles driven by the Car
	 */
	public int getMilesDriven() {
		return milesDriven;
	}

	/**Sets the miles driven by the Car
	 * 
	 * @param milesDriven the new miles driven by the Car
	 */
	public void setMilesDriven(int milesDriven) {
		if (milesDriven > 0)
			this.milesDriven = milesDriven;
		else
			this.milesDriven = 0;
	}

	/**Gets the gallons of gas used by this Car so far
	 * 
	 * @return the gallons of gas used by this Car so far
	 */
	public double getGallonsOfGas() {
		return gallonsOfGas;
	}

	/**Sets the gallons of gas used by the Car so far
	 * 
	 * @param gallonsOfGas the new gallons of gas used by the Car so far
	 */
	public void setGallonsOfGas(double gallonsOfGas) {
		if (gallonsOfGas > 0)
			this.gallonsOfGas = gallonsOfGas;
		else
			this.gallonsOfGas = 0;
	}

	/**Gets the fuel efficiency of this Car. Note that if 
	 * gallonsOfFuel <= .001, this method just returns 0.
	 * 
	 * @return the number of miles per gallon for this Car
	 */
	public double getMilesPerGallon() {
		if (getGallonsOfGas() > .001)
			return getMilesDriven()/getGallonsOfGas();
		return 0.0;
	}

	/**Gets the total amount of money spent on gas by this Car
	 * so far in US Dollars
	 * 
	 * @param pricePerGallon the price of gas per gallon in US
	 * Dollars
	 * @return the total amount of money in US Dollars spent on
	 * gas by this Car so far
	 */
	public double getMoneySpentOnGas(double pricePerGallon) {
		return pricePerGallon*getGallonsOfGas();
	}

	/**Returns true if and only if the input Car has the same data
	 * as this Car
	 * 
	 * @param o the Object to compare this Car to
	 * @return true iff the two Cars have the same data
	 */
	@Override
	public boolean equals(Object o) {
		if (!(o instanceof Car))
			return false;
		Car otherCar = (Car) o ;
		return otherCar.getModel().equals(getModel()) && otherCar.getMilesDriven() == getMilesDriven() &&
				otherCar.getGallonsOfGas() == getGallonsOfGas();
	}

	/**Returns a String representation of this Car
	 * 
	 * @return the String representation of this Car
	 */
	@Override
	public String toString() {
		return "Car:"+getModel()+"\n\tMiles Driven:"+getMilesDriven()+". Gas Used: "+getGallonsOfGas()+
				" Fuel Efficiency: "+decFormat.format(getMilesPerGallon())+" mpg.";
	}
}
