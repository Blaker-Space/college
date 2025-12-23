/*Blake Mills
 * COSC 1337 001
 * 10/25/2023
 * Purpose: To receive the input of a radix and
 * an integer number from the user and return the
 * given number converted into decimal form. (Program3)
 * 
 */
package numberSystem;

import java.util.Scanner;
/**A class that asks the user to input a
 * radix and a number and returns the decimal
 * form of the given number. The class then
 * prompts the user to enter 'y' to convert
 * another number.
 * 
 * @author bmills5
 * 
 */
public class Program3NumberConversion {

	/**The entry point of this program
	 * 
	 * @param args NOT USED
	 */
	public static void main(String[] args) {
		//Create a scanner to get input from user
		Scanner scanner = new Scanner(System.in);

		//Declare response to act as loop condition
		String response = "";

		//Convert numbers while user response equals "y"
		do {
			//Declare sum, which holds the final decimal number
			int sum = 0;

			//Prompt for radix of number and read in radix
			System.out.print("Please enter the radix (base) of"+
					" your number (up to 16): ");
			int radix = scanner.nextInt();

			//Prompt and read in number itself
			System.out.print("Please enter a number: ");
			String inputNumber = scanner.next();

			//Declare place variable, which holds the current place
			//of the current digit. Set to 0 so that we start with
			//raising the radix to the power of 0 in our valueOfDigit
			//method.
			int place = 0;

			//Loop until all digits in inputNumber are processed
			for(int i = inputNumber.length()-1; i >= 0; i--) {

				//Get the current character of the inputNumber string
				char currentCharacter = inputNumber.charAt(i);

				//Convert currentCharacter into an integer
				int currentDigit = parseNumber(currentCharacter);

				//Add up the converted values of each digit, store in sum
				sum += valueOfDigit(place, radix, currentDigit);

				//Add 1 to place for next iteration
				place++;
			}

			//Output the converted number and prompt to enter 'y'
			//to convert more numbers
			System.out.println(inputNumber+" in base "+radix+
					" converts to "+sum+" in base 10.");
			System.out.print("Please enter \'y\' to convert "+
					"another number to decimal. Enter any other"+
					" character to terminate: ");

			//Read in user response and store in response
			response = scanner.next();

		}while(response.equalsIgnoreCase("y"));

		//Close the scanner since we are done receiving input
		scanner.close();
	}//end main

	/**A method that takes a given character and
	 * returns the integer equivalent of that
	 * character. If there is no integer equivalent,
	 * the method returns 0.
	 * 
	 * @param letter the letter to be parsed into an
	 * integer
	 * @return the integer equivalent of the character
	 * passed to the method
	 */
	public static int parseNumber(char letter) {
		switch(letter) {
		case '0':
			return 0;
		case '1':
			return 1;
		case '2':
			return 2;
		case '3':
			return 3;
		case '4':
			return 4;
		case '5':
			return 5;
		case '6':
			return 6;
		case '7':
			return 7;
		case '8':
			return 8;
		case '9':
			return 9;
		case 'a':
		case 'A':
			return 10;
		case 'b':
		case 'B':
			return 11;
		case 'c':
		case 'C':
			return 12;
		case 'd':
		case 'D':
			return 13;
		case 'e':
		case 'E':
			return 14;
		case 'f':
		case 'F':
			return 15;
		default:
			return 0;
		}//end switch

	}// end method parseNumber

	/**A method that converts a digit with a given base into
	 * decimal form.
	 * 
	 * @param place the place of the digit in the number
	 * @param radix the radix, or base, of the number being 
	 * converted
	 * @param number the digit occupying the given place in the number
	 * @return the decimal equivalent of the number
	 */
	public static int valueOfDigit(int place, int radix, int number) {

		//To get the converted value of a digit, we take the radix
		//and raise it to the power of the current place in the number
		//(e.g. 10^0 is the "one's" place for base-10) and multiply
		//that result by the number occupying that place
		int decimalValue = (int) (number*Math.pow(radix, place));
		return decimalValue;
	}//end method valueOfDigit

}// end class Program3NumberConversion