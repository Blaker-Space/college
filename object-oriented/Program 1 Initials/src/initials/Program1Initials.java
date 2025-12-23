/*Blake Mills
 * COSC 1337 001
 * 9/12/2023
 * Purpose: To practice using String methods and the Random.nextInt(int)
 * method by outputting various pieces of information from an array of 
 * strings, such as first, middle, last name and their lengths, to the
 * console (Program1Initials)
 * Insight: We pass "currentName.length()-4" as an argument for 
 * "getRandom.nextInt();" because the ".length()" method will
 * give the string's final index+1, and since the method ".nextInt(int)"
 * excludes the integer passed to it in its random number generation,
 * we must subtract 4 so that the highest possible random number is
 * the 5th index from the right. From this, ".substring(i1,i2)"
 * will include the character at i1 (5th from the right in the
 * case our random number generation is the highest int possible)
 * and exclude i2, so we must pass "i1+5" to get the char at
 * i1 plus the 4 chars to its right from the substring method.
 */
package initials;
import java.util.Random;
public class Program1Initials {

	public static void main(String[] args) {
		
		String[] strings = {"David Lee Alger","Kate Garry Hudson", 
				"Tina Stamatina Fey", "Hugh Mungo Grant",
				"Uma Karuna Thurman"};
		
		//This for loop iterates over every name given in the "strings" array
		for(int i=0;i<strings.length;i++) {
			
			/*Declaration of string variables including "currentName", which
			 * is initialized to sequentially store a single string from the
			 * "strings" array.
			 */ 
			String currentName, firstName, middleName, lastName, initials;
			currentName = strings[i];
			
			//Output the first name and appropriate length for current iteration
			firstName = currentName.substring(0,currentName.indexOf(" "));
			
			System.out.println("Your first name is " +firstName +
					" with a length of " +firstName.length());
			
			//Output the middle name and appropriate length for this iteration
			middleName = currentName.substring
					(currentName.indexOf(" ")+1,currentName.lastIndexOf(" "));
			
			System.out.println("Your middle name is " +middleName + 
					" with a length of " +middleName.length());
			
			//Output the last name and its length
			lastName = currentName.substring(currentName.lastIndexOf(" ")+1);
			
			System.out.println("Your last name is " +lastName +
					" with a length of " +lastName.length());
			
			//Output initials
			initials = "" +firstName.charAt(0) +middleName.charAt(0) +
					lastName.charAt(0);
			
			System.out.println("Your initials are " +initials +"." +
					" The length of your entire name is " +currentName.length());
			
			//Output random 5-letter sequence in name
			Random getRandom = new Random();
			int randomIndex = getRandom.nextInt(currentName.length()-4);
			
			System.out.println("A random sequence of 5 letters in your name is \"" +
					currentName.substring(randomIndex,randomIndex+5) +"\"");
			
			//Outputting two line breaks to clean up the console output
			System.out.println();
			System.out.println();
		}
	}
}
