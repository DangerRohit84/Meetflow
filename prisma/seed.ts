import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const leadPassword = await bcrypt.hash('password123', 10);
  const memberPassword = await bcrypt.hash('password123', 10);

  const lead = await prisma.user.upsert({
    where: { email: 'alex@meetflow.ai' },
    update: {},
    create: {
      name: 'Alex Lead',
      email: 'alex@meetflow.ai',
      password: leadPassword,
      role: 'lead',
    },
  });

  const sarah = await prisma.user.upsert({
    where: { email: 'sarah@meetflow.ai' },
    update: {},
    create: {
      name: 'Sarah Wilson',
      email: 'sarah@meetflow.ai',
      password: memberPassword,
      role: 'member',
      teamId: lead.id,
    },
  });

  const david = await prisma.user.upsert({
    where: { email: 'david@meetflow.ai' },
    update: {},
    create: {
      name: 'David Chen',
      email: 'david@meetflow.ai',
      password: memberPassword,
      role: 'member',
      teamId: lead.id,
    },
  });

  const emma = await prisma.user.upsert({
    where: { email: 'emma@meetflow.ai' },
    update: {},
    create: {
      name: 'Emma Davis',
      email: 'emma@meetflow.ai',
      password: memberPassword,
      role: 'member',
      teamId: lead.id,
    },
  });

  console.log('Users created');

  const meeting1 = await prisma.meeting.create({
    data: {
      title: 'Weekly Team Standup',
      date: new Date('2026-07-24'),
      transcript: 'Alex: Let us discuss the project timeline. We need the backend ready by Friday.\nSarah: I can have the UI mockups done by Wednesday.\nDavid: I will coordinate with Alex on the backend updates.\nAlex: What about the budget allocation? We still need approval.\nSarah: That is still pending. We should escalate to the manager.\nAlex: Agreed. Let us schedule a follow-up meeting next week.',
      summary: 'Team discussed project timeline and budget allocation. Backend deadline set for Friday, UI mockups for Wednesday. Budget approval still pending and needs escalation.',
      decisions: JSON.stringify([
        'Backend must be ready by Friday',
        'UI mockups due Wednesday',
        'Escalate budget allocation to manager',
        'Schedule follow-up meeting next week',
      ]),
      leadId: lead.id,
    },
  });

  const meeting2 = await prisma.meeting.create({
    data: {
      title: 'Product Review Meeting',
      date: new Date('2026-07-22'),
      transcript: 'Emma: The new dashboard design looks great. Let us finalize the color scheme.\nSarah: I prefer the indigo theme we discussed earlier.\nDavid: I will implement the responsive layout this week.\nEmma: Perfect. Also, we need to update the documentation.\nSarah: I can handle the user guide by next Monday.',
      summary: 'Product review covered dashboard design finalization and documentation updates. Indigo theme approved, responsive layout implementation assigned.',
      decisions: JSON.stringify([
        'Use indigo color theme for dashboard',
        'Implement responsive layout this week',
        'Update documentation and user guide',
      ]),
      leadId: lead.id,
    },
  });

  const meeting3 = await prisma.meeting.create({
    data: {
      title: 'Sprint Planning',
      date: new Date('2026-07-20'),
      transcript: 'Alex: We need to plan the next sprint priorities.\nDavid: The API integration should be top priority.\nEmma: I agree. Also the testing suite needs attention.\nSarah: I can work on the component library.\nAlex: Good. Let us aim to complete all high priority items by end of next week.',
      summary: 'Sprint planning session established priorities for API integration, testing suite, and component library. High priority items targeted for completion by end of next week.',
      decisions: JSON.stringify([
        'API integration is top priority',
        'Testing suite needs attention',
        'Component library development assigned to Sarah',
      ]),
      leadId: lead.id,
    },
  });

  console.log('Meetings created');

  await prisma.task.createMany({
    data: [
      { title: 'Complete backend API development', description: 'Build all REST API endpoints for the meeting module', assigneeId: david.id, creatorId: lead.id, meetingId: meeting1.id, deadline: new Date('2026-07-26'), priority: 'high', status: 'in_progress' },
      { title: 'Create UI mockups for dashboard', description: 'Design and deliver final mockups for the main dashboard', assigneeId: sarah.id, creatorId: lead.id, meetingId: meeting1.id, deadline: new Date('2026-07-24'), priority: 'medium', status: 'completed' },
      { title: 'Escalate budget allocation to manager', description: 'Schedule meeting with manager to discuss budget approval', assigneeId: sarah.id, creatorId: lead.id, meetingId: meeting1.id, deadline: new Date('2026-07-25'), priority: 'high', status: 'pending' },
      { title: 'Implement responsive layout', description: 'Make all pages responsive for mobile and tablet', assigneeId: david.id, creatorId: lead.id, meetingId: meeting2.id, deadline: new Date('2026-07-28'), priority: 'medium', status: 'in_progress' },
      { title: 'Update user guide documentation', description: 'Write comprehensive user guide for the new features', assigneeId: sarah.id, creatorId: lead.id, meetingId: meeting2.id, deadline: new Date('2026-07-29'), priority: 'medium', status: 'pending' },
      { title: 'Build API integration module', description: 'Integrate third-party APIs for data sync', assigneeId: david.id, creatorId: lead.id, meetingId: meeting3.id, deadline: new Date('2026-07-30'), priority: 'high', status: 'pending' },
      { title: 'Set up testing suite', description: 'Configure unit and integration tests', assigneeId: emma.id, creatorId: lead.id, meetingId: meeting3.id, deadline: new Date('2026-07-28'), priority: 'high', status: 'in_progress' },
      { title: 'Develop component library', description: 'Create reusable UI components', assigneeId: sarah.id, creatorId: lead.id, meetingId: meeting3.id, deadline: new Date('2026-07-31'), priority: 'medium', status: 'pending' },
      { title: 'Review code changes', description: 'Review and approve pending pull requests', assigneeId: emma.id, creatorId: lead.id, meetingId: meeting1.id, deadline: new Date('2026-07-25'), priority: 'low', status: 'completed' },
      { title: 'Schedule follow-up meeting', description: 'Set up recurring meeting for next week', assigneeId: sarah.id, creatorId: lead.id, meetingId: meeting1.id, deadline: new Date('2026-07-25'), priority: 'low', status: 'completed' },
    ],
  });

  const taskCount = await prisma.task.count();
  console.log('Tasks created:', taskCount);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
