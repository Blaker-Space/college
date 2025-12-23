from selenium import webdriver
import requests
from bs4 import BeautifulSoup
from time import sleep
from functionDeck import *
from urllib.parse import urljoin
import sys

# set scroll pause time for dynamic loading
SCROLL_PAUSE_TIME = 1

# Get directory URL from command line argument
directory = sys.argv[1]

# Ensure the URL starts with http:// or https://
if not directory.startswith(("http://", "https://")):
    directory = "https://" + directory


profileList = []

options = webdriver.ChromeOptions()
options.add_argument('--headless')

driver = webdriver.Chrome(options=options)
# Initialize Selenium WebDriver with headless Chrome.

try:
    response = requests.get(directory, timeout=15)
except:
    print('Error request GETing Directory')
    driver.quit()
    quit()
#Attempt intial GET request to the directory URL.

requestResponse = response.status_code
    #Check response code of GET request.

if requestResponse != 200:
    #If response code is not 200 (successful) flag.
    sleep(15)
    #Sleep for 30 seconds.

    try:
        response = requests.get(directory, timeout=15)
    except:
        print('Error request GETing Directory')

    #Re attempt GET request.
    if response.status_code != 200:
        #If re-attempt also fails, skip this URL.
        quit()

sleep(1)

soupObject = BeautifulSoup(response.text, "html.parser")
#Parse the response content with BeautifulSoup.

if '#!' in directory:
    soupObject.decompose()
    #If the URL contains a hashbang (#!), use Selenium to load the page.
    try:
        driver.get(directory)
    except:
        print('Error driver GETing Directory')

    soupObject = BeautifulSoup(driver.page_source, "html.parser")
    typeDirectory = resolveDirectory(soupObject)
else:
    typeDirectory = resolveDirectory(soupObject)
    #Determine the type of directory using a custom function.

match typeDirectory:

    case 1:
        print('1')

        notes = ""

        buisnessCards = soupObject.select_one('.gz-cards')
        for card in buisnessCards.select('.card-title'):
            inner = card.find('a')
            profileList.append(urljoin(directory, inner.get('href')))

        for profile in profileList:

            try:
                response = requests.get(profile, timeout=30)
                sleep(1)
                tailSoup = BeautifulSoup(response.text, "html.parser")
            except:
                continue

            profileInfo = tailSoup.select_one('[class*="details-links"]')

            try:
                name = tailSoup.select_one('h1').getText(strip=True)
            except:
                name = ""
            phone = IphoneParse(profileInfo)
            street, city, state, zipCode = IaddrParse(profileInfo)
            url = IurlParse(profileInfo)
            print(name, url, phone, street, city, state, zipCode)

            companyDictionary = {
                'name': name,
                'website': url,
                'phone': phone,
                'email': '',
                'street': street,
                'city': city,
                'state': state,
                'zip': zipCode,
                'notes': notes,
            }

            send_to_api(companyDictionary)


    case 2:
        print('2')

        notes = ""

        root = directory.split('/', 3)
        root = root[0] + "//" + root[2] + "/"

        # Select listing container
        listingContainer = soupObject.select('[class*=" ccaMemListing "]')

        # Find "Next" location
        nextLoc = soupObject.select_one('[class*="ccaNext"]').get('href')

        if (nextLoc != None):
            # If "Next" exists, loop through pages
            while True:
                nextUrl = urljoin(directory, nextLoc)

                nextResponse = requests.get(nextUrl)

                nextResponse.encoding = 'utf-8'

                nextSoup = BeautifulSoup(nextResponse.text, 'html.parser')
                nextSet = nextSoup.select('[class*=" ccaMemListing "]')

                # --- Extend instead of append to avoid nested list
                listingContainer.extend(nextSet)

                nextLoc = nextSoup.select_one('[class*="ccaNext"]').get('href')
                if (nextLoc == None):
                    break

        for ccaListing in listingContainer:
            # Iterate through each page to obtain all profile links

            profileLoc = ccaListing.select_one('[class*="ccaMemProfileLnk"] a').get('href')
            profileLnk = urljoin(directory, profileLoc)
            profileList.append(profileLnk)

        for profile in profileList:
            try:
                response = requests.get(profile)
                response.encoding = 'utf-8'

                sleep(1)

                caaSoup = BeautifulSoup(response.text, 'html.parser')
            except:
                continue
            
            try:
                name = caaSoup.select_one('[class*="ccaNameBlock"]').get_text(strip=True)
            except:
                name = ""

            phone = CCAphoneParse(caaSoup)
            street, city, state, zipCode = CCAaddrParse(caaSoup)
            url = CCAurlParse(caaSoup)
            
            companyDictionary = {
                'name': name,
                'website': url,
                'phone': phone,
                'email': '',
                'street': street,
                'city': city,
                'state': state,
                'zip': zipCode,
                'notes': notes,
            }
            
            send_to_api(companyDictionary)

        
    case 3:
        print('3')

        notes = ""
        
        soupObject.decompose()

        try:
            driver.get(directory)

            # Get initial scroll height
            last_height = driver.execute_script("return document.body.scrollHeight")

            while True:
                # Scroll down to bottom
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

                # Wait for new content to load
                sleep(SCROLL_PAUSE_TIME)

                # Calculate new scroll height and compare with last height
                new_height = driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:  # No new content loaded
                    break
                last_height = new_height
            
            soupObject = BeautifulSoup(driver.page_source, "html.parser")
        except:
            print('Bad Driver GET')

        cardList = soupObject.select('[class="SFcrd"]')
        # Obtain all profile cards on the page

        for profile in cardList:    

            profileLink = profile.get('href')
            profileList.append(profileLink)
            # obtain all profile links from cards.

        for profile in profileList:

            try:
                driver.get(profile)

                sleep(2)              

                SFSoup = BeautifulSoup(driver.page_source, "html.parser")
            except:
                continue
            
            profileInfo = SFSoup.select_one('[class*="SFbizctc"]')

            try:
                name = profileInfo.select_one('h3[itemprop="name"]').get_text(strip=True)
            except:
                name = ""

            phone = IphoneParse(profileInfo)
            street, city, state, zipCode = IaddrParse(profileInfo)
            url = IurlParse(profileInfo)

            companyDictionary = {
                'name': name,
                'website': url,
                'phone': phone,
                'email': '',
                'street': street,
                'city': city,
                'state': state,
                'zip': zipCode,
                'notes': notes,
            }

            send_to_api(companyDictionary)
            # Send the company data to the API for insertion into DB.

    case 0:
        print('Unknown/Unsupported Directory Entered')
        # directory type could not be determined or is unsupported.








 