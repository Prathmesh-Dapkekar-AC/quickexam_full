import cron from 'node-cron';
import Attempt from '../models/Attempt.js';
import { evaluateAttemptLogic } from '../controllers/attemptController.js';

export const initSweeperJob = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const expiredAttempts = await Attempt.find({
        status: 'in_progress',
        deadlineAt: { $lt: now }
      });

      if (expiredAttempts.length > 0) {
        console.log(`[Sweeper] Auto-finalizing ${expiredAttempts.length} expired attempts.`);
        for (const attempt of expiredAttempts) {
          await evaluateAttemptLogic(attempt);
        }
      }
    } catch (err) {
      console.error('[Sweeper Error]:', err.message);
    }
  });
};
