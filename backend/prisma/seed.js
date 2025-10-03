import { PrismaClient } from '@prisma/client'; import bcrypt from 'bcryptjs';
const prisma = new PrismaClient(); const hash=(p)=>bcrypt.hashSync(p,10);
async function main(){
  await prisma.user.createMany({ data:[
    { email:'admin@gym.mx', password:hash('admin123'), firstName:'Admin', lastName:'Gym', role:'ADMIN' },
    { email:'coach@gym.mx', password:hash('coach123'), firstName:'Ana', lastName:'Coach', role:'COACH' },
    { email:'user@gym.mx', password:hash('user123'), firstName:'Mario', lastName:'Socio', role:'USER' },
  ], skipDuplicates:true });
  const coachUser = await prisma.user.findUnique({ where:{ email:'coach@gym.mx' } });
  await prisma.trainer.createMany({ data:[
    { trainerId:'T-001', firstName:'Carlos', lastName:'Luna', email:'carlos.luna@gym.mx', specialty:'HIIT', active:true, userId:coachUser?.id },
    { trainerId:'T-002', firstName:'Ana', lastName:'Soto', email:'ana.soto@gym.mx', specialty:'Spinning', active:true },
  ], skipDuplicates:true });
  await prisma.plan.createMany({ data:[
    { planId:'P-BASICO', name:'Básico', price:399, billing:'monthly', access:'gimnasio', duration:30, active:true },
    { planId:'P-PREMIUM', name:'Premium', price:699, billing:'monthly', access:'gimnasio+clases', duration:30, active:true },
  ], skipDuplicates:true });
  await prisma.member.createMany({ data:[
    { memberId:'M-0001', firstName:'Juan', lastName:'Pérez', status:'active', planId:'P-BASICO' },
    { memberId:'M-0002', firstName:'María', lastName:'García', status:'paused', planId:'P-PREMIUM' },
  ], skipDuplicates:true });
  console.log('Seed OK')
}
main().finally(async()=>{ await prisma.$disconnect() })
