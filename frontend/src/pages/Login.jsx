// // import React, { useState } from 'react';
// // import { useNavigate, Link } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// // import { Button } from '../components/ui/button';
// // import { Card } from '../components/ui/card';

// // export const Login = () => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const { login } = useAuth();
// //   const navigate = useNavigate();

// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const user = await login(email, password);
// //       if (user.role === 'teacher') navigate('/teacher');
// //       else navigate('/student');
// //     } catch (err) {
// //       setError(err.response?.data?.error || 'Invalid email or password');
// //     }
// //   };

// //   return (
// //     <div className="flex items-center justify-center py-16 px-4">
// //       <Card className="max-w-md w-full">
// //         <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Welcome Back</h2>
// //         <p className="text-xs text-slate-500 text-center mb-6">Log in to access your assessment portal</p>
// //         {error && <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg mb-4">{error}</div>}
// //         <form onSubmit={handleLogin} className="space-y-4">
// //           <div>
// //             <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
// //             <input
// //               type="email"
// //               required
// //               value={email}
// //               onChange={e => setEmail(e.target.value)}
// //               className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
// //               placeholder="candidate@institution.edu"
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
// //             <input
// //               type="password"
// //               required
// //               value={password}
// //               onChange={e => setPassword(e.target.value)}
// //               className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
// //             />
// //           </div>
// //           <Button type="submit" variant="primary" className="w-full py-2.5">Sign In</Button>
// //         </form>
// //         <p className="text-xs text-slate-500 text-center mt-6">
// //           Need an account? <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Register</Link>
// //         </p>
// //       </Card>
// //     </div>
// //   );
// // };

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { CheckCircle2, AlertCircle } from 'lucide-react';

// export const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const { login, user } = useAuth();
//   const navigate = useNavigate();

//   // Agar user already logged-in hai, toh Login page par rukne na dein, direct dashboard bhej dein
//   useEffect(() => {
//     if (user) {
//       if (user.role === 'teacher') {
//         navigate('/teacher', { replace: true });
//       } else {
//         navigate('/student', { replace: true });
//       }
//     }
//   }, [user, navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const loggedInUser = await login(email, password);
      
//       // Role ke hisaab se dashboard par navigate karein
//       if (loggedInUser.role === 'teacher') {
//         navigate('/teacher', { replace: true });
//       } else {
//         navigate('/student', { replace: true });
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid email or password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        
//         {/* Header */}
//         <div className="text-center">
//           <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center text-white font-black text-2xl shadow-sm mb-4">
//             <CheckCircle2 className="w-7 h-7" />
//           </div>
//           <h2 className="text-2xl font-bold tracking-tight text-slate-900">
//             Welcome Back
//           </h2>
//           <p className="text-xs text-slate-500 mt-1">
//             Log in to access your assessment portal
//           </p>
//         </div>

//         {/* Error Alert Box */}
//         {error && (
//           <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-lg">
//             <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
//             <span>{error}</span>
//           </div>
//         )}

//         <form className="mt-6 space-y-4" onSubmit={handleLogin}>
//           {/* Email */}
//           <div>
//             <label className="block text-xs font-semibold text-slate-700 mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value);
//                 if (error) setError('');
//               }}
//               className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
//               placeholder="candidate@institution.edu"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-xs font-semibold text-slate-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               required
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 if (error) setError('');
//               }}
//               className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
//               placeholder="••••••••"
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
//           >
//             {loading ? 'Signing In...' : 'Sign In'}
//           </button>
//         </form>

//         <p className="text-center text-xs text-slate-500">
//           Need an account?{' '}
//           <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
//             Register
//           </Link>
//         </p>

//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // NOTE: Yahan koi auto-redirect useEffect nahi hona chahiye!

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      
      const role = (loggedInUser.role || '').toLowerCase();
      if (role === 'teacher') {
        navigate('/teacher', { replace: true });
      } else {
        navigate('/student', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center text-white font-black text-2xl shadow-sm mb-4">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Log in to access your assessment portal
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="candidate@institution.edu"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Need an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
