import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';


const Manager = () => {
  const ref = useRef()
  const passwordRef = useRef()
  const [form, setform] = useState({ site: "", username: "", password: "" })
  const [passwordArray, setPasswordArray] = useState([])

  const getpasswords= async() => {
    let req=  await fetch("http://localhost:3000/")
    let passwords = await req.json();
    console.log(passwords)
      setPasswordArray(passwords)
    
  }
  

  useEffect(() => {
    getpasswords()
    

   

  }, [])



  const showpassword = () => {

    passwordRef.current.type = "text"
    if (ref.current.src.includes("crosseye.png")) {
      ref.current.src = "openeye.png"
      passwordRef.current.type = "password"
    }
    else {
      passwordRef.current.type = "text"
      ref.current.src = "crosseye.png"

    }
  }

  const savePassword = async() => {

    
    if(form.site.length>3 && form.username.length>3 && form.password.length>3){
    setPasswordArray([...passwordArray, {...form, id: uuidv4()}])

    //if any Id exist then delete it
    await fetch("http://localhost:3000/",{method:"DELETE",headers:{"content-type":"application/json"},
      body:JSON.stringify({id:form.id}) })



     await fetch("http://localhost:3000/",{method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({...form,id:uuidv4()}) })
   // localStorage.setItem("passwords", JSON.stringify([...passwordArray, {...form, id: uuidv4()}]))
   // console.log([...passwordArray, form])
  }

else{
  alert('password not valid');
}
}

  const deletePassword  = async(id)=>{
    console.log("Deleting password with id", id)
    setPasswordArray(passwordArray.filter(item=>item.id!==id))
    let res = await fetch("http://localhost:3000/",{method:"DELETE",headers:{"content-type":"application/json"},
      body:JSON.stringify({id}) })
    //localStorage.setItem("passwords",JSON.stringify(passwordArray.filter(item=>item.id!==id)))
  }
  const editPassword  = (id)=>{
    console.log("Editing password with id", id)
    setform({...passwordArray.filter(i=>i.id===id)[0],id:id})
    setPasswordArray(passwordArray.filter(item=>item.id!==id))
  }

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),
      linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div></div>

      <div className=" mx-auto  p-2 md:p-0 md:mycontainer min-h-[88.2vh]">

        <h2 className='text-4xl font-bold text-center'>

          <span className="text-green-600"> &lt; </span>
          Pass
          <span className="text-green-600">Manager/ &gt;</span>
        </h2>

        <p className="text-green-900 text-lg text-center">Your Own Password Manager</p>

        <div className=" flex flex-col p-4 text-black gap-8 items-center">
          <input value={form.site} onChange={handleChange} placeholder='Enter Website URL' className='rounded-full border border-green-500 w-full p-4 py-1 text-black ' type="text" name="site" id="site" />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input value={form.username} onChange={handleChange} placeholder='Enter username' className='rounded-full border border-green-500 w-full p-4 py-1 text-black' type="text" name="username" id="username" />

            <div className="relative">
              <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter password' className='rounded-full border border-green-500 w-full p-4 py-1 text-black' type="password" name="password" id="password" />
              <span className='absolute right-[1px] top-[9px] cursor-pointer' onClick={showpassword}>
                <img ref={ref} className='p-1' width={30} src="/openeye.png" alt="eye" />
              </span>
            </div>
          </div>

          <button onClick={savePassword} className='flex justify-center items-center bg-green-500 rounded-full px-4 py-2 w-fit hover:bg-green-400'>
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
            >
            </lord-icon>
            Add password</button>
        </div>

        <div className="passwords">
          <h2 className='font-bold text-xl py-4'>Your Passwords</h2>
          {passwordArray.length === 0 && <div>No passwords to show</div>}

          {passwordArray.length !== 0 && <table className="table-auto w-full rounded-md overflow-hidden">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className='py-2'>Site</th>
                <th className='py-2'>username</th>
                <th className='py-2'>passwords</th>
                <th className='py-2'>Actions</th>

              </tr>
            </thead>
            <tbody className='bg-green-100'>
              {passwordArray.map((item, index) => {
                return <tr key={index}>
                  <td className='text-center w-32  text-black '><a href={item.site} target="_blank">{item.site} </a></td>
                  <td className='text-center w-32 text-black'>{item.username}</td>
                  <td className='text-center w-32 text-black'>{item.password}</td>
                  <td className='justify-center py-2 border-white text-center'>
                    <span className='cursor-pointer' onClick={()=>{editPassword(item.id)}}>
                      <lord-icon
                        src="https://cdn.lordicon.com/wvdxdmpi.json"
                        trigger="hover"
                        style={{ "width": "25px", "height": "25px" }}>
                      </lord-icon>
                    </span>

                    <span className='cursor-pointer'  onClick={()=>{deletePassword(item.id)}}>
                      <lord-icon
                        src="https://cdn.lordicon.com/skkahier.json"
                        trigger="hover"
                        style={{"width":"25px","height":"25px"}}>
                      </lord-icon>
                    </span>
                  </td>
                </tr>
              })}
            </tbody>
          </table>}

        </div>
      </div>

    </>
  )
}

export default Manager
