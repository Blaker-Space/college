/*Blake Mills
 * COSC 1337 001
 * 9/18/2023
 * Purpose: To practice simple selection (Lab5L1)
 * Insight: 1) It would not change the execution of the program at all since
 * the line after the break ends the switch.
 * 2) It is wise to include the default case as the final case because unlike
 * other cases, it deals with several different inputs instead of just one.
 */
package lab5L1;

import java.util.Scanner;

public class Lab5L1 {

	public static void main(String[] args) {
		//establish some variables
		String userID = "correctID";
		String password = new String("correctPassword");
		
		//get input from user
		Scanner scanner = new Scanner(System.in);
		System.out.print("Please enter your user ID and password, "+
				"separated by a space: ");
		
		String userIDAttempt = scanner.next();
		String passwordAttempt = scanner.next();
		scanner.nextLine();
		
		//get the result of the login
		if (userID.equals(userIDAttempt)) {
			if(password.equals(passwordAttempt))
				System.out.println("Welcome!");
			else
				System.out.println("Incorrect Password!");
		}
		else if(password.equals(passwordAttempt))
			System.out.println("Incorrect User ID");
		else
			System.out.println("Incorrect User ID and Password");
		
		//use a switch
		System.out.print("Please enter 1, 6, or 7: ");
		switch(scanner.nextInt()) {
		case 1: 
			System.out.println("You entered one.");
		case 7:
			System.out.println("You entered seven.");
			break;
		default:
			System.out.println("You entered something other than 1, 6, or 7.");
			break;
		case 6: 
			System.out.println("You entered six.");
			break;
		}
		scanner.close();
	}
}
