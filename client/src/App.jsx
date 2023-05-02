import React from 'react'
import AOS from 'aos'
import './App.css'
import 'antd/dist/antd.min.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { Home, AllData } from './Screens';
import { Routing } from './Config/routes';

AOS.init()

const App = () => {

  return (
    <div>
      {/* HELLO BAD BANK */}
      {/* <AllData/> */}
      <Routing />
    </div>
  )
}

export default App