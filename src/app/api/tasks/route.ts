import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { userId: parseInt(userId) },
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
  const body = await request.json();

  try {
    const { title, priority, status, userId } = body;
    const newTask = await prisma.task.create({
      data: { title, priority, status, userId: parseInt(userId) },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}
