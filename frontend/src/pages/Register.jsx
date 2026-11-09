// // import React, { useState } from 'react';
// // import { useNavigate, Link } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// // import { Button } from '../components/ui/button';
// // import { Card } from '../components/ui/card';

// // export const Register = () => {
// //   const [name, setName] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [role, setRole] = useState('student');
// //   const [error, setError] = useState('');
// //   const { register } = useAuth();
// //   const navigate = useNavigate();

// //   const handleRegister = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const user = await register(name, email, password, role);
// //       if (user.role === 'teacher') navigate('/teacher');
// //       else navigate('/student');
// //     } catch (err) {
// //       setError(err.response?.data?.error || 'Registration failed');
// //     }
// //   };

// //   return (
// //     <div className="flex items-center justify-center py-16 px-4">
// //       <Card className="max-w-md w-full">
// //         <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Create Account</h2>
// //         <p className="text-xs text-slate-500 text-center mb-6">Join QuickExam assessment network</p>
// //         {error && <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg mb-4">{error}</div>}
// //         <form onSubmit={handleRegister} className="space-y-4">
// //           <div>
// //             <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
// //             <input
// //               type="text"
// //               required
// //               value={name}
// //               onChange={e => setName(e.target.value)}
// //               className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
// //             <input
// //               type="email"
// //               required
// //               value={email}
// //               onChange={e => setEmail(e.target.value)}
// //               className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
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
// //           <div>
// //             <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
// //             <select
// //               value={role}
// //               onChange={e => setRole(e.target.value)}
// //               className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
// //             >
// //               <option value="student">Student / Candidate</option>
// //               <option value="teacher">Teacher / Instructor</option>
// //             </select>
// //           </div>
// //           <Button type="submit" variant="primary" className="w-full py-2.5">Complete Registration</Button>
// //         </form>
// //         <p className="text-xs text-slate-500 text-center mt-6">
// //           Already registered? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign In</Link>
// //         </p>
// //       </Card>
// //     </div>
// //   );
// // };

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Button } from '../components/ui/button';
// import { Card } from '../components/ui/card';

// export const Register = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('student');
//   const [error, setError] = useState('');
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError('');

//     // 1. Frontend validation: 6 characters se kam par turant warning dena
//     if (password.length < 6) {
//       setError('Password should at least contain 6 characters!');
//       return;
//     }

//     try {
//       const user = await register(name, email, password, role);
//       if (user.role === 'teacher') navigate('/teacher');
//       else navigate('/student');
//     } catch (err) {
//       // 2. Backend Zod validation errors ko handle karna
//       const data = err.response?.data;
//       if (data?.details && data.details.length > 0) {
//         setError(data.details.map(d => `${d.path}: ${d.message}`).join(', '));
//       } else {
//         setError(data?.error || 'Registration failed');
//       }
//     }
//   };

//   return (
//     <div className="flex items-center justify-center py-16 px-4">
//       <Card className="max-w-md w-full">
//         <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Create Account</h2>
//         <p className="text-xs text-slate-500 text-center mb-6">Join QuickExam assessment network</p>
        
//         {/* Red warning box */}
//         {error && (
//           <div className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleRegister} className="space-y-4">
//           <div>
//             <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
//             <input
//               type="text"
//               required
//               value={name}
//               onChange={e => setName(e.target.value)}
//               className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
//             <input
//               type="password"
//               required
//              // minLength={6}  /* HTML5 native validation fallback */
//               value={password}
//               onChange={e => {
//                 setPassword(e.target.value);
//                 if (error) setError('');
//               }}
//               className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
//               placeholder="Minimum 6 characters"
//             />
//             {password.length > 0 && password.length < 6 && (
//               <p className="text-[11px] text-amber-600 mt-1">
//                 Password should at least contain 6 characters! ({password.length}/6)
//               </p>
//             )}
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
//             <select
//               value={role}
//               onChange={e => setRole(e.target.value)}
//               className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="student">Student / Candidate</option>
//               <option value="teacher">Teacher / Instructor</option>
//             </select>
//           </div>
//           <Button type="submit" variant="primary" className="w-full py-2.5">Complete Registration</Button>
//         </form>
//         <p className="text-xs text-slate-500 text-center mt-6">
//           Already registered? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign In</Link>
//         </p>
//       </Card>
//     </div>
//   );
// };

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [prn, setPrn] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (role === 'student' && !prn.trim()) {
      setError('Please provide your PRN / Roll Number!');
      return;
    }

    if (password.length < 6) {
      setError('Password should at least contain 6 characters!');
      return;
    }

    setLoading(true);
    try {
      const user = await register(name, email, password, role, prn);
      if (user.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        
        {/* Brand & Heading */}
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center text-white font-black text-2xl shadow-sm mb-4">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Create an account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Join QuickExam to access automated tests and scorecards
          </p>
        </div>

        {/* Custom Red Error Alert Box */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleRegister}>
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. John Doe"
            />
          </div>

          {/* Email Address */}
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
              placeholder="name@example.com"
            />
          </div>

          {/* Account Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (error) setError('');
              }}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 bg-white outline-none"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* PRN / Roll Number Field (Visible strictly for students) */}
          {role === 'student' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PRN / Roll Number
              </label>
              <input
                type="text"
                required
                value={prn}
                onChange={(e) => {
                  setPrn(e.target.value.toUpperCase());
                  if (error) setError('');
                }}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-mono tracking-wider"
                placeholder="e.g. 260801 or DAC-042"
              />
            </div>
          )}

          {/* Password Field */}
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
              placeholder="Minimum 6 characters"
            />
            {password.length > 0 && password.length < 6 && (
              <p className="text-[11px] text-amber-600 mt-1">
                Password must be at least 6 characters ({password.length}/6)
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;