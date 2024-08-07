async function submitToDB(requestPath, data, needsStatusCheck){
    try {
        let response = await fetch("http://localhost:3000/submitToDB", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({requestPath, data, needsStatusCheck})
        });
        if (response.ok) {
            console.log("Request submitted to DB")
        } else {
            console.log("Request failed to submit to DB")
        }   
    } catch (err) {
        console.log(err.message);
    }
}


function navigationByCoordinate(){
    //get data from form
    let x = document.getElementById("x").value;
    let y = document.getElementById("y").value;
    let theta = Math.atan2(y, x); 

    let requestPath = "/cmd/nav";
    let data = { "x": x, "y": y, "theta": theta};
    let needsStatusCheck = true;

    submitToDB(requestPath, data, needsStatusCheck);
    
}

 function navigationByPointName(){
    //get data from form
    let targetPointName = document.getElementById("targetPointName").value;
    
    let requestPath = "/cmd/nav_point";
    let data = { "point": targetPointName};
    let needsStatusCheck = true;

    submitToDB(requestPath, data,  needsStatusCheck);
}

async function navigateToCharge(){
    //Will be procced by Button or outside call
    let requestPath = "/cmd/charge";
    let data = { "type": "1", "point" : "charging_pile"};
    let needsStatusCheck = true;

    submitToDB(requestPath, data, needsStatusCheck);
}


async function cancelNavigation(){
    let requestPath = "/cmd/cancel_goal";
    let data = {};
    let needsStatusCheck = false;

    submitToDB(requestPath, data, needsStatusCheck);
}

async function getStatusOfNavigation(){
    let requestPath = "/reeman/movebase_status";
    let data = {};
    let needsStatusCheck = false;

    submitToDB(requestPath, data, needsStatusCheck);
}

async function moveRobot(vx, vth){
    //let vx = document.getElementById("vx").value; // data in m/s
    //let vth = document.getElementById("vth").value * Math.PI / 180; //convert angle to radians, data in radians / s

    let requestPath = "/cmd/speed";
    let data = { "vx": vx, "vth": vth};
    let needsStatusCheck = false;

    submitToDB(requestPath, data, needsStatusCheck);
}


var batteryPercentElement , emergencyButtonStatus;
async function getStatusUpdates(){
    try{
        let response = await fetch(`http://localhost:3000/submitToDB`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });        
        let statusUpdate = await response.json();
        statusUpdate = statusUpdate.rows[0];

        // Update the battery percentage and add if its charging or not
        batteryPercentElement = document.getElementById("batteryPercent");
        batteryPercentElement.innerHTML = statusUpdate.battery+"%" +'\n' + (statusUpdate.chargeFlag==1 ? "Not Charging" : "Charging");
        batteryPercentElement.style.setProperty("--p", statusUpdate.battery);

        // Update the emergency button status
        emergencyButtonStatus = document.getElementById("emergencyButtonStatus");
        emergencyButtonStatus.innerHTML = statusUpdate.emergencyFlag==0 ? "PRESSED" : "Not Pressed";
    } catch(err){
        console.log(err.message);
    }
}

function getPixelCoordinates(event){
    let rect=this.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    var cw=this.clientWidth
    var ch=this.clientHeight
    var iw=this.naturalWidth
    var ih=this.naturalHeight
    var px=x/cw*iw
    var py=y/ch*ih
    document.getElementById("x").value = px.toFixed(2);
    document.getElementById("y").value = py.toFixed(2);

}

function startUpFunctions(){
    getStatusUpdates();
    //setInterval(getStatusUpdates, 1000);
    loadJoystick();
    document.getElementById("imgID").addEventListener("click", getPixelCoordinates);
}

