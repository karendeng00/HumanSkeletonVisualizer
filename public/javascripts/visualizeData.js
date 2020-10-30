window.onload = function() {
    var data = JSON.parse(localStorage.getItem('data'));
    var acc_data = ["RKN^", "HIP", "LUA^", "RUA_", "LH", "BACK", "RKN_", "RWR", "RUA^", "LUA_", "LWR", "RH"];
    var inertial_data = ["BACK", "RUA", "RLA", "LUA", "LLA"];
    var inertial_data_xyz = ["acc", "gyro", "magnetic", "quaternion"];
    var shoe_data = ["LSHOE", "RSHOE"];
    var shoe_data_xyz = ["Eu", "Nav", "Body", "AngVelBodyFrame", "AngVelNavFrame", "Compass"];
    console.log(data)
    for(var i = 0; i < data.length; i++) {
        document.getElementById('table').innerHTML += "time: " + data[i]["time"] + "<br>";
        document.getElementById('table').innerHTML += "acc:" + "<br>";
        for(var j = 0; j < acc_data.length; j += 1) {
            document.getElementById('table').innerHTML += [acc_data[j]] + ": " + data[i]["acc"][acc_data[j]] + "<br>";
        }
        document.getElementById('table').innerHTML += "inertial:" + "<br>"
        for(var j = 0; j < inertial_data.length; j++) {
            document.getElementById('table').innerHTML += [inertial_data[j]] + ": " + "<br>";
            for(var k = 0; k < inertial_data_xyz.length; k++) {
                document.getElementById('table').innerHTML += [inertial_data_xyz[k]] + ": " + data[i]["inertial"][inertial_data[j]][inertial_data_xyz[k]] + "<br>"
            }
        }
        document.getElementById('table').innerHTML +="<br>"
    }
    
}