window.onload = function() {
    var data = JSON.parse(localStorage.getItem('data'));
    console.log(data);
    var acc_data = ["RKN^", "HIP", "LUA^", "RUA_", "LH", "BACK", "RKN_", "RWR", "RUA^", "LUA_", "LWR", "RH"];
    var inertial_data = ["BACK", "RUA", "RLA", "LUA", "LLA"];
    var inertial_data_xyz = ["acc", "gyro", "magnetic", "quaternion"];
    var shoe_data = ["LSHOE", "RSHOE"];
    var shoe_data_xyz = ["Eu", "Nav", "Body", "AngVelBodyFrame", "AngVelNavFrame", "Compass"];
        
    for(var i = 0; i < data.length; i++) {
        document.getElementById('table') 
                .innerHTML += "time:" + data[i]["time"] + "<br>";
        var counter = 0;
        document.getElementById('table') 
                .innerHTML += "acc:" + "<br>";
        for(var j = 0; j < acc_data.length; j += 1) {
            document.getElementById('table') 
                .innerHTML += data[i][acc_data[j]] + "<br>";
            counter++;
        }
        document.getElementById('table') 
                .innerHTML +="<br>";
    }
    
}