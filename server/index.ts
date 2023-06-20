import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import 'dotenv/config';
import admin, { ServiceAccount } from 'firebase-admin';
import router from './routes/index';
import errorMiddleware from './middleware/errorMiddleware';
import requestLogger from './middleware/requestLogger';
import logger from './middleware/logger';
import serviceAccount from './config/serviceAccount';

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api/', router);
app.use(errorMiddleware);

const init = async () => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    app.listen(PORT, () => logger(`server started on port ${PORT}`));
  } catch (e) {
    logger(e);
  }
};

init();
