/**
 * References:
 * https://www.javatpoint.com/browserrouter-in-react
 * */

import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Signup from './pages/Signup';
import Details from './pages/Details';
import Navbar from './pages/Nav';
import LoggedIn from "./pages/LoggedIn";
import MemeMaker from "./pages/MemeMaker";

function App() {
  return (
    <div className="App">
        <Navbar />
        <Routes>
          <Route path='/about' element={<About />} />
          <Route path='/sign-in' element={<Login />} />
        <Route path='/' element={<Overview />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/details' element={<Details />} />
            <Route path='/userDetails' element={<LoggedIn/>}/>
            <Route path='/mememaker' element={<MemeMaker/>} />

        </Routes>
    </div>
  );
}

export default App;
