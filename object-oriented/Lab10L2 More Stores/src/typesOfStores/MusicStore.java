/*Blake Mills
 * COSC 1337 001
 * 11/1/2023
 * Purpose: To encapsulate the idea of a music store (Lab10L1)
 */
package typesOfStores;

/**Encapsulates a Music Store. Extends Store.
 * @author bmills5
 *
 */
public class MusicStore extends Store {
	/**The name of the visiting artist. "" represents no artist*/
	private String visitingArtist = "";
	
	/**Creates a new Music Store with the input parameters
	 * 
	 * @param name the name of the store
	 * @param address the address of the store
	 * @param visitingArtist the name of the visiting artist
	 */
	public MusicStore(String name, String address, String visitingArtist) {
		super(name, address);
		setVisitingArtist(visitingArtist);
	}

	/**Gets the artist currently visiting the store
	 * @return the visitingArtist
	 */
	public String getVisitingArtist() {
		return visitingArtist;
	}

	/**Sets the artist currently visiting the store
	 * @param visitingArtist the visitingArtist to set
	 */
	public void setVisitingArtist(String visitingArtist) {
		this.visitingArtist = visitingArtist;
	}
	
	/**returns a user-friendly String version of the Music Store
	 * 
	 * @return the String
	 */
	@Override
	public String toString() {
		return super.toString()+"\n\tVisiting Artist: "+getVisitingArtist();
	}

}
