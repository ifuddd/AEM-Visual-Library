import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Example: Create a test component
  const component = await prisma.component.upsert({
    where: { slug: 'example-hero-banner' },
    update: {},
    create: {
      slug: 'example-hero-banner',
      title: 'Example Hero Banner',
      description: 'A sample hero banner component for testing',
      status: 'STABLE',
      tags: ['layout', 'marketing'],
      ownerTeam: 'Development Team',
      aemComponentPath: '/apps/project/components/hero',
      aemAllowedChildren: ['teaser', 'cta'],
    },
  });

  console.log('Created component:', component);

  // Add more seed data as needed
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });