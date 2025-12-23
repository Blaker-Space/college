import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class WorldTemps {

	public static void main(String[] args){

		LinkedList tempList = new LinkedList();
		String dataFile = "city_temperature.csv";

		//Fill our tempList by calling importFile
		importFile(tempList,dataFile);

		//Maximum and minimum temperatures of entire list of data
		reading maxTemp = findMax(tempList);
		reading minTemp = findMin(tempList);
		outputMaxAndMin(maxTemp,minTemp);

		//Maximum and minimum temperatures read in Texas
		maxTemp = findMax(tempList,"State","Texas");
		minTemp = findMin(tempList,"State","Texas");
		outputMaxAndMin(maxTemp,minTemp);

		//Maximum and minimum temperatures read in Tennessee
		maxTemp = findMax(tempList,"State","Tennessee");
		minTemp = findMin(tempList,"State","Tennessee");
		outputMaxAndMin(maxTemp,minTemp);

		//Maximum and minimum temperatures read in Knoxville, TN
		maxTemp = findMax(tempList,"City","Knoxville");
		minTemp = findMin(tempList,"City","Knoxville");
		outputMaxAndMin(maxTemp,minTemp);

		//Maximum and minimum temps read in 1995
		maxTemp = findMax(tempList,"Year","1995");
		minTemp = findMin(tempList,"Year","1995");
		outputMaxAndMin(maxTemp,minTemp);

		//Maximum and minimum temps read in 2020
		maxTemp = findMax(tempList,"Year","2020");
		minTemp = findMin(tempList,"Year","2020");
		outputMaxAndMin(maxTemp,minTemp);

		//Maximum and minimum temps read in December
		maxTemp = findMax(tempList,"Month","12");
		minTemp = findMin(tempList,"Month","12");
		outputMaxAndMin(maxTemp,minTemp);

		//Maximum and minimum temps read in August
		maxTemp = findMax(tempList,"Month","8");
		minTemp = findMin(tempList,"Month","8");
		outputMaxAndMin(maxTemp,minTemp);

		//Maximum and minimum temps read in South/Central America & caribbean
		maxTemp = findMax(tempList,"Region","South/Central America & Carribean");
		minTemp = findMin(tempList,"Region","South/Central America & Carribean");
		outputMaxAndMin(maxTemp,minTemp);

		//Maximum and minimum temps read in Russia
		maxTemp = findMax(tempList,"Country","Russia");
		minTemp = findMin(tempList,"Country","Russia");
		outputMaxAndMin(maxTemp,minTemp);
	}

	private static void importFile(LinkedList dataList, String fileToImport){
		try {
			long count = 0;
			//Create a FileReader to read from fileToImport
			FileReader fr = new FileReader(fileToImport);
			//Create a BufferedReader to read from fr
			BufferedReader br = new BufferedReader(fr);
			//Read in a line of data from bufferedReader, throw out first line of titles
			String lineOfData = br.readLine();
			lineOfData = br.readLine();
			String parseBy = ",";
			//while our next line of data is not equal to null
			while(lineOfData != null) {
				count++;
				//create a String array to hold a new line of data, split each line by parseBy
				String [] data = lineOfData.split(parseBy);
				//create a new reading with the data from this data's String array
				reading currentReading = new reading(data[0],data[1],data[2],data[3],
						Integer.parseInt(data[4]),Integer.parseInt(data[5]),
						Integer.parseInt(data[6]),Double.parseDouble(data[7]));
				dataList.add(currentReading);
				lineOfData = br.readLine();
			}
			System.out.printf("File: %s\n%d lines read\n"
					+ "------------------------------------------------------------------",
					fileToImport,count);
			br.close();
			fr.close();
		} catch(IOException e) {
			System.out.println("File Error\n" + e);
		}
	}

	private static reading findMin(LinkedList tempList) {
		System.out.print("Looking for minimum average temperature of all data...\n");
		tempList.resetCurrent();
		reading minReading = tempList.getFirst();
		reading current = tempList.getNextElement();

		if (minReading.getAvgTemp() == -99) {
			minReading.setAvgTemp(999);
		}

		while(current != null) {
			if((current.getAvgTemp() != -99) && current.getAvgTemp()<minReading.getAvgTemp()) {
				minReading = current;
			}
			current = tempList.getNextElement();
		}
		return minReading;
	}

	private static reading findMin(LinkedList tempList, String category, String categoryValue) {
		int key = 0;
		if(category.equalsIgnoreCase("Region")){
			key = 1;
		}
		else if(category.equalsIgnoreCase("Country")) {
			key = 2;
		}
		else if(category.equalsIgnoreCase("State")) {
			key = 3;
		}
		else if(category.equalsIgnoreCase("City")) {
			key = 4;
		}
		else if(category.equalsIgnoreCase("Month")) {
			key = 5;
		}
		else if(category.equalsIgnoreCase("Year")) {
			key = 6;
		}
		System.out.printf("Looking for minimum average temperature where %s = %s...\n",
				category,categoryValue);

		tempList.resetCurrent();
		reading minTemp = new reading("","","","",0,0,0,200);
		reading current = tempList.getFirst();

		while(current!= null) {
			if((current.getAvgTemp() != -99) && (current.getAvgTemp()<minTemp.getAvgTemp())) {

				switch(key) {
				case 1:
					if(current.getRegion().equalsIgnoreCase(categoryValue)) {
						minTemp = current;
					}
					break;

				case 2:
					if(current.getCountry().equalsIgnoreCase(categoryValue)) {
						minTemp = current;
					}
					break;

				case 3:
					if(current.getState().equalsIgnoreCase(categoryValue)) {
						minTemp = current;
					}
					break;

				case 4:
					if(current.getCity().equalsIgnoreCase(categoryValue)) {
						minTemp = current;
					}
					break;

				case 5:
					if(current.getMonth()==Integer.parseInt(categoryValue)) {
						minTemp = current;
					}
					break;

				case 6:
					if(current.getYear()==Integer.parseInt(categoryValue)) {
						minTemp = current;
					}
					break;
				}
			}
			current = tempList.getNextElement();
		}
		return minTemp;
	}

	private static reading findMax(LinkedList tempList) {
		System.out.print("\nLooking for maximum average temperature of all data...\n");
		tempList.resetCurrent();
		reading maxReading = tempList.getFirst();
		reading current = tempList.getNextElement();

		while(current != null) {
			if(current.getAvgTemp() > maxReading.getAvgTemp()) {
				maxReading = current;
			}
			current = tempList.getNextElement();
		}

		return maxReading;
	}

	private static reading findMax(LinkedList tempList, String category, String categoryValue) {
		int key = 0;

		if(category.equalsIgnoreCase("Region")){
			key = 1;
		}
		else if(category.equalsIgnoreCase("Country")) {
			key = 2;
		}
		else if(category.equalsIgnoreCase("State")) {
			key = 3;
		}
		else if(category.equalsIgnoreCase("City")) {
			key = 4;
		}
		else if(category.equalsIgnoreCase("Month")) {
			key = 5;
		}
		else if(category.equalsIgnoreCase("Year")) {
			key = 6;
		}
		System.out.printf("\nLooking for maximum average temperature where %s = %s...\n",
				category,categoryValue);

		tempList.resetCurrent();
		reading maxTemp = new reading("","","","",0,0,0,-200);;
		reading current = tempList.getNextElement();

		while(current!= null) {
			if(current.getAvgTemp()>maxTemp.getAvgTemp()) {

				switch(key) {
				case 1:
					if(current.getRegion().equalsIgnoreCase(categoryValue)) {
						maxTemp = current;
					}
					break;

				case 2:
					if(current.getCountry().equalsIgnoreCase(categoryValue)) {
						maxTemp = current;
					}
					break;

				case 3:
					if(current.getState().equalsIgnoreCase(categoryValue)) {
						maxTemp = current;
					}
					break;

				case 4:
					if(current.getCity().equalsIgnoreCase(categoryValue)) {
						maxTemp = current;
					}
					break;

				case 5:
					if(current.getMonth()==Integer.parseInt(categoryValue)) {
						maxTemp = current;
					}
					break;

				case 6:
					if(current.getYear()==Integer.parseInt(categoryValue)) {
						maxTemp = current;
					}
					break;
				}
			}
			current = tempList.getNextElement();
		}
		return maxTemp;
	}

	private static void outputMaxAndMin(reading maxReading, reading minReading) {

		System.out.printf("Maximum Temperature: %1.2f on %d-%d-%d in %s, %s, %s\n",maxReading.getAvgTemp(),
				maxReading.getMonth(), maxReading.getDay(), maxReading.getYear(), maxReading.getCity(),
				maxReading.getState(),maxReading.getCountry());

		System.out.printf("Minimum Temperature: %1.2f on %d-%d-%d in %s, %s, %s\n"
				+ "------------------------------------------------------------------",minReading.getAvgTemp(),
				minReading.getMonth(), minReading.getDay(), minReading.getYear(), minReading.getCity(),
				minReading.getState(),minReading.getCountry());
	}
}