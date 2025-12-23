/**
 * 
 * @author Blake Mills
 * 10/26/2025
 * COSC 3325 - Programming Assignment 1
 * 
 * This purpose of this class is to compare the number of comparisons it takes for three
 * different sorting algorithms to sort four different sized arrays of filled with
 * pseudo-random integers. The program starts by creating 4 different integer arrays with
 * 4 different sizes: 10, 100, 1000, and 10000. It then loads each with random integers, and
 * and proceeds to run a bubble sort on each array outputting the number of integers in the
 * array as well as the number of comparisons required for the sort. The class then goes on
 * fill the 4 arrays with pseudo-random integers again and runs a comb sort on the data also
 * outputting the number of integers in each array as well as comparisons to sort. It then
 * repeats this same process a third time for selection sort.
 */
import java.util.Random;

public class SortingAlgorithms {
    public static void main(String[] args) throws Exception {
        int [] array10 = new int[10]; // a 10-integer array that holds random integers to be sorted
        int [] array100 = new int[100]; // a 100-integer array that holds random integers to be sorted
        int [] array1000 = new int[1000]; // a 1000-integer array that holds random integers to be sorted
        int [] array10000 = new int[10000]; // a 10,000-integer array that holds random integers to be sorted

        //load each array with random integers for bubble sort
        loadArrayWithRandoms(array10);
        loadArrayWithRandoms(array100);
        loadArrayWithRandoms(array1000);
        loadArrayWithRandoms(array10000);

        // perform enhanced bubble sort on each array
        System.out.println("SORTING ALGORITHM: Bubble Sort");
        performBubbleSort(array10);
        performBubbleSort(array100);
        performBubbleSort(array1000);
        performBubbleSort(array10000);

        //load each array with random integers for comb sort
        loadArrayWithRandoms(array10);
        loadArrayWithRandoms(array100);
        loadArrayWithRandoms(array1000);
        loadArrayWithRandoms(array10000);

        // perform a comb sort on each array
        System.out.println("SORTING ALGORITHM: Comb Sort");
        performCombSort(array10);
        performCombSort(array100);
        performCombSort(array1000);
        performCombSort(array10000);

        //load each array with random integers for a selection sort
        loadArrayWithRandoms(array10);
        loadArrayWithRandoms(array100);
        loadArrayWithRandoms(array1000);
        loadArrayWithRandoms(array10000);

        //perform selection sort on each array
        System.out.println("SORTING ALGORITHM: Selection Sort");
        performSelectionSort(array10);
        performSelectionSort(array100);
        performSelectionSort(array1000);
        performSelectionSort(array10000);

    }// end main

    /**
     * Performs a comb sort on the array passed to it followed by outputting the number of integers in the array and the
     * number of comparisons it took to sort the array
     * @param array the array to sort
     */
    public static void performCombSort(int[] array){

        int comparisons = 0; // the number of comparisons the comb sort algorithm makes
        int tally = array.length; // set tally as the length of the array
        int gap = tally; // set the first gap as tally (length of array)
        boolean swapped = true; // declare a boolean to keep track of whether a swap occurs
        //continue until the array is sorted (either no swapped or gap is 1)
        while(swapped || gap > 1){
            gap = Math.max((int) (gap/1.3),1); // set gap to either 1 or the integer of gap/1.3 if it's greater than 1
            swapped=false;
            // for the whole array up until i plus the current gap distance is equal to the array length
            for(int i=0;i+gap<tally;i++){
                //set j as the gap distance from i
                int j = i+gap;
                //if element at i is greater than element at j, swap them
                if(array[i]>array[j]){
                    int temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                    // and set swapped to true
                    swapped=true;
                } // end if
                //increment our comparisons since we completed a comparison in the if statement
                comparisons++;
            } // end for
        } // end while
        //print out stats for this sort
        System.out.println("Number of values in array: "+array.length);
        System.out.println("Number of comparisons required: "+comparisons+"\n");
    } // end performCombSort

    /**
     * Performs a selection sort on the array passed to it followed by outputting the number of integers in the array and the
     * number of comparisons it took to sort the array
     * @param array the array to sort
     */
    public static void performSelectionSort(int[] array){
        int comparisons = 0; //the number of comparisons the algorithm performs
        int n = array.length; // store the length of the array in n

        // iterate over the entire array
        for(int i=0; i<n;i++){
            // start at i as the lowest number in the array
            int minNumIndex = i;

            // for one element ahead of i up until the end of the array, check if elements are smaller
            for(int j = i+1; j<n;j++){
                // if the current index at j is less than what the current minimum is,
                if(array[j]< array[minNumIndex]){
                    // set the current index as the new minimum
                    minNumIndex = j;
                }// end if
                // increment comparisons since we performed a comparison inside the if statement
                comparisons++;

            }// end for

            //swap the minimum element with the first element of the part of the array that is unsorted
            int temp = array[minNumIndex];
            array[minNumIndex] = array[i];
            array[i] = temp;
        }// end for
      //print out the stats for this sort
      System.out.println("Number of values in array: "+array.length);
      System.out.println("Number of comparisons required: "+comparisons+"\n");
    }// end performSelectionSort

    /**
     * Performs an enhanced bubble sort on the array passed to it followed by outputting the number of integers in the array and the
     * number of comparisons it took to sort the array
     * @param array the array to sort
     */
    public static void performBubbleSort(int[] array){
        // set a count integer variable to the length of the array
        int count = array.length;

        int comparisons = 0; // will store the number of comparisons that occurred during the sort
        boolean sflag = true; // define a boolean to determine if a swap occurs
        
        // while there is a swap that has occurred...
        while (sflag){

            // first, set the swap flag to false
            sflag=false;

            // iterate from the starting of the array to the current ending position
            for (int j = 0; j<count-1;j++){

                //if the integer that is one spot ahead of j is smaller than the integer at j
                if (array[j+1] < array[j]){
                    // swap the two integers
                    int temp = array[j+1];
                    array[j+1] = array[j];
                    array[j] = temp;

                    // set the swap flag to true since we performed a swap
                    sflag = true;   
                }// end if

                //increment comparisons since we made a comparison in the if statement
                comparisons++;
            }// end for
            // decrement count since we know the largest integer for this pass is in place
            count--;
        }// end while
        // print out the number of values in the array
        System.out.println("Number of values in array: "+array.length);
        // output the number of comparisons that occurred
        System.out.println("Number of comparisons required: "+ comparisons+"\n");
    }// end performBubbleSort

    /**
     * Loads the integer array arrayToLoad of any size with pseudo-random integers up to Integer.MAX_VALUE
     * @param arrayToLoad the specified array to be loaded
     */
    public static void loadArrayWithRandoms(int[] arrayToLoad){
        // declare a new Random variable named rand
        Random rand = new Random();
        // for each index of the array
        for(int i=0;i<arrayToLoad.length;i++){
            //place a pseudo-random integer in the index's spot from 0 to Integer.MAX_VALUE
            arrayToLoad[i] = rand.nextInt(Integer.MAX_VALUE);
        }// end for
    }// end loadArrayWithRandoms
}// end class SortingAlgorithms
