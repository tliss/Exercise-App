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

function runTest() {
    console.log("Hello from inside clien-side js");
}