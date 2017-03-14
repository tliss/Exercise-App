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

//function runTest() {
//    var req = new XMLHTTPRequest();
//    req.open("GET", "main.handlebars", true);
//    req.addEventListener("load", function() {
//        console.log("Done:", req.status);
//    });
//    req.send(null);
//}

document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){

    document.getElementById('Submit').addEventListener('click', function(event){
            
        var req = new XMLHttpRequest();
        
        req.open("GET", "http://localhost:8080/notify", true);
        
        //when we get a response from our GET request...
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                document.getElementById('test').textContent=response.content;
            }
            else {
                console.log("Error in network request: " + req.statusText);
            }
        });
        
        req.send(null);
        
        event.preventDefault();
    });        
}