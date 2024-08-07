function setMap(){
    console.log("Setting map");
    var cx = document.getElementById("mapCanvas").getContext("2d");
    var map = new Image();
    map.onload = function() {
        cx.drawImage(map, 0, 0);
        //document.getElementById("mapCanvas").width = this.width;
        //document.getElementById("mapCanvas").height = this.height;
        
    };
    map.src = "map.png";


    //var pose = new object();
    //pose.type = "image/svg+xml";
    //pose.data = "pose.svg";
    //cx.drawImage(pose, 1.244/0.05, this.height-(50_0.107/0.05), 10, 10);
}

function getPixelCoordinates(event) {
    let canvas = document.getElementById("mapCanvas");
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("Pixel Coordinates: ", x, y);
}