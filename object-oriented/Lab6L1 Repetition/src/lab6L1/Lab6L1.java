/*Blake Mills
 * COSC 1337 001
 * 9/25/2023
 * Purpose: To collect and validate Student information (Lab6L1)
 */
package lab6L1;

import java.util.Scanner;

public class Lab6L1 {

	public static void main(String[] args) {
		//create a Scanner and a String called name
		Scanner scanner = new Scanner(System.in);
		String name = "";
		
		//create a do while loop to read in Students
		do {
			System.out.print("Please enter a student's name: ");
			name = scanner.nextLine();
			//Only prompt the user for the rest of the data if
			//input != "done"
			if (!name.equals("done")) {
				System.out.print("Please enter the student's ID: ");
				String sid = scanner.nextLine();
				System.out.print("Please enter the student's GPA: ");
				double gpa = scanner.nextDouble();
				System.out.print("Please enter the student's number of hours: ");
				int numberOfHours = scanner.nextInt();
				
				//throw away white space
				scanner.nextLine();
				//create and print out the Student
				Student student = new Student(name,sid,gpa,numberOfHours);
				System.out.println(student);
			}
		}while(!name.equals("done"));
		
		scanner.close();
	}

}
