import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth.js';
const prisma = new PrismaClient();
const router = Router();
router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if(!user) return res.status(401).json({error:'Credenciales inválidas'});
  const ok = bcrypt.compareSync(password, user.password);
  if(!ok) return res.status(401).json({error:'Credenciales inválidas'});
  const token = jwt.sign({ id:user.id, email:user.email, role:user.role, name:user.firstName+' '+user.lastName }, process.env.JWT_SECRET, { expiresIn:'2d' });
  res.json({ token, user:{ email:user.email, role:user.role, name:user.firstName+' '+user.lastName } });
});
router.get('/me', auth(), async (req,res)=>{
  const user = await prisma.user.findUnique({ where:{ id:req.user.id }, select:{ email:true, role:true, firstName:true, lastName:true } });
  res.json({ user });
});
export default router;
