/**
 * 
 * @author Blake Mills
 * 11/16/2025
 * COSC 3325 - Programming Assignment 2
 * 
 * The purpose of this class is to compare the number of comparisons it takes for three
 * different sorting algorithms to sort four different sized arrays filled with
 * pseudo-random integers. The program starts by creating 4 different integer arrays with
 * 4 different sizes: 10, 100, 1000, and 10000. It then loads each with random integers, and
 * proceeds to run an insertion sort on each array outputting the number of integers in the
 * array as well as the number of comparisons required for the sort. The class then goes on to
 * fill the 4 arrays with pseudo-random integers again and runs a merge sort on the data also
 * outputting the number of integers in each array as well as comparisons it took to sort. It then
 * repeats this same process a third time for quick sort.
 */
import java.util.Random;


public class SortingAlgorithms2 {
    private static long counter = 0; // counter used to keep track of the number of comparisons in each algoritm
    private static String finalArrayString = ""; // string to hold the unsorted and sorted 100-element arrays for output
    public static void main(String[] args) throws Exception {
        int [] array10 = new int[10]; // a 10-integer array that holds random integers to be sorted
        int [] array100 = new int[100]; // a 100-integer array that holds random integers to be sorted
        int [] array1000 = new int[1000]; // a 1000-integer array that holds random integers to be sorted
        int [] array10000 = new int[10000]; // a 10,000-integer array that holds random integers to be sorted
        
        finalArrayString += "Unsorted array for Insertion Sort:\n";
        //load each array with random integers for insertion sort
        loadArrayWithRandoms(array10);
        loadArrayWithRandoms(array100);
        loadArrayWithRandoms(array1000);
        loadArrayWithRandoms(array10000);

        // perform insertion sort on each array
        System.out.println("SORTING ALGORITHM: Insertion Sort\n");
        performInsertionSort(array10);
        performInsertionSort(array100);
        performInsertionSort(array1000);
        performInsertionSort(array10000);

        finalArrayString += "\nUnsorted array for Merge Sort:\n";
        //load each array with random integers for Merge sort
        loadArrayWithRandoms(array10);
        loadArrayWithRandoms(array100);
        loadArrayWithRandoms(array1000);
        loadArrayWithRandoms(array10000);

        // perform a Merge sort on each array
        System.out.println("SORTING ALGORITHM: Merge Sort\n");
        array10 = performMergeSort(array10);
        printData(array10, counter);
        counter = 0;
        array100 = performMergeSort(array100);
        printData(array100, counter);
        counter=0;
        array1000 = performMergeSort(array1000);
        printData(array1000, counter);
        counter = 0;
        array10000 = performMergeSort(array10000);
        printData(array10000, counter);
        counter = 0;

        finalArrayString += "\nUnsorted array for Quick Sort:\n";
        //load each array with random integers for a Quick sort
        loadArrayWithRandoms(array10);
        loadArrayWithRandoms(array100);
        loadArrayWithRandoms(array1000);
        loadArrayWithRandoms(array10000);

        //perform Quick sort on each array
        System.out.println("SORTING ALGORITHM: Quick Sort\n");
        performQuickSort(array10);
        counter = 0;
        performQuickSort(array100);
        counter = 0;
        performQuickSort(array1000);
        counter = 0;
        performQuickSort(array10000);

        System.out.println(finalArrayString);
    }// end main

    /**
     * Performs a Merge sort on the array passed to it followed by outputting the number of integers in the array and the
     * number of comparisons it took to sort the array
     * @param array the array to sort
     */
    public static int[] performMergeSort(int[] array){
        // base case (for recursion): if the array is null or has 1 or fewer elements, it is already sorted
        if(array == null || array.length <= 1){
            return array;
        }

        int middle = array.length / 2; // finds middle index of the array
        int[] leftArray = new int[middle]; // holds the left sub-array
        int[] rightArray = new int[array.length - middle]; // holds the right sub-array

        // copy elements into left sub array
        for (int i = 0; i < middle; i++) {
            leftArray[i] = array[i];
        }
        // copy elements into right sub array
        for(int j = 0; j < array.length - middle; j++){
            rightArray[j] = array[middle + j];
        }

        // perform merge sort recursively on both sub-arrays (this runs until base case is met)
        performMergeSort(leftArray);
        performMergeSort(rightArray);

        // merge the two sub-arrays into the main array
        merge(array, leftArray, rightArray);

        return array; // return the sorted array
    } // end performMergeSort

    /**
     * This is a helper method for the performMergeSort method. The purpose of
     * this method is to merge two sorted sub-arrays into one, sorted array by comparing elements
     * between the two sub-arrays.
     * @param array the array to merge the two sub-arrays into
     * @param left the left sub-array
     * @param right the right sub-array
     */
    private static void merge(int[] array, int[] left, int[] right) {
        int i=0; // index for left sub-array position
        int j=0; // index for right sub-array position
        int k=0; // index for main array position

        // while there are still elements in both sub-arrays to compare, compare the sizes of
        // the next two elements and insert the smaller integer
        while(i< left.length && j < right.length){
            // if the left element is less than or equal to the right element, insert it!
            if(left[i] <= right[j]){
                array[k] = left[i];
                i++;
            } // end if
            // if the right element is less than the left element, insert it!
            else {
                array[k] = right[j];
                j++;
            } // end else

            counter++; // increment the comparison count
            k++; // increment the main array index
        } // end while

        // if there are remaining elements in the left sub-array, add them to the main array
        while(i < left.length){
            array[k] = left[i];
            i++;
            k++;
        }// end while
        // if there are remaining elements in the right sub-array, add them to the main array
        while(j < right.length){
            array[k] = right[j];
            j++;
            k++;
        }// end while
    }// end merge

    /**
     * Performs a Quick sort on the array passed to it followed by 
     * outputting the number of integers in the array and the
     * number of comparisons it took to sort the array
     * @param array the array to sort
     */
    public static void performQuickSort(int[] array){
        // call the quickSort method to sort the array
        quickSort(array, 0, array.length - 1);
        // print out the data about the sort
        printData(array, counter);
    }// end performQuickSort

    /**
     * The main Quick sort algorithm that recursively sorts the array by partitioning it
     * and sorting the partitions
     * @param a the array to sort
     * @param l the left index
     * @param r the right index
     */
    public static void quickSort(int[] a, int l, int r){
        int s; // define an integer for the partition index

        // if the left index is less than the right index
        // partition the array and sort the partitions
        if(l < r){
            // partition the array and get the partition index
            s = partition(a,l,r);
            // recursively sort the left partition
            quickSort(a,l,s-1);
            // recursively sort the right partition
            quickSort(a,s+1,r);
        } // end if
    }// end quickSort

    /**
     * Partitions the array into two sub-arrays based on a pivot value
     * @param a the array to partition
     * @param l the left index
     * @param r the right index
     * @return the partition index
     */
    private static int partition(int[] a, int l, int r){
        // define pivot, index i, index j, and a temporary variable
        int p, i, j, temp;

        // set the pivot to the leftmost element
        p = a[l];
        // set i to the left index and j to the right index + 1
        i = l;
        j = r + 1;
        // loop indefinitely
        while (true) {
            do {
                // increment i and the comparison counter 
                i = i + 1;
                counter = counter + 1;
                // while the element at index i is less than the pivot
                // and i is less than or equal to the right index
            } while (i <= r && a[i] < p);
            do {
                // decrement j and increment the comparison counter
                j = j - 1;
                counter = counter + 1;
                // while the element at index j is greater than the pivot
                // and j is greater than or equal to the left index
            } while (j >= l && a[j] > p);
            // if i is greater than or equal to j, break the loop
            if (i >= j) {
                break;
            }// end if
            // swap the elements at index i and j
            temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }// end while
        // swap the pivot element with the element at index j
        temp = a[l];
        a[l] = a[j];
        a[j] = temp;
        // return the partition index
        return j;
    } // end partition
    
    /**
     * Performs an insertion sort on the array passed to it 
     * followed by outputting the number of integers in the array
     * and the number of comparisons it took to sort the array
     * @param array the array to sort
     */
    public static void performInsertionSort(int[] array){
        // for each element in the array starting from index 1
        for (int i = 1; i < array.length; i++) {
            
            int key = array[i]; // store the current element as key
            int j = i - 1; // set j to the index before i

            // for each element before the key
            // compare it to the key and shift elements as needed
            while (j >= 0) {
                counter++; // increment comparison counter
                // if the element at index j is greater than the key
                if (array[j] > key) {
                    array[j + 1] = array[j]; // shift element at j to the right
                    j--; // decrement j to compare with the next element
                } //end if            counter++; // increment comparison count for the first comparison
                else {
                    break; // exit loop if the correct position for key is found
                }// end else
            }// end while
            array[j + 1] = key; // place key in its correct position
        }// end for
        // print out the data about the sort
        printData(array, counter);
        counter = 0; // reset counter for next sort
    }// end performInsertionSort

    /**
     * Loads the integer array arrayToLoad (of any size) with pseudo-random integers up to Integer.MAX_VALUE
     * @param arrayToLoad the specified array to be loaded
     */
    public static void loadArrayWithRandoms(int[] arrayToLoad){
        
        // declare a new Random variable named randy
        Random randy = new Random();
        // for each index of the array
        for(int i=0;i<arrayToLoad.length;i++){
            //place a pseudo-random integer in the index's spot from 0 to Integer.MAX_VALUE
            arrayToLoad[i] = randy.nextInt(Integer.MAX_VALUE);
            // if this is the 100-element array, add to our final output string of unsorted arrays
            if(arrayToLoad.length == 100){
                if(i==0) finalArrayString += "[ ";
                finalArrayString += arrayToLoad[i] + ", ";
                if(i==99) finalArrayString += " ]";
            }// end if
        }// end for
    }// end loadArrayWithRandoms

    /**
     * Prints out data about a sort, including the sorting algorithm used,
     * number of values in the array, and number of comparisons required to sort
     * @param sortType the type of sorting algorithm used
     * @param array the array that was sorted
     * @param comparisons the number of comparisons required to sort the array
     */
    public static void printData(int[] array, long comparisons){
        System.out.println("Size of array: "+array.length);
        System.out.println("Number of comparisons made: " + comparisons + "\n");
        // if this is the 100-element array, add to our final output string of sorted arrays
        if(array.length == 100){
            finalArrayString += "\nSorted array:\n[ ";
            for(int i=0;i<array.length;i++){
                finalArrayString += array[i] + ", ";
            }
            finalArrayString += " ]\n";
        }// end if
    }// end printData
}// end class SortingAlgorithms2