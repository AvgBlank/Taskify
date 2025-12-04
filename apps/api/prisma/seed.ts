import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const priorities = ["Low", "Medium", "High"];
const statuses = ["Pending", "In Progress", "Completed"];

const projects = [
  {
    name: "Website Redesign",
    description: "Redesign the company website with a modern look and feel",
    tasks: [
      { title: "Create wireframes for homepage", priority: "High", status: "Completed" },
      { title: "Design new color palette", priority: "Medium", status: "Completed" },
      { title: "Build responsive navigation", priority: "High", status: "In Progress" },
      { title: "Implement hero section", priority: "Medium", status: "In Progress" },
      { title: "Add contact form", priority: "Low", status: "Pending" },
      { title: "Optimize images for web", priority: "Medium", status: "Pending" },
      { title: "Write SEO meta tags", priority: "Low", status: "Pending" },
      { title: "Test cross-browser compatibility", priority: "High", status: "Pending" },
      { title: "Setup analytics tracking", priority: "Medium", status: "Pending" },
      { title: "Launch to production", priority: "High", status: "Pending" },
      { title: "Create about us page", priority: "Medium", status: "Pending" },
      { title: "Design footer component", priority: "Low", status: "Completed" },
      { title: "Implement breadcrumb navigation", priority: "Low", status: "Pending" },
      { title: "Add social media links", priority: "Low", status: "Pending" },
      { title: "Create 404 error page", priority: "Medium", status: "In Progress" },
      { title: "Implement lazy loading", priority: "High", status: "Pending" },
      { title: "Add sitemap.xml", priority: "Low", status: "Pending" },
      { title: "Setup robots.txt", priority: "Low", status: "Completed" },
      { title: "Implement dark mode toggle", priority: "Medium", status: "In Progress" },
      { title: "Add cookie consent banner", priority: "High", status: "Pending" },
    ],
  },
  {
    name: "Mobile App Development",
    description: "Build a cross-platform mobile application for task management",
    tasks: [
      { title: "Setup React Native project", priority: "High", status: "Completed" },
      { title: "Design app navigation flow", priority: "High", status: "Completed" },
      { title: "Create authentication screens", priority: "High", status: "Completed" },
      { title: "Build task list component", priority: "High", status: "In Progress" },
      { title: "Implement push notifications", priority: "Medium", status: "Pending" },
      { title: "Add offline support", priority: "Medium", status: "Pending" },
      { title: "Integrate with backend API", priority: "High", status: "In Progress" },
      { title: "Design settings page", priority: "Low", status: "Pending" },
      { title: "Write unit tests", priority: "Medium", status: "Pending" },
      { title: "Prepare app store listing", priority: "Low", status: "Pending" },
      { title: "Beta testing with users", priority: "High", status: "Pending" },
      { title: "Fix reported bugs", priority: "High", status: "Pending" },
      { title: "Implement biometric authentication", priority: "High", status: "Pending" },
      { title: "Add haptic feedback", priority: "Low", status: "Pending" },
      { title: "Create onboarding screens", priority: "Medium", status: "In Progress" },
      { title: "Implement deep linking", priority: "Medium", status: "Pending" },
      { title: "Add widget support", priority: "Low", status: "Pending" },
      { title: "Optimize app bundle size", priority: "Medium", status: "Pending" },
      { title: "Implement in-app updates", priority: "High", status: "Pending" },
      { title: "Add crash reporting", priority: "High", status: "Completed" },
      { title: "Create app icons and splash screen", priority: "Medium", status: "Completed" },
      { title: "Implement swipe gestures", priority: "Medium", status: "In Progress" },
    ],
  },
  {
    name: "API Optimization",
    description: "Improve API performance and add new endpoints",
    tasks: [
      { title: "Audit current endpoint performance", priority: "High", status: "Completed" },
      { title: "Add database indexing", priority: "High", status: "Completed" },
      { title: "Implement response caching", priority: "Medium", status: "In Progress" },
      { title: "Add rate limiting", priority: "Medium", status: "Pending" },
      { title: "Write API documentation", priority: "Low", status: "Pending" },
      { title: "Add pagination to list endpoints", priority: "Medium", status: "Completed" },
      { title: "Implement request validation", priority: "High", status: "In Progress" },
      { title: "Setup error monitoring", priority: "Medium", status: "Pending" },
      { title: "Add request logging middleware", priority: "Medium", status: "Completed" },
      { title: "Implement GraphQL layer", priority: "Low", status: "Pending" },
      { title: "Add health check endpoint", priority: "High", status: "Completed" },
      { title: "Implement API versioning", priority: "High", status: "In Progress" },
      { title: "Add compression middleware", priority: "Medium", status: "Completed" },
      { title: "Setup load testing", priority: "Medium", status: "Pending" },
      { title: "Implement webhook support", priority: "Low", status: "Pending" },
      { title: "Add batch operations endpoint", priority: "Medium", status: "Pending" },
      { title: "Optimize database queries", priority: "High", status: "In Progress" },
      { title: "Implement connection pooling", priority: "High", status: "Completed" },
    ],
  },
  {
    name: "Marketing Campaign",
    description: "Q1 marketing campaign for product launch",
    tasks: [
      { title: "Define target audience", priority: "High", status: "Completed" },
      { title: "Create campaign budget", priority: "High", status: "Completed" },
      { title: "Design social media graphics", priority: "Medium", status: "In Progress" },
      { title: "Write email newsletter", priority: "Medium", status: "Pending" },
      { title: "Setup Google Ads campaign", priority: "High", status: "Pending" },
      { title: "Create landing page", priority: "High", status: "In Progress" },
      { title: "Record promotional video", priority: "Low", status: "Pending" },
      { title: "Reach out to influencers", priority: "Medium", status: "Pending" },
      { title: "A/B test ad creatives", priority: "Medium", status: "Pending" },
      { title: "Analyze campaign results", priority: "High", status: "Pending" },
      { title: "Create press release", priority: "Medium", status: "Completed" },
      { title: "Setup affiliate program", priority: "Low", status: "Pending" },
      { title: "Design email templates", priority: "Medium", status: "In Progress" },
      { title: "Create blog content calendar", priority: "Medium", status: "Completed" },
      { title: "Write case studies", priority: "Low", status: "Pending" },
      { title: "Setup retargeting campaigns", priority: "High", status: "Pending" },
      { title: "Create product demo video", priority: "High", status: "In Progress" },
      { title: "Design promotional banners", priority: "Medium", status: "Completed" },
      { title: "Setup UTM tracking", priority: "Low", status: "Completed" },
      { title: "Create referral program", priority: "Medium", status: "Pending" },
      { title: "Write product comparison guide", priority: "Low", status: "Pending" },
    ],
  },
  {
    name: "DevOps Infrastructure",
    description: "Setup and maintain CI/CD pipelines and cloud infrastructure",
    tasks: [
      { title: "Setup GitHub Actions workflow", priority: "High", status: "Completed" },
      { title: "Configure Docker containers", priority: "High", status: "Completed" },
      { title: "Setup staging environment", priority: "High", status: "Completed" },
      { title: "Implement automated testing", priority: "Medium", status: "In Progress" },
      { title: "Configure SSL certificates", priority: "High", status: "Completed" },
      { title: "Setup database backups", priority: "High", status: "In Progress" },
      { title: "Implement log aggregation", priority: "Medium", status: "Pending" },
      { title: "Setup uptime monitoring", priority: "Medium", status: "Pending" },
      { title: "Document deployment process", priority: "Low", status: "Pending" },
      { title: "Optimize cloud costs", priority: "Low", status: "Pending" },
      { title: "Setup Kubernetes cluster", priority: "High", status: "In Progress" },
      { title: "Implement blue-green deployments", priority: "Medium", status: "Pending" },
      { title: "Configure auto-scaling", priority: "High", status: "Pending" },
      { title: "Setup secrets management", priority: "High", status: "Completed" },
      { title: "Implement infrastructure as code", priority: "Medium", status: "In Progress" },
      { title: "Setup CDN configuration", priority: "Medium", status: "Completed" },
      { title: "Create disaster recovery plan", priority: "High", status: "Pending" },
      { title: "Setup performance monitoring", priority: "Medium", status: "In Progress" },
      { title: "Implement canary deployments", priority: "Low", status: "Pending" },
      { title: "Configure network security groups", priority: "High", status: "Completed" },
    ],
  },
];

// Labels to be created and assigned
const labelNames = [
  "bug",
  "feature",
  "enhancement",
  "documentation",
  "urgent",
  "backend",
  "frontend",
  "design",
  "testing",
  "security",
  "performance",
  "refactor",
  "api",
  "database",
  "ui/ux",
  "devops",
  "mobile",
  "analytics",
  "seo",
  "accessibility",
];

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.label.deleteMany();
  await prisma.user.deleteMany();

  // Create test user
  console.log("👤 Creating test user...");
  const hashedPassword = await bcrypt.hash("Test@1234", 10);
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@test.com",
      password: hashedPassword,
    },
  });
  console.log(`   Created user: ${user.email}`);

  // Create labels
  console.log("🏷️  Creating labels...");
  const labels = await Promise.all(
    labelNames.map((name) =>
      prisma.label.create({
        data: { name },
      })
    )
  );
  console.log(`   Created ${labels.length} labels`);

  // Create projects with tasks
  console.log("📁 Creating projects and tasks...");
  for (const projectData of projects) {
    const project = await prisma.project.create({
      data: {
        name: projectData.name,
        description: projectData.description,
        userId: user.id,
      },
    });
    console.log(`   Created project: ${project.name}`);

    // Create tasks for this project
    for (const taskData of projectData.tasks) {
      // Randomly assign 1-4 labels to each task (always at least 1)
      const numLabels = Math.floor(Math.random() * 4) + 1;
      const shuffledLabels = [...labels].sort(() => Math.random() - 0.5);
      const taskLabels = shuffledLabels.slice(0, numLabels);

      await prisma.task.create({
        data: {
          title: taskData.title,
          priority: taskData.priority,
          status: taskData.status,
          userId: user.id,
          projectId: project.id,
          labels: {
            connect: taskLabels.map((label) => ({ id: label.id })),
          },
        },
      });
    }
    console.log(`      Added ${projectData.tasks.length} tasks`);
  }

  // Summary
  const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0);
  console.log("\n✅ Seed completed!");
  console.log(`   - 1 user (test@test.com / Test@1234)`);
  console.log(`   - ${projects.length} projects`);
  console.log(`   - ${totalTasks} tasks (each with 1-4 labels)`);
  console.log(`   - ${labels.length} labels`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
