/*Blake Mills
 * COSC 1337 001
 * 9/27/2023
 * Purpose: To test the Car class (Lab7L1)
 */
package automobiles;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Scanner;

public class Lab7L1 {

	public static void main(String[] args) {
		//create a sample car
		Car gasGuzzler = new Car("Trailblazer",7000,437.5);

		//print out the mileage per gallon for this Car
		double mileage = gasGuzzler.getMilesPerGallon();
		DecimalFormat decimalFormat = new DecimalFormat("0.0");
		System.out.println("Mileage for this car: "+
				decimalFormat.format(mileage)+"mpg.");

		//print out the gas cost for this car
		double totalGasCost = gasGuzzler.getMoneySpentOnGas(2.79);
		NumberFormat moneyFormatter = NumberFormat.getCurrencyInstance();
		System.out.println("Gas cost for this car: "+
				moneyFormatter.format(totalGasCost));

		//initialize a Scanner and modelName
		Scanner in = new Scanner(System.in);
		String modelName = "";

		//do/while modelName != done
		do {
			//prompt for and read modelName
			System.out.print("Enter a model name or \"done\" if you "+
					"are done: ");
			modelName = in.nextLine();

			//if modelName is not "done", continue processing this car
			if(!modelName.equals("done")) {
				//prompt for and read milesDriven and gasUsed
				System.out.print("Enter the number of miles driven: ");
				int milesDriven = in.nextInt();
				System.out.print("Enter the gallons of gas used: ");
				double gasUsed = in.nextDouble();

				//create a Car named tempCar with the input information
				Car tempCar = new Car(modelName,milesDriven,gasUsed);

				//output the mileage per gallon and the gas cost for tempCar
				System.out.println("Mileage for "+tempCar.getModel()+
						": "+decimalFormat.format(tempCar.getMilesPerGallon())+
						" mpg.");
				System.out.println("Gas cost for "+tempCar.getModel()+": "+
						moneyFormatter.format(tempCar.getMoneySpentOnGas(3.19)));

				//throw away whitespace
				in.nextLine();
			}

		} while (!modelName.equals("done"));
		in.close();
	}
}
