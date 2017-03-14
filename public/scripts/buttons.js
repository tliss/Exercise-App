//document.addEventListener("click", deleteRow);
//
//function deleteRow(tableID,currentRow) {
//    try {
//        var table = document.getElementById(tableID);
//        var rowCount = table.rows.length;
//        for (var i = 0; i < rowCount; i++) {
//            var row = table.rows[i];
//            
//            if (row===currentRow.parentNode.parentNode) {
//                if (rowCount <= 1) {
//                    alert("Cannot delete all the rows.");
//                    break;
//                }
//                table.deleteRow(i);
//                rowCount--;
//                i--;
//            }
//        }
//    } catch (e) {
//        //alert(e);
//    }
//}

//document.addEventListener('click', runTest);

document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){

    document.getElementById('Submit').addEventListener('click', function(event){
            
        var req = new XMLHttpRequest();
        
        req.open("GET", "http://localhost:8080/notify", true);
        
        //when we get a response from our GET request...
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                
                var table = document.getElementById('myTable');
                
                
                for (var row of response.rows){
                    var newId = document.createElement("td");
                    var newName = document.createElement("td");
                    var newReps = document.createElement("td");
                    var newWeight = document.createElement("td");
                    var newDate = document.createElement("td");
                    var newLbs = document.createElement("td");
                    
                    newId.textContent = row.id;
                    newName.textContent = row.name;
                    newReps.textContent = row.reps;
                    newWeight.textContent = row.weight;
                    newDate.textContent = row.date;
                    newLbs.textContent = row.lbs;
                    
                    var newRow = document.createElement("tr");
                    
                    //ADD IN: newRow.appendChild(newId);
                    newRow.appendChild(newName);
                    newRow.appendChild(newReps);
                    newRow.appendChild(newWeight);
                    newRow.appendChild(newDate);
                    newRow.appendChild(newLbs);
                    
                    table.appendChild(newRow);
                }
                
                console.log(response.rows);
                document.getElementById('test').textContent=response.rows;
            }
            else {
                console.log("Error in network request: " + req.statusText);
            }
        });
        
        req.send(null);
        
        event.preventDefault();
    });        
}