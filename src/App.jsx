import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import VerifyEmail from "./components/verifyEmail";
import Home from "./pages/home";

function App() {
  return (
    <Router>
      <div className='max-w-4xl mx-auto p-4'>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/user/verifyEmail' element={<VerifyEmail />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
