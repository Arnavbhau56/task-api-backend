const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✓ Admin user created:', admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: userPassword,
      role: 'USER',
    },
  });
  console.log('✓ Regular user created:', user.email);

  // Create sample tasks for regular user
  const tasks = [
    {
      title: 'Complete project documentation',
      description: 'Write comprehensive README and API docs',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      userId: user.id,
    },
    {
      title: 'Review pull requests',
      description: 'Review and merge pending PRs',
      status: 'TODO',
      priority: 'MEDIUM',
      userId: user.id,
    },
    {
      title: 'Fix authentication bug',
      description: 'Token refresh not working properly',
      status: 'DONE',
      priority: 'HIGH',
      userId: user.id,
    },
    {
      title: 'Update dependencies',
      description: 'Update npm packages to latest versions',
      status: 'TODO',
      priority: 'LOW',
      userId: user.id,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }
  console.log(`✓ Created ${tasks.length} sample tasks`);

  // Create sample tasks for admin
  const adminTasks = [
    {
      title: 'Monitor system performance',
      description: 'Check server metrics and logs',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      userId: admin.id,
    },
    {
      title: 'User management review',
      description: 'Review user access and permissions',
      status: 'TODO',
      priority: 'MEDIUM',
      userId: admin.id,
    },
  ];

  for (const task of adminTasks) {
    await prisma.task.create({ data: task });
  }
  console.log(`✓ Created ${adminTasks.length} admin tasks`);

  console.log('\n✅ Database seeded successfully!\n');
  console.log('Login credentials:');
  console.log('─────────────────────────────────');
  console.log('Admin:');
  console.log('  Email: admin@example.com');
  console.log('  Password: admin123');
  console.log('\nUser:');
  console.log('  Email: user@example.com');
  console.log('  Password: user123');
  console.log('─────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
