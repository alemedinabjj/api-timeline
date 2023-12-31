import express from 'express';
import { verifyToken } from './middleware/verifyToken.js';
import postsRouter from './routes/posts.js';
import authRouter from './routes/auth.js';
import cors from 'cors';
import { prisma } from './utils/prisma.js';
import 'dotenv/config.js'

const server = express()
server.use(cors({
  origin: '*'
}))

server.use(express.json())


server.use('/posts', verifyToken, postsRouter)


server.use('/auth', authRouter)

server.listen(3336, () => {
  console.log('Server is running on port 3336')
})