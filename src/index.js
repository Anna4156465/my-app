//React imports:
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';
import ReactDOM from 'react-dom/client';

//Pages imports:
import App from './App';
import Login from './Login'

//Create context for global variables:
const UserContext = createContext();

//Configure the context_
const MyProvider = () => {
  const [rol, setRol] = useState("");

  return (
    <UserContext.Provider value={{ rol, setRol }}>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Login />} />
          <Route path="/app/" element={<App />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};
export default UserContext;

//Render the page:
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MyProvider />
);