'''
This is a little python utility that accesses the Bird
Scooters API at 'https://api.bird.co/user/login' and 
renews/gets a new accessID 

Note that this accessID is used to access the API and 
not the GUID below. The accessID is to be used by other
tools. The reason this script was developed is to 
renew the accessID which is periodically expired by 
Bird. 

ref: https://github.com/ubahnverleih/WoBike/blob/master/Bird.md

'''
### Imports

import requests
import json

### Define constants

BIRD_GUID = '5FC3B75D-C24A-4FC6-B92C-8DB7E41DB539'
baseURL ='https://api.bird.co/user/login'

### Create the request object by encoding Bird reqmts

urlHeaders = {
    'Device-id':BIRD_GUID,
    'Platform': 'ios',
    'Content-type': 'application/json'
}

urlBody = {"email": "a-f@gmail.com"}
print('creating post request to {baseURL}')
resp = requests.post(baseURL, 
    headers=urlHeaders, 
    json=json.dumps(urlBody))

###  Extract the ID/date from the response
print('extracting json')
jsonObj = resp.json()
print(f'Extract: received json :\n {jsonObj}')
accessID = jsonObj['id']
print (f'accessid is {accessID}')

###  Save ID to file
print('writing accessid to file bird-accessID.txt')
with open('bird-accessID.txt','w') as f: 
    f.write(accessID)
 
