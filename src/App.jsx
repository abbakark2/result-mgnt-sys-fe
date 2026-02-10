import { useState } from 'react'
import './App.css'
import logo from './assets/logo.png';

function App() {

  return (
    <>
      <header className='myborder'>
        <div className='flex'>
          <div>
            <img src={logo} alt="fes logo" />
          </div>
          <div>
            This is the header
          </div>
          <div>
            <Link>Login</Link>
          </div>
        </div>
      </header>
    </>
  )
}

export default App
