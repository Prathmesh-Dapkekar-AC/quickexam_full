// // import jwt from 'jsonwebtoken';
// // import User from '../models/User.js';

// // export const authenticate = async (req, res, next) => {
// //   const authHeader = req.headers.authorization;
// //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //     return res.status(401).json({ error: 'Unauthorized: Missing or malformed token' });
// //   }

// //   const token = authHeader.split(' ')[1];
// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     const user = await User.findById(decoded.id).select('-passwordHash');
// //     if (!user || !user.isActive) {
// //       return res.status(401).json({ error: 'Account not found or inactive' });
// //     }
// //     req.user = user;
// //     next();
// //   } catch (err) {
// //     return res.status(401).json({ error: 'Invalid or expired token' });
// //   }
// // };

// // export const authorize = (roles = []) => {
// //   return (req, res, next) => {
// //     if (!roles.includes(req.user.role)) {
// //       return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
// //     }
// //     next();
// //   };
// // };

// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// export const authenticate = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Unauthorized: Missing or malformed token' });
//   }

//   const token = authHeader.split(' ')[1];
//   try {
//     // 1. JWT_SECRET with same fallback as controller
//     const secret = process.env.JWT_SECRET || 'secret_key';
//     const decoded = jwt.verify(token, secret);

//     const user = await User.findById(decoded.id).select('-password');
//     if (!user) {
//       return res.status(401).json({ error: 'Account not found' });
//     }

//     // 2. Safe check: only block if explicitly set to false
//     if (user.isActive === false) {
//       return res.status(401).json({ error: 'Account is inactive' });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('JWT Auth Error:', err.message);
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };

// export const authorize = (roles = []) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
//     }
//     next();
//   };
// };

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or malformed token' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'secret_key';
    
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (jwtErr) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.id || decoded._id;

    // CastError prevention: agar userId valid MongoDB ObjectId nahi hai toh return karein
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: 'Invalid user token payload' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Account not found' });
    }

    if (user.isActive === false) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware unhandled error:', err.message);
    return res.status(500).json({ error: 'Internal authentication error' });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
