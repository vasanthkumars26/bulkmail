import { useState } from 'react'
import './App.css'
import axios from 'axios'
import * as XLSX from 'xlsx'

function App() {
  
  const [msg,setMsg] = useState("")
  const [status,setStatus] = useState(false)
  const [email,setEmail]= useState([])

  const handlefile = (e)=>{
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
    const totalemail = email.map((item)=>{return item.A})
    console.log(totalemail)
    setEmail(totalemail)
}
reader.readAsBinaryString(file);
  }

  const handlesend = ()=>{
    setStatus(true);
    axios.post("http://localhost:5000/sendemail",{msg:msg,email:email})
    .then((data)=>{
      if(data.data == true){
        alert("Email Sent Successfully!")
        setStatus(false);
      }
      else{
        alert("OOPS!Email Failed to send..")
      }
  })
  }

  return(
    <div>
      <div>
        <h1 className='bg-blue-950 text-white px-5 py-2 text-3xl' >BULKMAIL</h1>
        <p className='bg-blue-800 text-white px-5 py-2 text-md'  >We can Help Your Business with sending multiple emails at once</p>
        <p className='bg-blue-700 text-white px-5 py-2 text-md' >Drag and drop</p>
      </div>
      <div className='bg-blue-400 p-5' >
      <textarea onChange={(e)=>setMsg(e.target.value)} value={msg} name="" id="" className='outline-none w-[70%] p-12 mt-5 border border-black rounded' placeholder='Enter the text...'></textarea>
       <div><input onChange={handlefile} type="file" className='border border-dashed p-2 mt-2' />
  </div> 
        <p className='mt-3' >Total number of Emails in the file:{email.length}</p>
        <button onClick={handlesend} className='mt-3 bg-blue-950 text-white p-2 rounded-xl' >{ status? "Sending..." : "Send"}</button>
      </div>
      <div className='bg-blue-200 p-7' ></div>
      <div className='bg-blue-300 p-8' ></div>
      <div className='bg-blue-100 p-9' ></div>
      <div className='bg-blue-200 p-10' ></div>
      <div className='bg-blue-200 p-1' ></div>
      
    </div>
  )
}

export default App
