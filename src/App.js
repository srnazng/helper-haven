import './App.css';
import React, { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import '@fontsource/roboto';
import theme from './styles.js';
import { ThemeProvider } from '@material-ui/styles';

function App() {
  const [page, setPage] = useState("dashboard");
  const [token, setToken] = useState(localStorage.getItem("token") || null)

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {page === "register" ? <Register setPage={setPage} setToken={setToken} /> :
          (page === "dashboard" || page === "profile") && token ? <Dashboard page={page} setPage={setPage} /> :
            <Login setPage={setPage} setToken={setToken} />}
      </div>
    </ThemeProvider>
  );
}

export default App;
