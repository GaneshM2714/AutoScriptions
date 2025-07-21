import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Homepage from './Homepage'
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import ProfileSettings from './components/ProfileSettings';
import Preferences from './components/Preferences'; 
import Subscriptions from './components/Subscriptions';

function App() {
  return (
    <>
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/dashboard' element = {<Dashboard/>}/>
        <Route path='/profile' element = {<ProfileSettings/>}/>
        <Route path='/preferences' element = {<Preferences/>}/>
        <Route path='/subscriptions' element = {<Subscriptions/>}/>
      </Routes>
    </BrowserRouter>     
    </>
  );
}

export default App
