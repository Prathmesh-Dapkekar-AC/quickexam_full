// // // import React, { createContext, useContext, useState, useEffect } from 'react';
// // // import client from '../api/client';

// // // const AuthContext = createContext();

// // // export const AuthProvider = ({ children }) => {
// // //   const [user, setUser] = useState(null);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     const initAuth = async () => {
// // //       const token = localStorage.getItem('quickexam_token');
// // //       if (token) {
// // //         try {
// // //           const res = await client.get('/auth/me');
// // //           setUser(res.data.user);
// // //         } catch {
// // //           localStorage.removeItem('quickexam_token');
// // //           setUser(null);
// // //         }
// // //       }
// // //       setLoading(false);
// // //     };
// // //     initAuth();
// // //   }, []);

// // //   const login = async (email, password) => {
// // //     const res = await client.post('/auth/login', { email, password });
// // //     localStorage.setItem('quickexam_token', res.data.token);
// // //     setUser(res.data.user);
// // //     return res.data.user;
// // //   };

// // //   const register = async (name, email, password, role) => {
// // //     const res = await client.post('/auth/register', { name, email, password, role });
// // //     localStorage.setItem('quickexam_token', res.data.token);
// // //     setUser(res.data.user);
// // //     return res.data.user;
// // //   };

// // //   const logout = () => {
// // //     localStorage.removeItem('quickexam_token');
// // //     setUser(null);
// // //   };

// // //   return (
// // //     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
// // //       {!loading && children}
// // //     </AuthContext.Provider>
// // //   );
// // // };

// // // export const useAuth = () => useContext(AuthContext);

// // import React, { createContext, useContext, useState, useEffect } from 'react';
// // import api from '../api/axios';

// // const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const savedUser = localStorage.getItem('user');
// //     const token = localStorage.getItem('token');
// //     if (savedUser && token) {
// //       try {
// //         setUser(JSON.parse(savedUser));
// //       } catch {
// //         localStorage.removeItem('user');
// //         localStorage.removeItem('token');
// //       }
// //     }
// //     setLoading(false);
// //   }, []);

// //   const login = async (email, password) => {
// //     const { data } = await api.post('/auth/login', { email, password });
// //     localStorage.setItem('token', data.token);
// //     localStorage.setItem('user', JSON.stringify(data));
// //     setUser(data);
// //     return data;
// //   };

// //   const register = async (name, email, password, role, prn) => {
// //     const { data } = await api.post('/auth/register', {
// //       name,
// //       email,
// //       password,
// //       role,
// //       prn: role === 'student' ? prn : undefined,
// //     });
// //     localStorage.setItem('token', data.token);
// //     localStorage.setItem('user', JSON.stringify(data));
// //     setUser(data);
// //     return data;
// //   };

// //   const logout = () => {
// //     localStorage.removeItem('token');
// //     localStorage.removeItem('user');
// //     setUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
// //       {!loading && children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import api from '../api/client';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const savedUser = localStorage.getItem('user');
//     const token = localStorage.getItem('token');
//     if (savedUser && token) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch {
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     const { data } = await api.post('/auth/login', { email, password });
//     localStorage.setItem('token', data.token);
//     localStorage.setItem('user', JSON.stringify(data));
//     setUser(data);
//     return data;
//   };

//   const register = async (name, email, password, role, prn) => {
//     const { data } = await api.post('/auth/register', {
//       name,
//       email,
//       password,
//       role,
//       prn: role === 'student' ? prn : undefined,
//     });
//     localStorage.setItem('token', data.token);
//     localStorage.setItem('user', JSON.stringify(data));
//     setUser(data);
//     return data;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Direct initial state from localStorage taaki loading delay na ho
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role, prn) => {
    const { data } = await api.post('/auth/register', {
      name,
      email,
      password,
      role,
      prn: role === 'student' ? prn : undefined,
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
