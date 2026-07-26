const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.findMany().then(u => {
  console.log('Users:', JSON.stringify(u.map(x => ({ id: x.id, name: x.name, email: x.email, role: x.role, teamId: x.teamId })), null, 2));
  return p.$disconnect();
}).catch(e => {
  console.error(e);
  return p.$disconnect();
});
