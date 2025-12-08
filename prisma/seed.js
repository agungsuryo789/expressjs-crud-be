import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const password = "admin1234";

  // Seed Admin User
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: "Administrator",
        role: "ADMIN",
      },
    });

    console.log("✅ Admin user seeded successfully.");
  } else {
    console.log("ℹ️ Admin already exists, using existing user.");
  }

  // Seed Articles
  const articles = [
    {
      title: "Welcome to Our Company",
      slug: "welcome-to-our-company",
      excerpt: "An introduction to our company and mission.",
      content:
        "Welcome! This is the company blog. We do great things and serve our customers with pride.",
      published: true,
      publishedAt: new Date(),
    },
    {
      title: "Latest Updates",
      slug: "latest-updates",
      excerpt: "Updates on our recent activities.",
      content: "Here are the latest updates from our team. Stay tuned for more news.",
      published: false,
      publishedAt: null,
    },
  ];

  for (const a of articles) {
    const exists = await prisma.article.findUnique({ where: { slug: a.slug } });

    if (exists) {
      console.log(`⚠️ Article '${a.slug}' already exists, skipping.`);
      continue;
    }

    await prisma.article.create({
      data: {
        ...a,
        author: { connect: { id: user.id } },
      },
    });

    console.log(`📰 Seeded article '${a.slug}'.`);
  }

  // Seed Projects
  const projects = [
    {
      title: "Project Alpha",
      slug: "project-alpha",
      description: "A flagship project demonstrating our capabilities.",
      content: "Project Alpha is a demonstration of our core platform and integrations.",
      liveUrl: "https://example.com/alpha",
      repoUrl: "https://github.com/example/alpha",
      imageUrl: "https://picsum.photos/800/600",
      featured: true,
    },
    {
      title: "Project Beta",
      slug: "project-beta",
      description: "An experimental project.",
      content: "Details about Project Beta and its outcomes.",
      liveUrl: "https://example.com/beta",
      repoUrl: "https://github.com/example/beta",
      imageUrl: "https://picsum.photos/800/600",
      featured: false,
    },
  ];

  for (const p of projects) {
    const exists = await prisma.project.findUnique({ where: { slug: p.slug } });

    if (exists) {
      console.log(`⚠️ Project '${p.slug}' already exists, skipping.`);
      continue;
    }

    await prisma.project.create({
      data: {
        ...p,
        author: { connect: { id: user.id } },
      },
    });

    console.log(`🚀 Seeded project '${p.slug}'.`);
  }
}

main()
  .catch((err) => {
    console.error("❌ Error seeding data:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🌱 Seeder finished & DB connection closed.");
  });
