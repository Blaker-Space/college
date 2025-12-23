/*
 * 
 */
package typesOfStores;
/**
 * 
 * @author bmills5
 *
 */
public class GroceryStore extends Store {
	/**
	 * 
	 */
	private double annualRevenue;
	/**
	 * 
	 */
	private boolean isChain;
	
	/**
	 * 
	 * @param name
	 * @param address
	 * @param annualRevenue
	 * @param isChain
	 */
	public GroceryStore(String name, String address, double annualRevenue, boolean isChain) {
		super(name, address);
		setAnnualRevenue(annualRevenue);
		setIsChain(isChain);
	}
	
	/**
	 * 
	 * @return
	 */
	public double getAnnualRevenue() {
		return this.annualRevenue;
	}
	
	/**
	 * 
	 * @return
	 */
	public boolean getIsChain() {
		return this.isChain;
	}
	
	/**
	 * 
	 * @param annualRevenue
	 */
	public void setAnnualRevenue(double annualRevenue) {
		this.annualRevenue = annualRevenue;
	}
	
	/**
	 * 
	 * @param isChain
	 */
	public void setIsChain(boolean isChain) {
		this.isChain=isChain;
	}
	
	/**
	 * 
	 */
	@Override
	public String toString() {
		String chainString = "is not";
		if(isChain)
			chainString = "is";
		
		return super.toString()+"\n\tAnnual Revenue: "+
				getAnnualRevenue()+"\n\t "+chainString+
				" a chain store.";
	}
	
	
}
