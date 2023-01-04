/**
 * References:
 * https://www.javatpoint.com/browserrouter-in-react
 * */

import './App.css';
import { Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Details from './pages/Details';
import Navbar from './pages/Navbar';

function App() {
  return (
    <div className="App">
        <Navbar />
        <Routes>
          <Route path='/about' element={<About />} />
          <Route path='/sign-in' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/details' element={<Details />} />
      </Routes>
    </div>
  );
}

export default App;
