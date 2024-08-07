import requests
import psycopg2
import time
import json
import threading
from datetime import datetime

# Defining database connection parameters
robotIP = "172.27.34.74"
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
def getStatus(url, method, body): # Function to get status from the web API
    try:
        response = requests.request(method, url, json=body)
        response.raise_for_status()  # Raise an exception if the request was unsuccessful
        data = response.json()  # Convert the response to JSON
        return data
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None
def recursiveGetStatus(url, method, body, delay):
    while True:
        data = getStatus(url, method, body)
        if data:
            # Try to add data to database
            cursor = conn.cursor()
            try:
                cursor.execute('INSERT INTO statuses (battery, "chargeFlag", "emergencyButton", "timeOfResponse") VALUES (%s, %s, %s, %s)', (data["battery"], data["chargeFlag"], data["emergencyButton"], datetime.now()))
                conn.commit()
                print("Components added to the database!")
            except psycopg2.Error as e:
                print(f"Unable to insert components into the database: {e}")
            finally:
                cursor.close()
                time.sleep(delay)
                
# Defining function to get requests from DB and send to web API
def executeRequest(requestPath, requestBody, needStatusCheck, cursor):
    try:
        response = requests.get(requestPath, json=requestBody)
        if response.status_code == 200:
            # if the request is a nav request (needs a navigation status check), get status of navigation until it is either 3 (success) or 4 (failed)
            isDecided = False
            if needStatusCheck:
                while isDecided == False:
                    try:
                        response = requests.get("http://" + robotIP + "/reeman/movebase_status")
                        if response["status"] == 3 or response["status"] == 4:
                            isDecided = True
                            if response["status"] == 3:
                                response["status"] = "Success"
                            else:
                                response["status"] = "Failed"
                            #cursor = conn.cursor()
                            try:
                                cursor.execute('UPDATE requests SET "requestResponse" = %s WHERE "requestPath" = %s', (response.json(), requestPath))
                                conn.commit()
                                print("Request status updated!")
                            except psycopg2.Error as e:
                                print(f"Unable to update request status: {e}")
                            #finally:
                                #cursor.close()
                        else:
                            time.sleep(30) # check if the navigation has completed every 30 seconds
                    except requests.exceptions.RequestException as e:
                        print(f"An error occurred: {e}")
                        return None
            else: 
                #cursor = conn.cursor()
                try:
                    cursor.execute('UPDATE requests SET "requestResponse" = %s WHERE "requestPath" = %s', (response.json(), requestPath))
                    conn.commit()
                    print("Request status updated!")
                except psycopg2.Error as e:
                    print(f"Unable to update request status: {e}")
                finally:
                    cursor.close()
        else:
            print(f"Failed to make GET request. Status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None
        
def checkForRequests():
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM requests WHERE "requestResponse" IS NULL')
        requests = cursor.fetchall()
        for request in requests:
            executeRequest(request[0], request[1],request[4],cursor)      
    except psycopg2.Error as e:
        print(f"Unable to fetch requests from the database: {e}")
        return None
    finally:
        cursor.close()
  
def recursiveCheckForRequests():
    while True:
        checkForRequests()
        time.sleep(20)

# Connect to the database
conn = connectToDatabase(host, port, database, user, password)
if conn:
    '''t1 = threading.Thread(target=recursiveGetStatus, args=("http://" + robotIP + "/reeman/base_encode", "GET", None, 60)) # thread to constantly get statuses
    t2 = threading.Thread(target =recursiveCheckForRequests, args = ())    # thread to constantly check for new requests
 
    t1.start()
    t2.start()'''
    
    #recursiveCheckForRequests()
    cursor = conn.cursor()
    try:
        obj = [{"try" : "ing"}]
        cursor.execute('INSERT INTO requests ("requestPath", "requestBody", "requestStatusCheck") VALUES (%s, %s, %s)', ("pathname", json.dumps(obj), True))
        conn.commit()
        print("Components added to the database!")
    except psycopg2.Error as e:
        print(f"Unable to insert components into the database: {e}")
    finally:
        cursor.close()
    
    conn.close()
    
    
# Assumes that user will use ctrl c to stop the program, else need to add a way to stop the threads and conn.close() 