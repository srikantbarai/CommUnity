import { useEffect } from 'react';
import './App.css'
import axios from "axios"

function App() {

  const fetchAPI = async () => {
    const res = await axios.get("http://localhost:8080/api");
    console.log(res);
  }

  useEffect(()=>{
    fetchAPI();
  },[])

  return (
    <>
      
    </>
  )
}

export default App
