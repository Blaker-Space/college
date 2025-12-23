/*Blake Mills
 * COSC 1337 001
 * 11/8/2023
 * Purpose: To encapsulate data about a Sphere 
 * (Program4ThreeDimensionalShapes)
 */
package threeDimensional;

/**Encapsulates information about a Sphere
 * @author bmills5
 */
public class Sphere {

	/**the radius of the Circle*/
	private int radius;

	/**Creates a new Circle with radius set to 1*/
	public Sphere() {
		setRadius(1);
	}

	/**Creates a new Sphere with the input data
	 * 
	 * @param radius the Sphere's radius
	 */
	public Sphere(int radius) {
		setRadius(radius);
	}

	/**Gets the radius of this Sphere
	 * 
	 * @return the radius of this Sphere
	 */
	public int getRadius() {
		return radius;
	}

	/**Sets this Sphere's radius
	 * 
	 * @param radius the radius of the Sphere
	 */
	public void setRadius(int radius) {
		if(radius>=0)
			this.radius = radius;
	}

	/**Gets this Sphere's surface area as a rounded integer
	 * 
	 * @return the surface area of this Sphere as a rounded integer
	 */
	public double getSurfaceArea() {
		return (4*Math.PI*Math.pow(radius,2));
	}

	/**Gets the volume of this Sphere as a rounded integer
	 * 
	 * @return the volume of this Sphere as a rounded integer
	 */
	public double getVolume() {
		return ((4.0/3.0)*Math.PI*Math.pow(radius,3));
	}

	/**Returns a String representation of this Sphere's data
	 * 
	 * @return a String representation of this Sphere's data
	 */
	@Override
	public String toString() {
		return "Radius: "+getRadius()+" Surface Area: "+
				getSurfaceArea()+" Volume: "+getVolume();
	}

	/**Returns true iff the input Sphere has the same data
	 * as this Sphere
	 * 
	 * @param o the Object to compare this Sphere to
	 * @return true iff the two Spheres have the same data
	 */
	@Override
	public boolean equals(Object o) {
		return toString().equals(o.toString());
	}
}
