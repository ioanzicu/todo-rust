import { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm/LoginForm';
import SignInForm from './components/SignInForm/SignInForm';
import TodoApp from './TodoApp';

const App = () => {
  const token = localStorage.getItem('user-token');
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  const handleLoginResponse = (data: any) => {
    console.log("Login succesful:", data);
    console.log("Has token?", !!data.token);

    if (data.token) {
      console.log("Setting token and logging in...");
      setIsLoggedIn(true);
      localStorage.setItem('user-token', data.token);
      console.log("Login state should now be true");
    } else {
      console.error("No token in response:", data);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('user-token');
  };

  if (!isLoggedIn) {
    return (
      <div className="app-container">
        <SignInForm passBackResponse={handleLoginResponse} />
        <LoginForm passBackResponse={handleLoginResponse} />

      </div>
    );
  }

  return (
    <div className="app-container">
      <TodoApp onLogout={handleLogout} />
    </div>
  );
};

export default App;