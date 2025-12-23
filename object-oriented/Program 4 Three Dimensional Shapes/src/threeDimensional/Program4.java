/*Blake Mills
 * COSC 1337 001
 * 11/8/2023
 * Purpose: To implement the Cube and Sphere classes
 * by creating some Cube and Sphere objects, and using
 * the methods within these classes.
 * (Program4ThreeDimensionalShapes)
 */
package threeDimensional;

import java.util.Scanner;

/**Creates three Cube and Sphere objects each, and tests
 * out Cube and Sphere methods by outputting data such as
 * the Cube side lengths, surface areas and volumes, and the
 * Sphere radii, surface area and volume. Program4 also uses
 * the .equals() method in Cube and Sphere classes to see if
 * the data between the objects are the same.
 * 
 */
public class Program4 {
	/**The entry point of our program
	 * 
	 * @param args NOT USED
	 */
	public static void main(String[] args) {

		//Create a scanner, make a default Cube, and print out its toString()
		Scanner scanner = new Scanner(System.in);
		Cube firstCube = new Cube();
		System.out.println(firstCube);

		//Make a second Cube and prompt user for input of its side length
		//Call .setLengthOfSide() to set user input as the length of secondCube's side
		Cube secondCube = new Cube();
		System.out.print("Please enter the length of the side "+
				"for secondCube: ");
		secondCube.setLengthOfSide(scanner.nextInt());

		//Create a third Cube object with side length of 3
		Cube thirdCube = new Cube(3);

		//Create accessorValue to be able to call .getLengthOfSide() for firstCube
		int accessorValue = firstCube.getLengthOfSide();

		//Print out firstCube side length, secondCube surface area, and thirdCube
		//volume using accessorValue for firstCube's side length
		System.out.println("First Cube side length: "+accessorValue+
				" Second Cube surface area: "+secondCube.getSurfaceArea()+
				" Third Cube volume: "+thirdCube.getVolume());

		//Output all three Cubes in order with labels in appropriate places
		System.out.print("First Cube:\n\t"+firstCube+"\nSecond Cube:\n\t"+
				secondCube+"\nThird Cube:\n\t"+thirdCube+"\n");

		//Output whether each Cube is equal to each other Cube
		//firstCube and secondCube comparison
		if(firstCube.equals(secondCube))
			System.out.println("The first Cube is equal to the second Cube.");
		else
			System.out.println("The first Cube is NOT equal to the second Cube.");

		//secondCube and thirdCube comparison
		if(secondCube.equals(thirdCube))
			System.out.println("The second Cube is equal to the third Cube.");
		else
			System.out.println("The second Cube is NOT equal to the third Cube.");

		//firstCube and thirdCube comparison
		if(firstCube.equals(thirdCube))
			System.out.println("The first cube is equal to the third cube.");
		else
			System.out.println("The first cube is NOT equal to the third cube.");

		//Output a newline to make console output look cleaner
		System.out.println();

		//make a default Sphere and print its toString()
		Sphere firstSphere = new Sphere();
		System.out.println(firstSphere);

		//Make a second Sphere and prompt user for input of its radius
		//Call .setRadius() to set user input as the radius of secondSphere
		Sphere secondSphere = new Sphere();
		System.out.print("Please enter the radius for secondSphere: ");
		secondSphere.setRadius(scanner.nextInt());

		//Create a third Sphere object with radius of 3
		Sphere thirdSphere = new Sphere(3);

		//Create accessorValue2 to be able to call .getRadius() for firstSphere
		int accessorValue2 = firstSphere.getRadius();

		//Print out firstSphere radius, secondSphere surface area, and thirdSphere
		//volume using accessorValue2 for firstSphere's radius
		System.out.println("First Sphere radius: "+accessorValue2+
				" Second Sphere surface area: "+secondSphere.getSurfaceArea()+
				" Third Sphere volume: "+thirdSphere.getVolume());

		//Output all three Spheres in order with labels in appropriate places
		System.out.print("First Sphere:\n\t"+firstSphere+"\nSecond Sphere:\n\t"+
				secondSphere+"\nThird Sphere:\n\t"+thirdSphere+"\n");

		//Output whether each Sphere is equal to each other Sphere
		//firstSphere and secondSphere comparison
		if(firstSphere.equals(secondSphere))
			System.out.println("The first Sphere is equal to the second Sphere.");
		else
			System.out.println("The first Sphere is NOT equal to the second Sphere.");

		//secondSphere and thirdSphere comparison
		if(secondSphere.equals(thirdSphere))
			System.out.println("The second Sphere is equal to the third Sphere.");
		else
			System.out.println("The second Sphere is NOT equal to the third Sphere.");

		//firstSphere and thirdSphere comparison
		if(firstSphere.equals(thirdSphere))
			System.out.println("The first Sphere is equal to the third Sphere.");
		else
			System.out.println("The first Sphere is NOT equal to the third Sphere.");

		//close the scanner
		scanner.close();
	}//end of main
}//end of class