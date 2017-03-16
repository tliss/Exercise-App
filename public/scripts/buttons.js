document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){

    document.getElementById('Submit').addEventListener('click', function(event){
            
        var req = new XMLHttpRequest();
        
        var payload = {};
        payload.name = document.getElementById('name').value;
        payload.reps = parseInt(document.getElementById('reps').value);
        payload.weight = parseInt(document.getElementById('weight').value);
        payload.date = document.getElementById('date').value;
        if (document.getElementById('lbsYes').checked){
            payload.lbs = parseInt(document.getElementById('lbsYes').value);
        } else {
            payload.lbs = parseInt(document.getElementById('lbsNo').value);
        }
        
        req.open("POST", "http://localhost:8080/notify", true);
        
        //when we get a response from our GET request...
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                
                var response = JSON.parse(req.responseText);
                
                createTable(response);

            }
            else {
                console.log("Error in network request: " + req.statusText);
            }
        });
        
        req.setRequestHeader('Content-Type', 'application/json');

        req.send(JSON.stringify(payload));
        
        var form = document.getElementById('myField');
        form.reset();
        
        event.preventDefault();
    });        
}

function displayTable(){
        
    var req = new XMLHttpRequest();
    
    req.open("POST", "http://localhost:8080/getTable", true);
        
    //when we get a response from our GET request...
    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){

            var response = JSON.parse(req.responseText);

            createTable(response);

        }
        else {
            console.log("Error in network request: " + req.statusText);
        }
    });

    req.setRequestHeader('Content-Type', 'application/json');

    req.send(null);

    event.preventDefault();
}

function createTable(response) {
    var oldTableBody = document.getElementById('myTableBody');

    var newTableBody = document.createElement('tbody');

    for (var row of response.rows){
        var newId = document.createElement("td");
        var newName = document.createElement("td");
        var newReps = document.createElement("td");
        var newWeight = document.createElement("td");
        var newDate = document.createElement("td");
        var newLbs = document.createElement("td");
        var newDelete = document.createElement("input");
        var newForm = document.createElement("form");

        newId.textContent = row.id;
        newName.textContent = row.name;
        newReps.textContent = row.reps;
        newWeight.textContent = row.weight;
        newDate.textContent = row.date;
        newLbs.textContent = row.lbs;
        newDelete.type="button";
        newDelete.value="Delete";
        newDelete.addEventListener('click', function(){
            deleteRow("myTable", this);
        });

        var newRow = document.createElement("tr");

        newRow.appendChild(newId);
        newRow.appendChild(newName);
        newRow.appendChild(newReps);
        newRow.appendChild(newWeight);
        newRow.appendChild(newDate);
        newRow.appendChild(newLbs);
        newRow.appendChild(newForm);
        newForm.appendChild(newDelete);

        newTableBody.appendChild(newRow);
    }
    oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody);
    newTableBody.id='myTableBody';
}

function deleteRow(tableID, currentRow) {
    
    var req = new XMLHttpRequest();
        
    var payload = {};
    
    var rowId = currentRow.parentNode.parentNode.firstChild.textContent;
    
    payload.rowId = rowId;

    //********Removing row from table********
    try {
        var table = document.getElementById(tableID);
        var rowCount = table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            var row = table.rows[i];
            
            if (row===currentRow.parentNode.parentNode) {
                if (rowCount <= 1) {
                    alert("Cannot delete all the rows.");
                    break;
                }
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        //alert(e);
    }
    
    //*********Removing row from database********
    var req = new XMLHttpRequest();
    
    req.open("POST", "http://localhost:8080/remove", true);
        
    //when we get a response from our GET request...
    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){

        displayTable();

        }
        else {
            console.log("Error in network request: " + req.statusText);
        }
    });

    req.setRequestHeader('Content-Type', 'application/json');

    req.send(JSON.stringify(payload));

    event.preventDefault();
}