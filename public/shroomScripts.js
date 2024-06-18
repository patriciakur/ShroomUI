
async function submitToDB(requestPath, data){
    try {
        const response = await fetch("http://localhost:3000/submitToDB", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({requestPath, data})
        });
        const result = await response.json();
    } catch (err) {
        console.log(err.message);
    }
}

async function navigationByCoordinate(){
    //get data from form
    const x = document.getElementById("x").value;
    const y = document.getElementById("y").value;
    const theta = document.getElementById("theta").value * Math.PI / 180; //convert angle to radians

    const requestPath = "/cmd/nav";
    const data = { "x": x, "y": y, "theta": theta};
    const needsStatusCheck = true;

    submitToDB(requestPath, data, needsStatusCheck);
    
}

async function navigationByPointName(){
    //get data from form
    const targetPointName = document.getElementById("targetPointName").value;
    
    const requestPath = "/cmd/nav_point";
    const data = { "point": targetPointName};
    const needsStatusCheck = true;

    submitToDB(requestPath, data,  needsStatusCheck);
}

async function navigateToCharge(){
    //Will be procced by Button or outside call
    const requestPath = "/cmd/charge";
    const data = { "type": 1, "point" : "charging_pile"};
    const needsStatusCheck = true;

    submitToDB(requestPath, data, needsStatusCheck);
}

async function cancelNavigation(){
    const requestPath = "/cmd/cancel_goal";
    const data = {};
    const needsStatusCheck = false;

    submitToDB(requestPath, data, needsStatusCheck);
}

async function getStatusOfNavigation(){
    const requestPath = "/reeman/movebase_status";
    const data = {};
    const needsStatusCheck = false;

    submitToDB(requestPath, data, needsStatusCheck);
}

async function moveRobot(){
    const vx = document.getElementById("vx").value; // data in m/s
    const vth = document.getElementById("vth").value * Math.PI / 180; //convert angle to radians, data in radians / s

    const requestPath = "/cmd/speed";
    const data = { "vx": vx, "vth": vth};
    const needsStatusCheck = false;

    submitToDB(requestPath, data, needsStatusCheck);
}

async function getStatusUpdates(){
    try{
        const response = await fetch(`http://localhost:3000/getStatusUpdates`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const statusUpdate = await response.json();
        // later change below console logs to update the UI
        console.log(statusUpdate.battery);
        console.log(statusUpdate.chargeFlag);
        console.log(statusUpdate.emergencyButton);
        console.log(statusUpdate.timeOfResponse);
    } catch(err){
        console.log(err.message);
    }
}