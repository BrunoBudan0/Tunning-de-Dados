import express from 'express';
import cors from 'cors';
import courseRoutes from './routes/courseRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' })); // porta do Vite
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

app.listen(3000, () => console.log('Server rodando na porta 3000'));