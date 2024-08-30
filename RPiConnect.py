import requests
import psycopg2
import time
import json
import threading
from datetime import datetime

# Defining database connection parameters
#robotIP = "172.27.34.74"
host = "shallowly-forbearing-bandicoot.data-1.use1.tembo.io"
port = 5432
database = "Mushroom"
user = "postgres"
password = "YRkedybSqhM0fHje"

# Defining functions to connect to database
def connectToDatabase(host, port, database, user, password):
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )
        return conn
    except psycopg2.Error as e:
        print(f"Unable to connect to the database: {e}")
        return None
    
# Defining function to get status from the web API and add to database
def getStatus(robotIP): # Function to get status from the web API
    try:
        response = requests.get("http://" + robotIP + "/reeman/base_encode", json=None) 
        response.raise_for_status() 
        response2 = requests.get("http://" + robotIP + "/reeman/pose", json=None)
        response2.raise_for_status()
        data= dict(response.json(), **response2.json())
        return data
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None
def recursiveGetStatus(robotIP):
    while True:
        data = getStatus(robotIP)
        if data:
            # Try to add data to database
            cursor = conn.cursor()
            try:
                cursor.execute('INSERT INTO statuses (battery, "chargeFlag", "emergencyButton", "timeOfResponse", "robotIP","xCoord", "yCoord", theta) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)', (data["battery"], data["chargeFlag"], data["emergencyButton"], datetime.now(), robotIP, data["x"], data["y"], data["theta"]))
                conn.commit()
            except psycopg2.Error as e:
                print(f"Unable to insert status into the database: {e}")
            finally:
                cursor.close()
                time.sleep(5)
                
# Defining function to get requests from DB and send to web API
def executeRequest(requestPath, requestBody, requestID):
    try:
        response = requests.post(requestPath, json=requestBody)
        if response.status_code == 200:
            try:
                cursor = conn.cursor()
                print(response.json())
                cursor.execute('UPDATE requests SET "requestResponse" = %s WHERE "requestRequestID" = %s', (json.dumps(response.json()), requestID))
                conn.commit()
                cursor.close()
            except psycopg2.Error as e:
                print(f"Unable to update request status: {e}")
        else:
            print(f"Failed to make POST request. Status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None
        
def checkForRequests(robotIP):
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM requests WHERE "robotIP"= %s AND "requestResponse" IS NULL', (robotIP,)) 
        requests = cursor.fetchall()
        cursor.close()
        for request in requests:
            executeRequest(request[0], request[1],request[3])      # 0 = path, 1 = body, 3 = requestID
    except psycopg2.Error as e:
        print(f"Unable to fetch requests from the database: {e}")
        return None
  
def recursiveCheckForRequests(robotIP):
    while True:
        checkForRequests(robotIP)
        time.sleep(2)

# Connect to the database
robotIP = input("Enter IP address of the Reeman Big Dog Robot:")
conn = connectToDatabase(host, port, database, user, password)
if conn:
    t1 = threading.Thread(target=recursiveGetStatus, args=(robotIP,)) # thread to constantly get statuses
    t2 = threading.Thread(target=recursiveCheckForRequests, args = (robotIP,)) # thread to constantly check for new requests
    
    
    t1.start()
    t2.start()
    
    #conn.close()
    
    
# Assumes that user will use ctrl c to stop the program, else need to add a way to stop the threads and conn.close() 