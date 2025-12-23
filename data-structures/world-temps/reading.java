
public class reading {
	private String region;
	private String country;
	private String state;
	private String city;
	private int month;
	private int day;
	private int year;
	private double avgTemp;
	private reading next;

	public reading(String region, String country, String state, String city, int month, int day, int year,
			double avgTemp) {
		setRegion(region);
		setCountry(country);
		setState(state);
		setCity(city);
		setMonth(month);
		setDay(day);
		setYear(year);
		setAvgTemp(avgTemp);
	}

	public String getRegion() {
		return region;
	}

	public String getCountry() {
		return country;
	}

	public String getState() {
		return state;
	}

	public String getCity() {
		return city;
	}

	public int getMonth() {
		return month;
	}

	public int getDay() {
		return day;
	}

	public int getYear() {
		return year;
	}

	public double getAvgTemp() {
		return avgTemp;
	}

	public reading getNext() {
		return next;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public void setState(String state) {
		this.state = state;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public void setMonth(int month) {
		this.month = month;
	}

	public void setDay(int day) {
		this.day = day;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public void setAvgTemp(double avgTemperature) {
		this.avgTemp = avgTemperature;
	}

	public void setNext(reading next) {
		this.next = next;
	}


}
