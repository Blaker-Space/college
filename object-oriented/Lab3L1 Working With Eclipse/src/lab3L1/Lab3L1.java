/*Blake Mills
 * COSC 1337 001
 * 8/30/2023
 * Purpose: To print out and modify some dates (Lab3L1)
 * Insight: Because the warOf1812Starts and theForgottenWarStarts
 * both reference the same object.
 */
package lab3L1;

public class Lab3L1 {

	public static void main(String[] args) {
		
		//Creating Dates
		SimpleDate teddyBearDebut = new SimpleDate(2,42,1903);
		SimpleDate pocahontasMarried = new SimpleDate(12,5,1614);
		SimpleDate yosemiteNamedNationalPark = new SimpleDate(6,10,1452);
		SimpleDate warOf1812Starts = new SimpleDate(12,12,1212);
		SimpleDate daveWinsAtTicTacToe = new SimpleDate(1,15,2020);
		SimpleDate defaultDate = new SimpleDate();
		
		//Modifying Dates
		teddyBearDebut.setDay(15);
		pocahontasMarried.setMonth(5);
		yosemiteNamedNationalPark.setYear(1752);
		
		//Using Constructors
		warOf1812Starts = new SimpleDate(6,17,1812);
		SimpleDate theForgottenWarStarts = warOf1812Starts;
		warOf1812Starts.setDay(18);
		
		//Using Accessors
		System.out.println(defaultDate.getMonth()+"/"+
		defaultDate.getDay()+"/"+defaultDate.getYear());
				
		System.out.println();
				
		//Using toString();
		System.out.println(teddyBearDebut);
		System.out.println(pocahontasMarried);
		System.out.println(yosemiteNamedNationalPark);
		System.out.println(warOf1812Starts);
		System.out.println(theForgottenWarStarts);
		System.out.println(daveWinsAtTicTacToe);
		System.out.println(defaultDate);
	}

}
