/**
 * References:
 * https://www.javatpoint.com/browserrouter-in-react
 * */

import './styles/App.css';
import {Routes, Route} from 'react-router-dom';
import About from './pages/About';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Signup from './pages/Signup';
import Navbar from './pages/Nav';
import MemeMaker from "./pages/MemeMaker";
import SingleView from "./pages/SingleView";
import History from "./pages/History";
import Profile from "./pages/Profile";
import MyComments from "./pages/MyComments";
import Api from "./pages/Api";

function App() {
    return (
        <div className="App">
            <Navbar/>
            <Routes>
                <Route path='/about' element={<About/>}/>
                <Route path='/sign-in' element={<Login/>}/>
                <Route path='/' element={<Overview/>}/>
                <Route path='/sign-up' element={<Signup/>}/>
                <Route path='/mememaker' element={<MemeMaker/>}/>
                <Route path='/m/:id' element={<SingleView/>}/>
                <Route path='/my-memes' element={<History/>}/>
                <Route path='/profile' element={<Profile/>}/>
                <Route path='/my-comments' element={<MyComments/>}/>
                <Route path='/api' element={<Api/>}/>
            </Routes>
        </div>
    );
}

export default App;
