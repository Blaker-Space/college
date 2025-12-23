/*Blake Mills
 * COSC 1337 001
 * 10/25/2023
 * Purpose: To encapsulate information about a Book (Lab9L2)
 */
package bookstore;

/**A class that encapsulates data about a Book including
 * the author, title and retail price.
 * 
 * @author bmills5
 *
 */
public class Book {
	/**The title of this Book*/
	private String title;
	/**The author of this Book*/
	private String author;
	/**The retail price of this Book*/
	private double retailPrice;

	/**Creates a new Book and sets the title
	 * and author to empty strings and sets
	 * retailPrice to 0.0
	 * 
	 */
	public Book() {
		setTitle("");
		setAuthor("");
		setRetailPrice(0.0);
	}

	/**Creates a new Book with the input information
	 * 
	 * @param title The title of the new Book
	 * @param author The author of the new book
	 * @param retailPrice The retail price of the new book
	 */
	public Book(String title, String author, double retailPrice) {
		setTitle(title);
		setAuthor(author);
		setRetailPrice(retailPrice);
	}

	/**Gets the title of the Book
	 * 
	 * @return the title of the Book
	 */
	public String getTitle() {
		return this.title;
	}

	/**Sets the title of the Book
	 * 
	 * @param title the new title of the Book
	 */
	public void setTitle(String title) {
		this.title = title;
	}

	/**Gets the author of the Book
	 * 
	 * @return the author of the Book
	 */
	public String getAuthor() {
		return this.author;
	}

	/**Sets the author of the Book
	 * 
	 * @param author the new author of the Book
	 */
	public void setAuthor(String author) {
		this.author = author;
	}

	/**Gets the retail price of the Book
	 * 
	 * @return the retail price of the Book
	 */
	public double getRetailPrice() {
		return this.retailPrice;
	}

	/**Sets the retail price of the Book
	 * 
	 * @param retailPrice the new retail price of the Book
	 */
	public void setRetailPrice(double retailPrice) {
		this.retailPrice = retailPrice;
	}

	/**Returns a String representation of this Book
	 * 
	 * @return the String representation of this Book
	 */
	@Override
	public String toString(){
		return "Title: " + getTitle() + "\tAuthor: " + getAuthor() +
				"\tPrice: "+ getRetailPrice();
	}

	/**Returns true iff the input Book has the same data
	 * as this Book
	 * 
	 * @param o the Object to compare this Book to
	 * @return true iff the two Books have the same data
	 */
	@Override
	public boolean equals(Object inputObject) {
		return toString().equals(inputObject.toString());
	}
}
