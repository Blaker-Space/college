/*Blake Mills
 * COSC 1337 001
 * 11/8/2023
 * Purpose: To encapsulate data about a Cube 
 * (Program4ThreeDimensionalShapes)
 */
package threeDimensional;

/**Encapsulates information about a Cube
 * @author bmills5
 */
public class Cube {
	/**the length of one of the Cube's sides*/
	private int lengthOfSide;

	/**Creates a new Cube with length of sides set to 1*/
	public Cube() {
		setLengthOfSide(1);
	}

	/**Creates a new Cube with the given input data
	 * 
	 * @param lengthOfSide the Cube's length of one side
	 */
	public Cube(int lengthOfSide) {
		setLengthOfSide(lengthOfSide);
	}

	/**Gets the length of this Cube's side
	 * 
	 * @return the length of one side of this Cube
	 */
	public int getLengthOfSide() {
		return lengthOfSide;
	}

	/**Sets this Cube's length of one side. lengthOfSide must
	 * be greater than 0. Otherwise, the value of lengthOfSide
	 * stays the same.
	 * 
	 * @param lengthOfSide the length of one side of the Cube
	 */
	public void setLengthOfSide(int lengthOfSide) {
		if(lengthOfSide>=0)
			this.lengthOfSide = lengthOfSide;
	}

	/**Gets this Cube's surface area
	 * 
	 * @return the surface area of this Cube
	 */
	public int getSurfaceArea() {
		return 6*(lengthOfSide*lengthOfSide);
	}

	/**Gets the volume of this Cube
	 * 
	 * @return the volume of this Cube
	 */
	public int getVolume() {
		return (int) Math.pow(lengthOfSide,3);
	}

	/**Returns a String representation of this Cube's data
	 * 
	 * @return a String representation of this Cube's data
	 */
	@Override
	public String toString() {
		return "Cube: "+getLengthOfSide()+" Surface Area: "+
				getSurfaceArea()+" Volume: "+getVolume();
	}

	/**Returns true iff the input Cube has the same data
	 * as this Cube
	 * 
	 * @param o the Object to compare this Cube to
	 * @return true iff the two Cubes have the same data
	 */
	@Override
	public boolean equals(Object o) {
		return toString().equals(o.toString());
	}
}
