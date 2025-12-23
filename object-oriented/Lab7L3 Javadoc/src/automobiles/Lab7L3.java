/*Blake Mills
 * COSC 1337 001
 * 10/18/2023
 * Purpose: To test the Airplane and Car classes (Lab7L3)
 */
package automobiles;

/**A class that tests the Airplane and Car classes
 * by creating a Car and an Airplane object
 * and printing out their information
 * 
 * @author bmills5
 */
public class Lab7L3 {
	/**Not used
	 * 
	 */
	public static void main(String[] args) {
		//create a Car and an Airplane
		Car myCar = new Car();
		Airplane myPlane = new Airplane("model",0,0.0);

		//print out the info for the car and the airplane that you created
		System.out.println(myCar);
		System.out.println(myPlane);
	}//end main

}
