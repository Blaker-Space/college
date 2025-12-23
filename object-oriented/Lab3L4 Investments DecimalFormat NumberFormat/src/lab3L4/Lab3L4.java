/*Blake Mills
 * COSC 1337 001
 * 9/15/2023
 * Purpose: To show a table holding the value of investments after
 * a certain number of years (Lab3L4)
 * Insight: NumberFormats are only used for currency or percentages.
 * If you want to format anything else, or if you want to format it
 * differently from the user's operating system, you need to use 
 * DecimalFormat.
 */
package lab3L4;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Scanner;

public class Lab3L4 {

	public static void main(String[] args) {
		//Inputs
		Scanner scanner = new Scanner(System.in);
		System.out.print("Please enter your investment amount: ");
		double investmentAmount = scanner.nextDouble();
		System.out.print("Please enter your interest rate (such as .065): ");
		double interestRate = scanner.nextDouble();
		
		//Processing
		double fiveYears = investmentAmount*Math.pow(1+interestRate,5);
		double tenYears = investmentAmount*Math.pow(1+interestRate,10);
		double fifteenYears = investmentAmount*Math.pow(1+interestRate,15);
		
		//Outputs
		NumberFormat percentFormat = NumberFormat.getPercentInstance();
		NumberFormat currencyFormat = NumberFormat.getCurrencyInstance();
		DecimalFormat otherCurrencyFormat = new DecimalFormat("$#0.00");
		
		System.out.println("Year\t\t\t\tValue");
		System.out.println("-------------------------------------");
		System.out.println("Initial\t\t\t\t"+
		otherCurrencyFormat.format(investmentAmount)+" at "
				+percentFormat.format(interestRate));
		System.out.println("5\t\t\t\t"+
		otherCurrencyFormat.format(fiveYears));
		System.out.println("10\t\t\t\t"+
		otherCurrencyFormat.format(tenYears));
		System.out.println("15\t\t\t\t"+
		otherCurrencyFormat.format(fifteenYears));
		scanner.close();
	}

}
