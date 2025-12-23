/*Blake Mills
 * COSC 1337 001
 * 11/21/2023
 * Purpose: To encapsulate data about a Train (Program5Trains)
 */
package trainsDemo;

import java.util.ArrayList;

/**Encapsulates data about a Train
 * @author bmills5
 */
public class Train {
	/**Holds the name of the Train*/
	private String name;
	/**Holds a list of Passengers*/
	private ArrayList<Passenger> passengers;
	
	/**Creates a Train by setting the name of the Train
	 * and initializing passengers to a new ArrayList
	 * 
	 * @param name the name of the Train to be created
	 */
	public Train(String name) {
		setName(name);
		passengers = new ArrayList<>();
	}
	
	/**Gets the name of this Train
	 * 
	 * @return this Train's name
	 */
	public String getName() {
		return name;
	}
	
	/**Sets the name of this Train
	 * 
	 * @param name the name of this Train
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**Adds a Passenger to the list of Passengers and
	 * returns the size of the passengers ArrayList
	 * 
	 * @param passenger the Passenger to be added to the list
	 * @return the size of the passenger ArrayList
	 */
	public int addPassenger(Passenger passenger) {
		passengers.add(passenger);
		return passengers.size();
	}
	
	/**Gets the percentage of Passengers in first class
	 * 
	 * @return the decimal percentage of Passengers in
	 * first class
	 */
	public double getPercentInFirstClass() {
		int totalPassengers = 0;
		int firstClassPassengers = 0;
		for(Passenger current:passengers) {
			if(current.isFirstClass())
				firstClassPassengers++;
			totalPassengers++;
		}
		return (double) firstClassPassengers/totalPassengers;
	}
	
	/**Gets the total revenue for this Train
	 * 
	 * @param priceForFirstClass the price of a first class ticket
	 * @param regularPrice the price of a regular (economy) ticket
	 * @return the total revenue for this Train
	 */
	public double getTrainRevenue(double priceForFirstClass, double regularPrice) {
		double totalRevenue = 0;
		for (Passenger current:passengers) {
			if(current.isFirstClass())
				totalRevenue+=priceForFirstClass;
			else
				totalRevenue+=regularPrice;
		}
		return totalRevenue;
	}
	
	/**Returns whether or not a specific Passenger is on this Train
	 * using the Passenger's name
	 * 
	 * @param nameOfPassenger the name of the Passenger
	 * @return true iff the given Passenger is on this Train
	 */
	public boolean isPassengerOnTrain(String nameOfPassenger) {
		for(Passenger current:passengers) {
			if(nameOfPassenger.equalsIgnoreCase(current.getName())) {
				return true;
			}
		}
		return false;
	}
	
	/**Returns true iff the passed object's data equals
	 * this Train's data.
	 * 
	 * @param o the object to compare this Train to
	 * @return true iff the object's data
	 *  equals this Train's data
	 */
	@Override
	public boolean equals(Object o) {
		return toString().equals(o.toString());
	}
	
	/**Returns a String representation of this Train's data
	 * 
	 * @return a String representation of this Train's data
	 */
	@Override
	public String toString() {
		String finalOutput=getName()+":\n";
		int i=1;
		for (Passenger passenger:passengers) {
			finalOutput+=i+" - "+passenger.toString()+"\n";
			i++;
		}
		return finalOutput;
	}
}
