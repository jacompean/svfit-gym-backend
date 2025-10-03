import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth.js';
import { canReadCollection, canMutate } from '../middleware/policy.js';
const prisma = new PrismaClient();
const router = Router();
function list(model){
  router.get(`/${model}`, auth(), canReadCollection(model), async (req,res)=>{
    const where = req.filter || undefined
    const items = await prisma[model].findMany({ where, orderBy:{id:'desc'} })
    res.json(items)
  })
}
function item(model){
  router.get(`/${model}/:id`, auth(), async (req,res)=>{
    const it = await prisma[model].findUnique({ where:{ id:req.params.id } })
    if(!it) return res.status(404).end()
    res.json(it)
  })
}
function mutate(model){
  router.post(`/${model}`, auth(), canMutate(model), async (req,res)=>{
    const it = await prisma[model].create({ data:req.body })
    res.status(201).json(it)
  })
  router.put(`/${model}/:id`, auth(), canMutate(model), async (req,res)=>{
    const it = await prisma[model].update({ where:{ id:req.params.id }, data:req.body })
    res.json(it)
  })
  router.delete(`/${model}/:id`, auth(), canMutate(model), async (req,res)=>{
    await prisma[model].delete({ where:{ id:req.params.id } })
    res.status(204).end()
  })
}
;['member','plan','payment','attendance','gymClass','booking','trainer','expense','inventory']
  .forEach(m => { list(m); item(m); mutate(m) })
export default router;
