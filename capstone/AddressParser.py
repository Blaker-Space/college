retrivedText = """Business Name: Stonebrook & Lane Interior Design Studio
Industry: Interior Design & Creative Consulting

Business Description:

Stonebrook & Lane Interior Design Studio is a boutique design firm specializing in timeless, functional, and deeply personalized residential and small commercial interiors. Based in Asheville, North Carolina, our studio blends classic design principles with modern sensibilities to create spaces that are both visually inspiring and perfectly livable.

You can also visit our regional office at 890 Cedar Parkway Suite 210, Kilgore, TX 75662.
For design consultations in Dallas, meet us at 455 Elm Street, Apt. 3B, Dallas, TX 75201.

Founded in 2015 by lead designer Amelia Lane, Stonebrook & Lane has grown into a trusted name for clients seeking curated interiors that reflect their unique lifestyle, personality, and aspirations. Whether it’s a full home renovation, kitchen redesign, or simply refreshing a room with new textures and tones, our approach is collaborative, thoughtful, and always rooted in the client’s vision.

We recently opened new creative hubs across East Texas:
- 22 Magnolia Drive, Henderson, TX 75652
- 78 Riverbend Road, Suite 5, Marshall, TX 75670
- 304 Oakwood Blvd., Tyler, TX 75703
- 1550 N. Main Street, Jacksonville, TX 75766-1420
- 190 Pinecone Trail, Gilmer, TX 75644


At Stonebrook & Lane, we believe that design is more than aesthetics—it's about how a space feels, functions, and supports the people who live or work in it. We are proud to build lasting relationships with our clients, many of whom return to us for additional projects as their lives and needs evolve.

Find our physical location at: 1234 Maple Street, Longview, TX 75601
Or visit our secondary office at: 

5678 Oak Avenue, 
Tyler, TX 75701


If you're ready to begin your design journey, Amelia would love to hear from you personally:

📧 Amelia Lane, Founder & Lead Designer: amelia@stonebrooklane.com
📧 Studio Inquiries & Project Requests: hello@stonebrooklane.net
📧 Studio Inquiries & Project Requests: hello@stonebrooklane.org
📧 Studio Inquiries & Project Requests: hello@stonebrooklane.eu
📧 Studio Inquiries & Project Requests: hello@stonebrooklane.us"""


zipcodes = [
    '75059', '75064', '75103', '75117', '75124', '75127', '75140', '75143', '75148', '75156', 
    '75163', '75169', '75410', '75440', '75444', '75451', '75472', '75494', '75497', '75601', 
    '75602', '75603', '75604', '75605', '75606', '75607', '75608', '75615', '75630', '75631', 
    '75633', '75637', '75639', '75640', '75641', '75642', '75643', '75644', '75645', '75647',
    '75650', '75651', '75652', '75653', '75654', '75657', '75658', '75659', '75660', '75661', 
    '75662', '75663', '75666', '75667', '75669', '75670', '75671', '75672', '75680', '75681', 
    '75682', '75683', '75684', '75685', '75686', '75687', '75688', '75689', '75691', '75692', 
    '75693', '75694', '75701', '75702', '75703', '75704', '75705', '75706', '75707', '75708',
    '75709', '75710', '75711', '75712', '75713', '75750', '75751', '75752', '75754', '75755', 
    '75756', '75757', '75758', '75759', '75762', '75763', '75764', '75765', '75766', '75770', 
    '75771', '75772', '75773', '75778', '75779', '75780', '75782', '75783', '75784', '75785', 
    '75789', '75790', '75791', '75792', '75797', '75798', '75799', '75801', '75802', '75803',
    '75832', '75839', '75853', '75861', '75880', '75882', '75884', '75886', '75925', '75976', 
    '76190' ] # East Texas zip code dictionary

def find_zipcode(text, zipcode_list, currentPosition): # Find zipcodes in text to anchor address parsing (first step)   
    furthestIndex = None # Variable to hold current furthest reached indexed position, initialize to None
    furthestZip = None
    for zipcode in zipcode_list:
        index = text.find(zipcode, currentPosition) # Function to find index of zipcodes in text, returns -1 if not found
        if index != -1 and (furthestIndex is None or index < furthestIndex): # If zipcode found and is either first found or earlier than previous found
            furthestZip = zipcode # Update furthest zipcode
            furthestIndex = index
    return furthestZip, furthestIndex 

def parseAddress(retrivedText, zipcodes, currentPosition=0): # Parse address using found zipcodes, start zip search at index 0
    addressList = []

    while True: # Loop to find all zipcodes and corresponding addresses in text
        zipcode, zipIndex = find_zipcode(retrivedText, zipcodes, currentPosition) # First, find a zipcode in the text

        if zipcode is None:
            break # No more zipcodes found, exit loop
        
        addressBuffer = [] # Buffer to store address characters
        currentIndex = zipIndex - 1 # Start index at the character before the start of the zipcode
        referenceChar = retrivedText[currentIndex]

        while referenceChar.isdigit() == False: # Iterate backwards until number is found (indicating possible house number/start of address)
            addressBuffer.append(referenceChar) # Append each character to address buffer
            currentIndex -= 1
            if currentIndex < 0:  # Prevent index from going negative if zipcode is at start of text
                break
            referenceChar = retrivedText[currentIndex]

        while referenceChar.isdigit() == True: # Now at the house number, iterate through and append it as well (stop when non-digit found)
            addressBuffer.append(referenceChar)
            currentIndex -= 1
            if currentIndex < 0:  # Prevent index from going negative if house number is at start of text
                break
            referenceChar = retrivedText[currentIndex]

        addressBuffer.reverse() # Reverse backwards crawled buffer
        address = ''.join(addressBuffer) + zipcode # Join address with zipcode starting point
        addressList.append(address) # Append final address to list

        currentPosition = zipIndex + len(zipcode) # Update current index position and continue searching for zipcodes after this one
    return addressList

addresses = parseAddress(retrivedText, zipcodes)
print(addresses)  # Output the parsed addresses