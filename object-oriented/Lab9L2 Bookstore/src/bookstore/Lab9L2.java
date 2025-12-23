/*Blake Mills
 * COSC 1337 001
 * 10/25/2023
 * Purpose: To handle inventory for a bookstore (Lab9L2)
 * Insight: for (int i=0;i<inventory.size();i++) {
			Book current = inventory.get(i);
			System.out.println(current);
		}
		2) In any situation where you need the index number as well -
		the enhanced for loop hides that as an extra detail.
 */
package bookstore;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

/**A class for demonstrating how ArrayLists of Books will work.
 * @author bmills5
 *
 */
public class Lab9L2 {

	/**The entry point for the program
	 * @param args NOT USED
	 * @throws FileNotFoundException if inventory.dat is not found.
	 */
	public static void main(String[] args) throws FileNotFoundException  {
		//Scanner to read the text file
		Scanner scanner = new Scanner(new File("inventory.dat"));
		//ArrayList to hold Books
		ArrayList<Book> inventory = new ArrayList<>();

		//Read from the file and create new Books
		while(scanner.hasNext()) {
			String title = scanner.nextLine();
			String author = scanner.nextLine();
			String priceString = scanner.nextLine();
			double price = Double.parseDouble(priceString);

			Book temporaryBook = new Book(title, author, price);
			inventory.add(temporaryBook);
		}

		scanner.close();

		//Change the price of the second Book
		Book temp = inventory.get(1);
		temp.setRetailPrice(0.0);

		//Enhanced for loop to print the Books
		for (Book current:inventory)
			System.out.println(current);

		//Enhanced for loop to update the price of each book
		for (Book current:inventory) {
			current.setRetailPrice(current.getRetailPrice()*1.1);
			System.out.println(current);
		}
	}
}
