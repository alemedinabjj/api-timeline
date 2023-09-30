import { Router } from "express";
import { prisma } from "../utils/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyToken } from "../middleware/verifyToken.js"

const server = Router();

server.post('/login', async (req, res) => {
  
  const { email, password } = req.body;
  const errors = {};

  if (!email) {
    errors.emailRequired = 'Email is required';
  }

  if (!password) {
    errors.passwordRequired = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }


  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    errors.email = 'User not found';
    return res.status(404).json({ errors });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    errors.password = 'Password does not match';
    return res.status(400).json({ errors });
  }


  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );


  return res.json({ token })
})

server.post('/register', async (req, res) => {
  const { email, password, confirmPassword, username } = req.body;
  const errors = {};

  if (password !== confirmPassword) {
    errors.passwordMatch = 'Password does not match';
  }

  if (password.length < 6) {
    errors.passwordLength = 'Password must be at least 6 characters';
  }

  if (!email) {
    errors.emailRequired = 'Email is required';
  }

  if (!username) {
    errors.usernameRequired = 'Username is required';
  }

  const hashedPassword = await bcrypt.hash(password, 10);


  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      username,
    },
  });


  return res.json({ email, password, confirmPassword, username });
});


server.get('/user', verifyToken, async (req, res) => {

  const user = await prisma.users.findUnique({
    where: {
      id: req.userId,
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  return res.json({ user });
  
})

export default server;