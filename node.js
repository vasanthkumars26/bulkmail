
const fileselection = document.getElementById("fileselection")

fileselection.addEventListener("change",(e)=>{
const file =  e.target.files[0];
console.log(file)

const reader = new FileReader();
reader.onload = function(e){
    const data = e.target.result;
    const workbook = XLSX.read(data,{type: 'binary' })
    console.log(workbook);
    const sheetname = workbook.SheetNames[0];
    const worksheets = workbook.Sheets[sheetname];
    const email = XLSX.utils.sheet_to_json(worksheets,{header : 'A'});
    console.log(email)
}


reader.readAsBinaryString(file);

})