import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import checkAuth from "@/lib/IsAuthenticated";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  checkAuth(request).then((isAuthenticated) => {
    if (!isAuthenticated[0 as keyof typeof isAuthenticated]) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 400 });
    }
  });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { userId: userId },
      include: { labels: true },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  checkAuth(request).then((isAuthenticated) => {
    if (!isAuthenticated[0 as keyof typeof isAuthenticated]) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 400 });
    }
  });

  const body = await request.json();

  try {
    const { title, priority, status, userId, labels } = body;

    const newTask = await prisma.task.create({
      data: {
        title,
        priority,
        status,
        userId,
        labels: labels?.length
          ? {
              connectOrCreate: labels.map((label: string) => ({
                where: { name: label },
                create: { name: label },
              })),
            }
          : {},
      },
      include: { labels: true },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}
