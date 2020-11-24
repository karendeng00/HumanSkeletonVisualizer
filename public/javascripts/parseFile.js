var res = []

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

async function parseData(result) {
    var lines = result.split('\n');
    

    var db;
    let request = window.indexedDB.open("DB2"); //opens a database called HAR using version 1
    
    request.onerror = function(event) {
        console.log("Could not open database")
    };

    request.onupgradeneeded = function() { //creates database if it doesn't already exist
        console.log("hello")
        db = request.result;
        if (!db.objectStoreNames.contains('SensorData')) { // if there's no "books" store
            db.createObjectStore('SensorData', {keyPath: 'id', autoIncrement: true}); // create it
        }
    }
    request.onsuccess= function() { //creates database if it doesn't already exist
        console.log("what")
        db = request.result;
        console.log(db)
        if (!db.objectStoreNames.contains('SensorData')) { // if there's no "books" store
            db.createObjectStore('SensorData', {keyPath: 'id', autoIncrement: true}); // create it
        }
        // let transaction = db.transaction("SensorData", "readwrite");
        // let dbrequest = transaction.objectStore("SensorData").add(dict);
    }   
    
    
    for(var line = 0; line < lines.length; line += lines.length / 10){
        // if (!lines[line].includes("NaN")) { //for now stops once you hit a line with missing data
        //     continue;
        // }

        var dict = new Object();
        var arr = lines[line].split(' ')
        var acc = new Object();
        var food = new Object();
        var furniture_reed = new Object();
        var furniture_acc = new Object();
        var inertial = new Object();
        var location = new Object();
        var acc_data = ["RKN^", "HIP", "LUA^", "RUA_", "LH", "BACK", "RKN_", "RWR", "RUA^", "LUA_", "LWR", "RH"];
        var inertial_data = ["BACK", "RUA", "RLA", "LUA", "LLA"];
        var inertial_data_xyz = ["acc", "gyro", "magnetic", "quaternion"];
        var shoe_data = ["LSHOE", "RSHOE"];
        var shoe_data_xyz = ["Eu", "Nav", "Body", "AngVelBodyFrame", "AngVelNavFrame", "Compass"]
        var food_data = ["CUP", "SALAMI", "WATER", "CHEESE", "BREAD", "KNIFE1", "MILK", "SPOON", "SUGAR", "KNIFE2", "PLATE", "GLASS"];
        var furniture_reed_data = ["DISHWASHER S1", "FRIDGE S3", "FRIDGE S2", "FRIDGE S1", "MIDDLEDRAWER S1", "MIDDLEDRAWER S2", "MIDDLEDRAWER S3", "LOWERDRAWER S3", "LOWERDRAWER S2", "UPPERDRAWER", "DISHWASHER S3", "LOWERDRAWER S1", "DISHWASHER S2"];
        var furniture_acc_data = ["DOOR1", "LAZYCHAIR", "DOOR2", "DISHWASHER", "UPPERDRAWER", "LOWERDRAWER", "MIDDLEDRAWER", "FRIDGE"];
        var location_data = ["TAG1", "TAG2", "TAG3", "TAG4"];
        
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
            inertial[shoe_data[counter]] = temp
            counter++   
        }
        // counter = 0
        // for(var i = 134; i <= 193; i += 5) {
        //     var temp = new Object()
        //     temp["acc"] = arr.slice(i, i + 3)
        //     temp["gyro"] = arr.slice(i + 3, i + 5);
        //     food[food_data[counter]] = temp
        //     counter++
        // }
        
        // counter = 0
        // for(var i = 194; i <= 206; i++) {
        //     furniture_reed[furniture_reed_data[counter]] = arr.slice(i, i+1)
        //     counter++
        // }

        // counter = 0
        // for(var i = 207; i <= 230; i+=3) {
        //     furniture_acc[furniture_acc_data[counter]] = arr.slice(i, i+3)
        //     counter++
        // } 
        
        // counter = 0 
        // for(var i = 231; i <= 242; i += 3) {
        //     location[location_data[counter]] = arr.slice(i, i+3)
        //     counter++
        // }
        dict = {
            "id": "" + line,
            "time": arr[0],
            "acc": acc,
            "inertial": inertial,
            // "food": food,
            // "furniture_reed": furniture_reed,
            // "furniture_acc": furniture_acc,
            // "location": location
        }
        res.push(dict)
    }

    request.onsuccess = function() { // (4)
        db = request.result;
        
        let transaction = db.transaction(["SensorData"], "readwrite");
        let sensorData = transaction.objectStore("SensorData");
        res.forEach(function(customer) {
            var dbrequest = sensorData.add(customer);
            
            dbrequest.onsuccess = function() {
                console.log("Book added to the store", dbrequest.result);
                console.log(sensorData)
            };
            
            dbrequest.onerror = function(event) {
                console.log("Error", event.target.result);
            };
        });
        
    }

    
    localStorage.setItem('file', JSON.stringify(res));
    
    window.location.href = "../visualize";
   
}