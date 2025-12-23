from bs4 import BeautifulSoup
from urllib.parse import urljoin
import requests

API_URL = "http://localhost:5000/company"

def resolveDirectory(soup):
    dirType = 0
    try:
        if(len(soup.select_one('[class*="gz-cards"]')) > 0):
            dirType = 1
            return(dirType)
    except:
        pass

    try:
        if(len(soup.select('[class*=" ccaMemListing "]')) > 0):
            dirType = 2
            return(dirType)
    except:
        pass

    try:
        if(len(soup.select('[class*="SFcrd"]')) > 0):
            dirType = 3
            return(dirType)
    except:
        pass

    return(dirType)

def IphoneParse(soup):
    try:
        phoneNumber = ''
        phoneContainer = soup.select_one('[itemprop="telephone"]').get_text(strip=True)
        for x in phoneContainer:
            if x.isnumeric():
                phoneNumber += x
                if len(phoneNumber) in (3, 7):
                    phoneNumber += '-'
        return phoneNumber
    except:
        return ""
    
def IaddrParse(soup):

    try:
        street = soup.select_one('[itemprop*="streetAddress"]').get_text(strip=True)
    except:
        street = ""

    try:
        city = soup.select_one('[itemprop*="addressLocality"]').get_text(strip=True)
    except:
        city = ""
        
    try:
        state = soup.select_one('[itemprop*="addressRegion"]').get_text(strip=True)
    except:
        state = ""
        
    try:
        zip = soup.select_one('[itemprop*="postalCode"]').get_text(strip=True)
    except:
        zip = ""

    # Normalize state
    if state.lower() in ("tx", "texas"):
        state = "Texas"

    return (street, city, state, zip)

def IurlParse(soup):
    try: 
        webAddrLoc = soup.select_one('[itemprop="url"]')
        webAddr = webAddrLoc.get('href')
        return(webAddr)
    except:
        return ""    
    
def CCAurlParse(soup):
    try:
        phone = soup.select_one('[class*="ccaWebAddr"]').get_text(strip=True)
        return(phone)
    except:
        return ""

def CCAphoneParse(soup):
    try:
        website = soup.select_one('[class*="ccaPhone"]').get_text(strip=True)
        return(website)
    except:
        return ""        

def CCAaddrParse(soup):
    try:
        address = soup.select_one('[class*="ccaAddr"]').get_text(strip=True, separator='#')

        addrParts = address.split('#')
        if(len(addrParts) == 2):
            street = addrParts[0]

            cityStZip = addrParts[1].split(',')
            city = cityStZip[0]

            state = cityStZip[1][-8:-6]
            zip = cityStZip[1][-5:]

        if(len(addrParts) == 3):
            street = addrParts[0] + ' ' + addrParts[1]

            cityStZip = addrParts[2].split(',')
            city = cityStZip[0]

            state = cityStZip[1][-8:-6]
            zip = cityStZip[1][-5:]    

        if state.lower() in ("tx", "texas"):
            state = "Texas"

        return street, city, state, zip

    except:
        return "", "", "", "" 

def send_to_api(company):
    payload = {
        'company_name': company['name'],
        'website_url': company['website'],
        'phone_number': company['phone'],
        'email_address': company['email'],
        'street_address': company['street'],
        'city': company['city'],
        'state': company['state'],
        'postal_code': company['zip'],
        'notes': company['notes']
    }

    r = requests.post(API_URL, json=payload)

    if r.status_code == 409:
        print("Skipping duplicate:", company["name"])
    elif r.status_code != 200:
        print("Insert error:", r.text)
    else:
        print("Inserted:", company["name"])            