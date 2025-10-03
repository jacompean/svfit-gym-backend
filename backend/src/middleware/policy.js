import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export function canReadCollection(model){
  return async (req,res,next)=>{
    const { role } = req.user || {}
    if(role === 'ADMIN') return next()
    if(role === 'COACH') return next()
    if(role === 'USER'){
      const allowed = ['booking','attendance','payment','gymClass','plan']
      if(!allowed.includes(model)) return res.status(403).json({error:'Forbidden'})
      if(model === 'gymClass' || model === 'plan') return next()
      if(!req.query.memberId) return res.status(400).json({error:'memberId requerido'})
      req.filter = { memberId: req.query.memberId }
      return next()
    }
    return res.status(401).json({error:'No auth'})
  }
}
export function canMutate(model){
  return async (req,res,next)=>{
    const { role } = req.user || {}
    if(role === 'ADMIN') return next()
    if(role === 'COACH'){
      const coachWritable = ['gymClass','booking','attendance','payment','member']
      if(!coachWritable.includes(model)) return res.status(403).json({error:'Forbidden'})
      if(req.method === 'DELETE' && model === 'payment') return res.status(403).json({error:'Coach no puede eliminar pagos'})
      return next()
    }
    if(role === 'USER'){
      if(model !== 'booking') return res.status(403).json({error:'Forbidden'})
      return next()
    }
    return res.status(401).json({error:'No auth'})
  }
}
