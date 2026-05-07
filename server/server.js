import express        from 'express';
import cors           from 'cors';
import 'dotenv/config';

import userRoutes      from './routes/userRoutes.js';
import courseRoutes    from './routes/courseRoutes.js';
import progressoRoutes from './routes/progressoRoutes.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/users',     userRoutes);
app.use('/api/courses',   courseRoutes);
app.use('/api/progresso', progressoRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
});
