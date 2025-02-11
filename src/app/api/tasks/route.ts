import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import checkAuth from "@/components/IsAuthenticated";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  checkAuth().then((isAuthenticated) => {
    if (!isAuthenticated[0 as keyof typeof isAuthenticated]) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 400 },
      );
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
    });
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  checkAuth().then((isAuthenticated) => {
    if (!isAuthenticated[0 as keyof typeof isAuthenticated]) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 400 },
      );
    }
  });

  const body = await request.json();

  try {
    const { title, priority, status, userId } = body;

    let randomId = Math.floor(1000000000 + Math.random() * 9000000000);

    while (
      await prisma.task.findUnique({ where: { id: randomId.toString() } })
    ) {
      randomId = Math.floor(1000000000 + Math.random() * 9000000000);
    }

    const newTask = await prisma.task.create({
      data: {
        id: randomId.toString(),
        title,
        priority,
        status,
        userId: userId,
      },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}
