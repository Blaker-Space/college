/*Blake Mills
 * COSC 1337 001
 * 10/27/2023
 * Purpose: To translate grades from numbers to letters (Lab9L3)
 * Insight: 1) numberGrades.get(i) is an integer. When the character
 * '\t' is added to the integer, '\t' is transformed into its Unicode
 * value and added as is the next character in the output.
 * 2) int count = 0;
	  for (int grade:numberGrades)
		 System.out.println(grade+"\t"+letterGrades.get(count++));
 */
package lab9L3;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

/**A class that will transform number grades to letter grades
 * using its main method.
 * @author bmills5
 *
 */
public class Lab9L3 {

	/**The entry point for the program
	 * @param args NOT USED
	 * @throws FileNotFoundException if NumberGrades.txt is not found
	 */
	public static void main(String[] args) throws FileNotFoundException {
		ArrayList<Integer> numberGrades = readIntegers("NumberGrades.txt");
		//System.out.println(numberGrades);
		ArrayList<Character> letterGrades =
				numberGradesToLetterGrades(numberGrades);
		//System.out.println(letterGrades);
		for (int i=0;i<letterGrades.size();i++)
			System.out.println(numberGrades.get(i)+"\t"+
					letterGrades.get(i));
	}
	
	/**Transforms a list of number grades to a list of equal size
	 * of letter grades.
	 * 
	 * @param numberGrades the list of numeric grades
	 * @return the list of letter grades
	 */
	public static ArrayList<Character> 
	numberGradesToLetterGrades(ArrayList<Integer> numberGrades) {
		ArrayList<Character> letterGrades = new ArrayList<>();
		for (int numberGrade:numberGrades)
			letterGrades.add(getLetterGrade(numberGrade));
		return letterGrades;
	}
	
	/**Gets a single letter grade from a single number grade
	 * using a ten point scale.
	 * @param numberGrade the numeric grade from which to get a 
	 * letter grade.
	 * @return the letter grade ('A','B','C','D','F')
	 */
	public static Character getLetterGrade(int numberGrade) {
		if (numberGrade>=90) return 'A';
		if (numberGrade>=80) return 'B';
		if (numberGrade>=70) return 'C';
		if (numberGrade>=60) return 'D';
		return 'F';
	}

	/**Reads in a list of integers from filename and returns them
	 * as an ArrayList
	 * @param filename The name of the file to read from
	 * @return the ArrayList of integers
	 * @throws FileNotFoundException if the file named filename cannot
	 * be found
	 */
	public static ArrayList<Integer> readIntegers(String filename) 
			throws FileNotFoundException {
		ArrayList<Integer> input = new ArrayList<>();
		Scanner scanner = new Scanner(new File(filename));
		while (scanner.hasNext())
			input.add(scanner.nextInt());
		scanner.close();
		return input;
	}
}
