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
//     try {
//       const user = await register(name, email, password, role);
//       if (user.role === 'teacher') navigate('/teacher');
//       else navigate('/student');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Registration failed');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center py-16 px-4">
//       <Card className="max-w-md w-full">
//         <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Create Account</h2>
//         <p className="text-xs text-slate-500 text-center mb-6">Join QuickExam assessment network</p>
//         {error && <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg mb-4">{error}</div>}
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
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
//             />
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
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Frontend validation: 6 characters se kam par turant warning dena
    if (password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye!');
      return;
    }

    try {
      const user = await register(name, email, password, role);
      if (user.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      // 2. Backend Zod validation errors ko handle karna
      const data = err.response?.data;
      if (data?.details && data.details.length > 0) {
        setError(data.details.map(d => `${d.path}: ${d.message}`).join(', '));
      } else {
        setError(data?.error || 'Registration failed');
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Create Account</h2>
        <p className="text-xs text-slate-500 text-center mb-6">Join QuickExam assessment network</p>
        
        {/* Red warning box */}
        {error && (
          <div className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}  /* HTML5 native validation fallback */
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              placeholder="Minimum 6 characters"
            />
            {password.length > 0 && password.length < 6 && (
              <p className="text-[11px] text-amber-600 mt-1">
                Password 6 characters se chhota hai ({password.length}/6)
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="student">Student / Candidate</option>
              <option value="teacher">Teacher / Instructor</option>
            </select>
          </div>
          <Button type="submit" variant="primary" className="w-full py-2.5">Complete Registration</Button>
        </form>
        <p className="text-xs text-slate-500 text-center mt-6">
          Already registered? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign In</Link>
        </p>
      </Card>
    </div>
  );
};
