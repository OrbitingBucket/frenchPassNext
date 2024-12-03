// server/src/index.ts
import express from 'express';
import cors from 'cors';
import exerciseRoutes from './routes/exercises';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', exerciseRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});