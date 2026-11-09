// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import client from '../api/client';
// import { Card } from '../components/ui/card';
// import { Button } from '../components/ui/button';
// import { Badge } from '../components/ui/badge';
// import { Clock, Calendar, AlertCircle } from 'lucide-react';

// export const StudentDashboard = () => {
//   const [exams, setExams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchExams = async () => {
//       try {
//         const res = await client.get('/exams');
//         setExams(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchExams();
//   }, []);

//   const handleStartExam = async (examId) => {
//     try {
//       const res = await client.post('/attempts/start', { examId });
//       navigate(`/exam/${res.data.attemptId}`);
//     } catch (err) {
//       alert(err.response?.data?.error || 'Unable to launch exam');
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Student Assessment Portal</h1>
//           <p className="text-xs text-slate-500 mt-1">Select an active assessment to begin your timed test session</p>
//         </div>
//       </div>

//       {loading ? (
//         <p className="text-sm text-slate-500">Loading scheduled examinations...</p>
//       ) : exams.length === 0 ? (
//         <Card className="text-center py-10">
//           <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
//           <p className="text-sm text-slate-600">No examinations are currently published.</p>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {exams.map(exam => {
//             const now = new Date();
//             const isOpen = now >= new Date(exam.startTime) && now <= new Date(exam.endTime) && exam.status === 'published';

//             return (
//               <Card key={exam._id} className="flex flex-col justify-between">
//                 <div>
//                   <div className="flex justify-between items-start mb-2">
//                     <h3 className="text-base font-semibold text-slate-900">{exam.title}</h3>
//                     <Badge variant={isOpen ? 'green' : 'slate'}>{exam.status.toUpperCase()}</Badge>
//                   </div>
//                   <p className="text-xs text-slate-500 mb-4">{exam.description || 'No additional instructions.'}</p>
                  
//                   <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4">
//                     <div className="flex items-center gap-1.5">
//                       <Clock className="h-3.5 w-3.5 text-indigo-600" />
//                       <span>{exam.durationMinutes} Minutes</span>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <Calendar className="h-3.5 w-3.5 text-indigo-600" />
//                       <span>Closes: {new Date(exam.endTime).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end">
//                   <Button
//                     variant={isOpen ? 'primary' : 'secondary'}
//                     disabled={!isOpen}
//                     onClick={() => handleStartExam(exam._id)}
//                   >
//                     {isOpen ? 'Launch Exam' : 'Window Inactive'}
//                   </Button>
//                 </div>
//               </Card>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Clock, Calendar, AlertCircle } from 'lucide-react';

export const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        // Students ke liye authorized endpoint '/exams/available' hai
        const res = await client.get('/exams/available');
        setExams(res.data || []);
      } catch (err) {
        console.error('Failed to fetch available exams:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleStartExam = async (examId) => {
    try {
      const res = await client.post('/attempts/start', { examId });
      navigate(`/exam/${res.data.attemptId}`);
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Unable to launch exam');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Assessment Portal</h1>
          <p className="text-xs text-slate-500 mt-1">Select an active assessment to begin your timed test session</p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading scheduled examinations...</p>
      ) : exams.length === 0 ? (
        <Card className="text-center py-10">
          <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600">No examinations are currently published.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => {
            const now = new Date();
            const isOpen =
              now >= new Date(exam.startTime) &&
              now <= new Date(exam.endTime) &&
              exam.status === 'published';

            return (
              <Card key={exam._id} className="flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-semibold text-slate-900">{exam.title}</h3>
                    <Badge variant={isOpen ? 'green' : 'slate'}>{exam.status.toUpperCase()}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">{exam.description || 'No additional instructions.'}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-indigo-600" />
                      <span>{exam.durationMinutes} Minutes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Closes: {new Date(exam.endTime).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant={isOpen ? 'primary' : 'secondary'}
                    disabled={!isOpen}
                    onClick={() => handleStartExam(exam._id)}
                  >
                    {isOpen ? 'Launch Exam' : 'Window Inactive'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
