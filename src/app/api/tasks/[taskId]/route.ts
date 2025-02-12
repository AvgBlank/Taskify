import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import checkAuth from "@/components/IsAuthenticated";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ taskId: string }> },
) {
  const params = await props.params;
  checkAuth(request).then((isAuthenticated) => {
    if (!isAuthenticated[0 as keyof typeof isAuthenticated]) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 400 });
    }
  });
  const taskId = params.taskId;

  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ taskId: string }> },
) {
  const params = await props.params;
  checkAuth(request).then((isAuthenticated) => {
    if (!isAuthenticated[0 as keyof typeof isAuthenticated]) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 400 });
    }
  });
  const taskId = params.taskId;

  const body = await request.json();

  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: body,
    });
    return NextResponse.json(updatedTask);
  } catch {
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}
