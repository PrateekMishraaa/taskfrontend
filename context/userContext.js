import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

const UserContext = React.createContext();

// set axios to include credentials with every request
axios.defaults.withCredentials = true;

export const UserContextProvider = ({ children }) => {
  const serverUrl = "http://localhost:5000/api/v1";

  const router = useRouter();

  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [userState, setUserState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // register user
  const registerUser = async (e) => {
    e.preventDefault();
  
    if (
      !userState.email.includes("@") ||
      !userState.password ||
      userState.password.length < 6
    ) {
      toast.error("Please enter a valid email and password (min 6 characters)");
      return;
    }
  
    try {
      const res = await axios.post(
        `${serverUrl}/signup`, // Remove extra /api/v1 if it's already part of serverUrl
        userState,
        { withCredentials: true } // Ensure credentials are sent
      );
  
      console.log("User registered successfully", res.data);
      toast.success("User registered successfully");
  
      // Clear form state
      setUserState({
        name: "",
        email: "",
        password: "",
      });
  
      // Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Error registering user", error);
  
      // Check if error has a response and message
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };
  

  // login the user
 // login the user
// login the user
const loginUser = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axios.post(
      `${serverUrl}/login`,
      { email: userState.email, password: userState.password },
      { withCredentials: true }
    );

    // Store user data from the response
    const userData = res.data;
    setUser(userData);

    // Store token if provided (both in state and localStorage)
    if (userData.token) {
      localStorage.setItem("token", userData.token);
      // Set axios default header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
    }

    // Reset form state
    setUserState({
      name: "",
      email: "",
      password: "",
    });

    toast.success("User logged in successfully");
    
    // Redirect to dashboard
    router.push("/");
  } catch (error) {
    console.error("Error logging in user:", error);
    const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};
  
  

  // get user Looged in Status
  const userLoginStatus = async () => {
    let loggedIn = false;
    try {
      const res = await axios.get(`${serverUrl}/login-status`, {
        withCredentials: true, // send cookies to the server
      });

      // coerce the string to boolean
      loggedIn = !!res.data;
      setLoading(false);

      if (!loggedIn) {
        router.push("/login");
      }
    } catch (error) {
      console.log("Error getting user login status", error);
    }

    return loggedIn;
  };

  // logout user
  const logoutUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/logout`, {
        withCredentials: true, // send cookies to the server
      });

      toast.success("User logged out successfully");

      setUser({});

      // redirect to login page
      router.push("/login");
    } catch (error) {
      console.log("Error logging out user", error);
      toast.error(error.response.data.message);
    }
  };

  // get user details
  const getUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/user`, {
        withCredentials: true, // send cookies to the server
      });

      setUser((prevState) => {
        return {
          ...prevState,
          ...res.data,
        };
      });

      setLoading(false);
    } catch (error) {
      console.log("Error getting user details", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // update user details
  const updateUser = async (e, data) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.patch(`${serverUrl}/user`, data, {
        withCredentials: true, // send cookies to the server
      });

      // update the user state
      setUser((prevState) => {
        return {
          ...prevState,
          ...res.data,
        };
      });

      toast.success("User updated successfully");

      setLoading(false);
    } catch (error) {
      console.log("Error updating user details", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // email verification
  const emailVerification = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/verify-email`,
        {},
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("Email verification sent successfully");
      setLoading(false);
    } catch (error) {
      console.log("Error sending email verification", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // verify user/email
  const verifyUser = async (token) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/verify-user/${token}`,
        {},
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("User verified successfully");

      // refresh the user details
      getUser();

      setLoading(false);
      // redirect to home page
      router.push("/");
    } catch (error) {
      console.log("Error verifying user", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // forgot password email
  const forgotPasswordEmail = async (email) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/forgot-password`,
        {
          email,
        },
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("Forgot password email sent successfully");
      setLoading(false);
    } catch (error) {
      console.log("Error sending forgot password email", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // reset password
  const resetPassword = async (token, password) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/reset-password/${token}`,
        {
          password,
        },
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("Password reset successfully");
      setLoading(false);
      // redirect to login page
      router.push("/login");
    } catch (error) {
      console.log("Error resetting password", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // change password
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);

    try {
      const res = await axios.patch(
        `${serverUrl}/change-password`,
        { currentPassword, newPassword },
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("Password changed successfully");
      setLoading(false);
    } catch (error) {
      console.log("Error changing password", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // admin routes
 // Fix for getAllUsers function
const getAllUsers = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${serverUrl}/admin/users`, {
      withCredentials: true, // send cookies to the server
    });

    setAllUsers(res.data);
    setLoading(false);
  } catch (error) {
    console.log("Error getting all users", error);
    toast.error(error.response?.data?.message || "Failed to get users");
    setLoading(false);
  }
};

  // dynamic form handler
  const handlerUserInput = (name) => (e) => {
    const value = e.target.value;

    setUserState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // delete user
// Fix for deleteUser function
const deleteUser = async (id) => {
  setLoading(true);
  try {
    const res = await axios.delete(`${serverUrl}/admin/users/${id}`, {
      withCredentials: true, // send cookies to the server
    });

    toast.success("User deleted successfully");
    // refresh the users list
    getAllUsers();
  } catch (error) {
    console.log("Error deleting user", error);
    toast.error(error.response?.data?.message || "Failed to delete user");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    const loginStatusGetUser = async () => {
      const isLoggedIn = await userLoginStatus();

      if (isLoggedIn) {
        await getUser();
      }
    };

    loginStatusGetUser();
  }, []);

  useEffect(() => {
    if (user.role === "admin") {
      getAllUsers();
    }
  }, [user.role]);

  return (
    <UserContext.Provider
      value={{
        registerUser,
        userState,
        handlerUserInput,
        loginUser,
        logoutUser,
        userLoginStatus,
        user,
        updateUser,
        emailVerification,
        verifyUser,
        forgotPasswordEmail,
        resetPassword,
        changePassword,
        allUsers,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
