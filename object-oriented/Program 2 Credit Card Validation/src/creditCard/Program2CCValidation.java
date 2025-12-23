/*Blake Mills
 * COSC 1337 001
 * 10/5/2023
 * Purpose: To practice validating user input by defining
 * Program2CCValidation, which takes input from the user
 * in the form of a 16-digit number and checks whether or
 * not the entry is a valid credit card number using
 * the Luhn Algorithm. (Program2CCValidation)
 * Insight:
 */
//4556737586899855
package creditCard;

import java.util.Scanner;

public class Program2CCValidation {

	public static void main(String[] args) {
		//set up a Scanner
		Scanner userInput = new Scanner(System.in);

		//set up a boolean named validCreditCard and set it to false       
		boolean validCreditCard = false;

		//loop while not a valid credit card  
		while(!validCreditCard) {

			//prompt the user for a potential credit card number                     
			System.out.print("Please enter your 16-digit credit card number: ");

			//Get the credit card number as a String - store in potentialCCN 
			//(use scanner's nextLine)
			String potentialCCN = userInput.nextLine();

			//use Luhn to validate credit card using the following steps:
			//store the last digit AS AN INT for later use in lastDigit 
			//(probably requires Integer.parseInt(String)
			int lastDigit = Integer.parseInt
					(potentialCCN.substring(potentialCCN.length()-1));

			//TEST then comment out! - check the last digit - 
			//System.out.println(lastDigit);

			//remove the last digit from potentialCCN and store in 
			//potentialCCN using String's substring
			potentialCCN = potentialCCN.substring(0, potentialCCN.length()-1);

			//TEST then comment out! - check potentialCCN - 
			//System.out.println(potentialCCN);

			//create reversedCCN as a empty String by:
			String reversedCCN = "";
			//reversing the digits using a for loop by adding characters to reversedCCN
			for(int i=potentialCCN.length()-1; i>=0;i--)
				reversedCCN += potentialCCN.charAt(i);

			//end the reverse the string loop
			//TEST then comment out! - check reversedCCN - 
			//System.out.println(reversedCCN);
			//set boolean isOddDigit to false
			boolean isOddDigit = false;

			//set up an integer called current digit and set it to 0
			int currentDigit = 0;

			//create an integer named sum and set it to 0
			int sum = 0;

			//multiply the digits in odd positions by 2, then subtract

			//9 from any number higher than 9 using:
			//(for loop running 0 to less than length of reversed CCN)
			for (int i = 0; i < reversedCCN.length();i++) {
				//set currentDigit equal to the integer version of the current character
				currentDigit = Integer.parseInt(reversedCCN.substring(i,i+1));

				//Test then comment out! - currentDigit -
				//System.out.print(currentDigit);
				//toggle isOddDigit (like a light switch - if it is true, make it false.
				//If it is false, make it true)
				if (isOddDigit==true) {
					//multiply currentDigit by 2 and store in currentDigit
					currentDigit *= 2;
					//if currentDigit > 9, subtract 9 from currentDigit and store in currentDigit
					if (currentDigit>9)
						currentDigit -= 9;

					isOddDigit = false;
				}
				//TEST then comment out - Check currentDigit - 
				//System.out.println(currentDigit);

				//end if isOddDigit
				else
					isOddDigit = true;
				//Comment in this segment for a useful test output string
				//Valid Input: 4556737586899855
				//System.out.print(currentDigit);
				System.out.print(currentDigit);
			}
			System.out.println();

			//if (i>=reversedCCN.length()-1)

			//System.out.println();

			//else

			//System.out.print(" + ");

			//end of segment



			// add currentDigit to sum and store in sum 



			//end the for loop that runs from 0 to less than the length of reversed CCN     

			//TEST and comment out -  System.out.println("sum:"+sum);



			//if the last digit of sum + the last Digit ends in a zero, set validCreditCard to true



			//end if

			//if validCreditCard is false, output an appropriate message



			//end if

			//end while that checks for valid credit card



			//issue a RANDOM PIN and print it out
		}
		userInput.close();
	}

}
