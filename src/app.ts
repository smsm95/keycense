import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import errorHandler from './middleware/errorHandler';
import trimReqBody from './middleware/trimBody';
import xssClean from './middleware/xssClean';
import path from 'path';

import auth from './routes/auth';
import merchandise from './routes/merchandise';

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, './config/config.env'),
});

const app = express();

// Middlewares
app.use(express.json());
app.use(express.json());
app.use(helmet());
app.use(hpp());
app.use(trimReqBody);
app.use(xssClean);

//Routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/merchandise', merchandise);

// Error Handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
