

function submitButton() {
    openFile()
}

function openFile() {
    //Gets files from document element
    var files=document.getElementById('inputfile').files;
    
    //Selects first File and assigns it to file
    var file=files[0];
    console.log(file)
    var fr=new FileReader(); 
    fr.readAsText(file);
    fr.onload=function(){ 
        var result = fr.result;
        document.getElementById('output') 
                .innerHTML="done"; 
        parseData(result);
    }
}

function parseData(result) {
    var lines = result.split('\n').slice(0, 2);
    for(var line = 0; line <= 1; line++){
        var dict = new Object();
        var arr = lines[line].split(' ')
        var acc = new Object();
        var inertial = new Object();
        var acc_data = ["RKN^", "HIP", "LUA^", "RUA_", "LH", "BACK", "RKN_", "RWR", "RUA^", "LUA_", "LWR", "RH"];
        var inertial_data = ["BACK", "RUA", "RLA", "LUA", "LLA"];
        var inertial_data_xyz = ["acc", "gyro", "magnetic", "quaternion"];
        var shoe_data = ["LSHOE", "RSHOE"];
        var shoe_data_xyz = ["Eu", "Nav", "Body", "AngVelBodyFrame", "AngVelNavFrame", "Compass"]
        var counter = 0;
        for(var i = 1; i <= 34; i += 3) {
            acc[acc_data[counter]] = arr.slice(i, i+3);

            counter++;
        }
        counter = 0;
        for(var i = 37; i <= 89; i+= 13) {
            var temp = new Object();
            for(var j = 0; j <= 3; j++) {
                if(j == 3) {
                    temp[inertial_data_xyz[j]] = arr.slice(i + j * 3, i + (j*3) + 4)
                }
                else {
                    temp[inertial_data_xyz[j]] = arr.slice(i + j * 3, i + (j*3) + 3)
                }
            }
            inertial[inertial_data[counter]] = temp
            counter++;
        }
        counter = 0;
        for(var i = 102; i <= 118; i += 16) {
            var temp = new Object();
            for(var j = 0; j <= 5; j++) {
                if(j == 5) {
                    temp[shoe_data_xyz[j]] = arr.slice(i + j*3, i + j*3 + 1)
                }
                else {
                    temp[shoe_data_xyz[j]] = arr.slice(i + j*3, i + j*3 + 3)
                }
            }
            console.log(counter)
            console.log(shoe_data[0]);
            inertial[shoe_data[counter]] = temp
            counter++;
        }
        
        dict = {
            "time": arr[0],
            "acc": acc,
            "inertial": inertial
        };
        lines[line] = dict;
    }
    localStorage.setItem('data', JSON.stringify(lines));
    location.href = "../visualize";
}