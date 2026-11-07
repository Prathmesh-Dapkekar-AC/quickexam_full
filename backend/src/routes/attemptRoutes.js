import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  startAttempt,
  syncAttempt,
  saveAnswer,
  logViolation,
  submitAttempt,
  getResult
} from '../controllers/attemptController.js';

const router = Router();
router.use(authenticate);

router.post('/start', authorize(['student']), startAttempt);
router.get('/:id/sync', syncAttempt);
router.patch('/:id/save', saveAnswer);
router.post('/:id/violations', logViolation);
router.post('/:id/submit', submitAttempt);
router.get('/:id/result', getResult);

export default router;
