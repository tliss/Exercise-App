//Taylor Liss - Oregon State University - Prof. Luyao Zhang - CS290 Web Dev 
//Winter 2017 - Week 9 Database Interactions and UI

document.addEventListener('DOMContentLoaded', bindButtons);

//This function binds the submit button or the editSubmit button, depending
//on whether the home page or the update page are called, respectively.
function bindButtons(){
    //*************If a new element is being submitted*************
    if (document.getElementById('Submit')) {
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

            if (payload.name === "" || document.getElementById('reps').value.length === 0 || document.getElementById('weight').value.length === 0 || document.getElementById('date').value.length === 0 || 
                    (document.getElementById('lbsYes').checked===false && document.getElementById('lbsNo').checked===false)) {
                alert("Fields cannot be left empty!");
            } else {
                req.open("POST", "http://localhost:3000/insert", true);

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
            }
        });
      //************If an update is being submitted***************
    } else if (document.getElementById('submitEdit')) {
        document.getElementById('submitEdit').addEventListener('click', function(event){

            var req = new XMLHttpRequest();

            var payload = {};
            payload.id = parseInt(document.getElementById('id').value);
            payload.name = document.getElementById('name').value;
            payload.reps = parseInt(document.getElementById('reps').value);
            payload.weight = parseInt(document.getElementById('weight').value);
            payload.date = document.getElementById('date').value;
            if (document.getElementById('lbsYes').checked){
                payload.lbs = parseInt(document.getElementById('lbsYes').value);
            } else {
                payload.lbs = parseInt(document.getElementById('lbsNo').value);
            }

            if (payload.name === "" || document.getElementById('reps').value.length === 0 || document.getElementById('weight').value.length === 0 || document.getElementById('date').value.length === 0 || 
                (document.getElementById('lbsYes').checked===false && document.getElementById('lbsNo').checked===false)) {
                
                alert("Fields cannot be left empty!");
                
            } else {
                req.open("POST", "http://localhost:3000/update", true);

                //when we get a response from our GET request...
                req.addEventListener('load',function(){
                    if(req.status >= 200 && req.status < 400){

                        console.log("Returned!!!");

                        window.location = "/";

                    }
                    else {
                        console.log("Error in network request: " + req.statusText);
                    }
                });

                req.setRequestHeader('Content-Type', 'application/json');

                req.send(JSON.stringify(payload));
                event.preventDefault();
            }
        });
    }
}

//When this function is called, it sends a request to the getTable route and
//updates the table on the home page with the data returned by calling hte createTable
//function.
function displayTable(){
        
    var req = new XMLHttpRequest();
    
    req.open("POST", "http://localhost:3000/getTable", true);
        
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

//This function is called by displayTable and it takes the data given to it and
//populates the table, while also creating the delete and edit buttons and binding
//them to routes/functions.
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
        
        newId.textContent = row.id;
        newName.textContent = row.name;
        newReps.textContent = row.reps;
        newWeight.textContent = row.weight;
        newDate.textContent = row.date;
        if (row.lbs === 0){
            newLbs.textContent = "No";
        } else {
            newLbs.textContent = "Yes";
        }
        
        //*******DELETE BUTTON*******
        var newDeleteTd = document.createElement("td");
        var newEditTd = document.createElement("td");
        var newDelete = document.createElement("input");
        var newFormDelete = document.createElement("form");
        newDelete.type="submit";
        newDelete.value="Delete";
        newDelete.addEventListener('click', function(){
            deleteRow("myTable", this);
        });
        
        //*******EDIT BUTTON*******
        var newEditButton = document.createElement("input");
        newEditButton.type="button";
        newEditButton.value="Edit";
        
        var newEditForm = document.createElement("form");
        newEditForm.action="/edit";
        newEditForm.method="post";
   
        newEditButton.addEventListener('click', function(){
            var data = {};
            var currentRow = this.parentNode.parentNode.parentNode;
            data.id = currentRow.getElementsByTagName('td')[0].textContent;
            data.name = currentRow.getElementsByTagName('td')[1].textContent;
            data.reps = currentRow.getElementsByTagName('td')[2].textContent;
            data.weight = currentRow.getElementsByTagName('td')[3].textContent;
            data.date = currentRow.getElementsByTagName('td')[4].textContent;
            data.lbs = currentRow.getElementsByTagName('td')[5].textContent;
            
            var package = document.createElement("input");
            package.name = 'package';
            package.value = JSON.stringify(data);
            package.type = "hidden";
           
            newEditForm.append(package);
            newEditForm.submit();
        });
        
        //****************************
        
        var newRow = document.createElement("tr");

        newRow.appendChild(newId);
        newRow.appendChild(newName);
        newRow.appendChild(newReps);
        newRow.appendChild(newWeight);
        newRow.appendChild(newDate);
        newRow.appendChild(newLbs);
        newRow.appendChild(newDeleteTd);
        newDeleteTd.appendChild(newFormDelete);
        newFormDelete.appendChild(newDelete);
        newRow.appendChild(newEditTd);
        newEditTd.appendChild(newEditForm);
        newEditForm.appendChild(newEditButton);

        newTableBody.appendChild(newRow);
    }
    oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody);
    newTableBody.id='myTableBody';
}

//This function is called by the delete button on the home page and it
//deletes the ruow that the button currently exists in.
function deleteRow(tableID, currentRow) {
    
    var req = new XMLHttpRequest();
    var payload = {};
    var rowId = currentRow.parentNode.parentNode.parentNode.firstChild.textContent;
    payload.rowId = rowId;

    //********Removing row from table********
    try {
        var table = document.getElementById(tableID);
        var rowCount = table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            var row = table.rows[i];
            
            if (row===currentRow.parentNode.parentNode.parentNode) {
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
    
    req.open("POST", "http://localhost:3000/remove", true);

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