/*Blake Mills
 * COSC 1337 001
 * 11/13/2023
 * Purpose: To test our EmployeeSystem (Lab10L4)
 */
package employeeSystem;

import java.io.File;
import java.io.IOException;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Scanner;

/**Class to test our Employees
 * @author bmills5
 *
 */
public class EmployeeSystem {

	/**The entry point for the program. Tests Employees.
	 * @param args NOT USED
	 * @throws IOException if an IOException is encountered
	 */
	public static void main(String[] args) throws IOException {
		//Declare type to hold Employee type
		String type;
		//Create an ArrayList of Employee data types
		ArrayList<Employee> listOfEmployees = new ArrayList<>();
		//Scanner object to read the file
		Scanner fileScanner = new Scanner(new File("employees.dat"));
		//NumberFormat object to format currency
		NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance();

		//Read from the file as long as there is data in the file
		while(fileScanner.hasNext()) {
			type = fileScanner.next();
			type = type.toUpperCase();
			//switch statement to instantiate appropriate
			//employee type and add to the ArrayList
			switch(type) {
			case "S":
				listOfEmployees.add(new SalariedEmployee
						(fileScanner.next(),fileScanner.next(),
								fileScanner.next(),fileScanner.nextDouble()));
				break;
			case "C":
				listOfEmployees.add(new CommissionedEmployee
						(fileScanner.next(), fileScanner.next(),
								fileScanner.next(), fileScanner.nextDouble()));
				break;
			case "H":
				listOfEmployees.add(new HourlyEmployee
						(fileScanner.next(), fileScanner.next(),
								fileScanner.next(), fileScanner.nextDouble()));
				break;
			default:
				System.out.println("Employee type is not valid");
			}//end of switch (type)
		}//end of while has next line

		fileScanner.close();

		//Declare a variable to hold hours and gross sales
		double input;
		Scanner scanner = new Scanner(System.in);
		for (Employee currentEmployee:listOfEmployees) {
			//If the object is currently referencing is an HourlyEmployee
			//prompt for number of hours, read number of hours, and set the
			//number of hours
			if(currentEmployee instanceof HourlyEmployee) {
				System.out.print("Please enter the number of hours "+
						currentEmployee.getFirstName()+ " "+
						currentEmployee.getLastName()+" worked this month: ");
				input = scanner.nextDouble();
				((HourlyEmployee) currentEmployee).setHours(input);
			}//end of HourlyEmployee keyboard input
			if (currentEmployee instanceof CommissionedEmployee) {
				System.out.print("Please enter the sales for "+
						currentEmployee.getFirstName()+" "
						+currentEmployee.getLastName()+": ");
				input = scanner.nextDouble();
				((CommissionedEmployee)currentEmployee).setGrossSales(input);
			}//end of CommissionedEmployee keyboard input
		}//end of for each Employee
		scanner.close();
		
		//process the payroll on all employee types
		System.out.println("\n\nEmployee Payroll:\n");
		for (Employee currentEmployee:listOfEmployees)
			System.out.println(currentEmployee+"\nEarnings:\n"+
					currencyFormatter.format(currentEmployee.getEarnings())+
					"\n");
	}//end of main
}//end of EmployeeSystem
