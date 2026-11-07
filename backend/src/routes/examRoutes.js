import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  getExams,
  createExam,
  getExamById,
  updateExamStatus,
  addQuestion,
  deleteQuestion,
  getExamAnalytics,
  createExamSchema
} from '../controllers/examController.js';

const router = Router();
router.use(authenticate);

router.get('/', getExams);
router.post('/', authorize(['teacher', 'admin']), validateBody(createExamSchema), createExam);
router.get('/:id', getExamById);
router.patch('/:id/status', authorize(['teacher', 'admin']), updateExamStatus);
router.post('/:id/questions', authorize(['teacher', 'admin']), addQuestion);
router.delete('/:id/questions/:qId', authorize(['teacher', 'admin']), deleteQuestion);
router.get('/:id/analytics', authorize(['teacher', 'admin']), getExamAnalytics);

export default router;
