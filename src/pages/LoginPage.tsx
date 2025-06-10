import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, User } from "../contexts/AuthContext";
import { LogIn, Monitor } from "lucide-react";
import axios, { AxiosError } from "axios";
import InputField from "../components/InputField";

const LoginPage: React.FC = () => {
  // const { currentUser, setCurrentUser, users } = useAuth();
  const { setCurrentUser} = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  // const [name, setName] = useState<string>("");
  // const [password, setPassword] = useState<string>('');
  const [login, setLogin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [password, setPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  const [showPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const isLoginValid = validateLogin(login);
    const isPasswordValid = validatePassword(password);

    if (!isLoginValid || !isPasswordValid) {
      return;
    }

    // ====================================================
    try {
      const payload = {
        user: login,
        pwd: password,
      };

      const response = await axios.post(`https://nodejs-web-server2.onrender.com/auth`, payload, {
        // headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(response.data);

      const response2 = await axios.get<User>(
        `https://nodejs-web-server2.onrender.com/user/detailes`,
        {
          withCredentials: true,
        }
      );
      console.log(response2.data);

      if (response2.status !== 200) {
        setError(JSON.stringify(response2.data));
        setCurrentUser(null);
        return;
      }
      setCurrentUser(response2.data);
    } catch (err) {
      setCurrentUser(null);
      // setLoginData(null);
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || err.message || "Failed to login data";
        console.error(errorMessage);
        setError(errorMessage);
      } else {
        console.error(JSON.stringify(err));
      }
      return;
    } finally {
      // setLoading(false);
    }

    // ====================================================

    // if (!currentUser) {
    //   setError('Please select a user to continue');
    //   return;
    // }

    // Navigate to home page on successful login
    navigate("/");
  };

  // Handler for when the Name input changes
  // const handleNameChange =(event: { target: { value: any; }; }) => {
  //   setName(event.target.value); // Update the name state with the input's current value
  // };

  // // Handler for when the Password input changes
  // const handlePasswordChange = (event: { target: { value: any; }; }) => {
  //   setPassword(event.target.value); // Update the password state with the input's current value
  // };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const validateLogin = (login: string): boolean => {
    if (!login) {
      setLoginError("Login is required");
      return false;
    }
    if (login.length < 4) {
      setLoginError("Login must be at least 4 characters long");
      return false;
    }
    setLoginError("");
    return true;
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLogin = e.target.value;
    setLogin(newLogin);
    if (newLogin) {
      validateLogin(newLogin);
    } else {
      setLoginError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword) {
      validatePassword(newPassword);
    } else {
      setPasswordError("");
    }
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters long");
      return false;
    }
    if (password.length > 12) {
      setPasswordError("Password must not exceed 12 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl">
            <Monitor className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2
          className="mt-6 text-center text-3xl font-extrabold text-gray-900"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          IT Asset Hub
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Manage your organization's IT assets efficiently
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* <div className="mb-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>User Simulation (Debug)</span>
          </div> */}

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                Select User
              </label>
              <div className="mt-1">
                <UserSelector />
              </div>
            </div> */}

            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

            <InputField
              label="Login"
              type="login"
              value={login}
              onChange={handleLoginChange}
              onBlur={() => validateLogin(login)}
              placeholder="Enter your login"
              error={loginError}
              required
            />

            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              placeholder="Enter your password (4-12 characters)"
              error={passwordError}
              required
              minLength={4}
              maxLength={12}
            />

            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

            {/* <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name} // The input's value is controlled by the state
            onChange={handleNameChange} // Call the handler function when the input changes
            required // Make the field required for basic HTML validation
          />
        </div>

   
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password" // Use type="password" for browser validation
            id="password"
            value={password} // The input's value is controlled by the state
            onChange={handlePasswordChange} // Call the handler function when the input changes
            required // Make the field required
          />
        </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )} */}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
