document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
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

            req.open("POST", "http://localhost:3000/notify", true);

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
}

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
        var newDeleteTd = document.createElement("td");
        var newDelete = document.createElement("input");
        var newFormDelete = document.createElement("form");
        var newEditTd = document.createElement("td");
        var newEdit = document.createElement("input");
        var newFormEdit = document.createElement("form");

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
        newDelete.type="button";
        newDelete.value="Delete";
        newDelete.addEventListener('click', function(){
            deleteRow("myTable", this);
        });
        newEdit.type="button";
        newEdit.value="Edit";
        newEdit.addEventListener('click', function(){
            editRow("myTable", this);
        });
        

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
        newEditTd.appendChild(newFormEdit);
        newFormEdit.appendChild(newEdit);

        newTableBody.appendChild(newRow);
    }
    oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody);
    newTableBody.id='myTableBody';
}

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

function editRow(tableID, element) {
    
    var req;

    req = new XMLHttpRequest();

    if (!req) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
    }
    
    req.open('GET', 'http://localhost:3000/update');
    req.send();
};
    
//    var req = new XMLHttpRequest();
//    var payload = {};
//    payload.tableID = tableID;
//    payload.element = element;
//    
//    req.open("GET", "http://localhost:3000/update", false);    
//    
//    req.setRequestHeader('Content-Type', 'application/json');
//
//    req.send(JSON.stringify(payload));
//
//    req.send(payload);


//    var payload = {};
//
//    var currentRow = element.parentNode.parentNode.parentNode;
//    
//    var id = currentRow.getElementsByTagName('td')[0].textContent;
//    var name = currentRow.getElementsByTagName('td')[1].textContent;
//    var reps = currentRow.getElementsByTagName('td')[2].textContent;
//    var weight = currentRow.getElementsByTagName('td')[3].textContent;
//    var date = currentRow.getElementsByTagName('td')[4].textContent;
//    var lbs = currentRow.getElementsByTagName('td')[5].textContent;
//    
//    var newName = document.createElement("input");
//    newName.type = "text";
//    newName.name = "name";
//    newName.value = name;
//    var newReps = document.createElement("input");
//    newReps.type = "number";
//    newReps.name = "reps";
//    newReps.value = reps;
//    var newWeight = document.createElement("input");
//    newWeight.type = "number";
//    newWeight.name = "weight";
//    newWeight.value = weight;
//    var newDate = document.createElement("input");
//    newDate.type = "date";
//    newDate.name = "date";
//    newDate.value = date;
//    var newLbsYes = document.createElement("input");
//    newLbsYes.type = "radio";
//    newLbsYes.name = "lbs";
//    newLbsYes.id = "lbsEditYes";
//    newLbsYes.value = 1;
//    var newLbsNo = document.createElement("input");
//    newLbsNo.type = "radio";
//    newLbsNo.name = "lbs";
//    newLbsNo.id = "lbsEditNo";
//    newLbsNo.value = 0;
//    
//    colNumber = currentRow.parentNode.parentNode.rows[0].cells.length;
//
//    for (var i = 1; i < colNumber; i++) {
//        var workingTd = currentRow.getElementsByTagName('td')[i];
//        var newForm = document.createElement("form");
//        workingTd.textContent="";
//        workingTd.appendChild(newForm);
//
//        
//        switch (i) {
//            case 1:
//                newForm.appendChild(newName);
//                break;
//            case 2:
//                newForm.appendChild(newReps);
//                break;
//            case 3:
//                newForm.appendChild(newWeight);
//                break;
//            case 4:
//                newForm.appendChild(newDate);
//                break;
//            case 5:
//                var yesTag = document.createElement("p");
//                yesTag.textContent="Yes";
//                var noTag = document.createElement("p");
//                noTag.textContent="No";
//                newForm.appendChild(yesTag);
//                newForm.appendChild(newLbsYes);
//                newForm.appendChild(noTag);
//                newForm.appendChild(newLbsNo);
//                
//        }
//    }
//
//    payload.rowId = rowId;
    
//}