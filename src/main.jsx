import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import StarRating from './StarRating.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={5} />
    <StarRating size={24} 
        color='green' 
        className="test" 
        onRateChange={(rate)=>console.log(rate)}
        defaultRating={3} />
    <p>The rate is X</p> */}
  </React.StrictMode>,
)
