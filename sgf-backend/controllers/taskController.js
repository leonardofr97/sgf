import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const normalizeAssigneeIds = (assigneeIds) => {
  if (assigneeIds === undefined) return undefined;
  if (!Array.isArray(assigneeIds)) return null;

  const ids = assigneeIds.map(Number);
  if (ids.some((id) => !Number.isInteger(id) || id <= 0)) return null;

  return [...new Set(ids)];
};

const getAssigneesData = async (assigneeIds, familyId) => {
  const normalizedIds = normalizeAssigneeIds(assigneeIds);

  if (normalizedIds === undefined) return undefined;
  if (normalizedIds === null) {
    throw new Error("Responsáveis inválidos");
  }

  if (normalizedIds.length === 0) {
    return { assigneesData: { set: [] }, normalizedIds };
  }

  const validUsers = await prisma.user.findMany({
    where: {
      id: { in: normalizedIds },
      familyId,
    },
    select: { id: true },
  });

  if (validUsers.length !== normalizedIds.length) {
    throw new Error("Um ou mais usuarios não existem ou não pertencem a família");
  }

  return {
    assigneesData: {
      set: normalizedIds.map((id) => ({ id })),
    },
    normalizedIds,
  };
};

const assigneesSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
};

const assigneeErrorStatus = (message) =>
  message.includes("Responsaveis") || message.includes("usuarios") ? 400 : 500;

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assigneeIds } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }

    const assigneesResult = await getAssigneesData(assigneeIds, user.familyId);
    const normalizedAssigneeIds = assigneesResult?.normalizedIds ?? [];
    const assigneesConnect =
      normalizedAssigneeIds.length > 0
        ? { connect: normalizedAssigneeIds.map((id) => ({ id })) }
        : undefined;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdBy: user.id,
        familyId: user.familyId,
        assignees: assigneesConnect,
      },
      include: { assignees: { select: assigneesSelect } },
    });

    if (normalizedAssigneeIds.length > 0) {
      await prisma.notification.createMany({
        data: normalizedAssigneeIds.map((userId) => ({
          userId,
          message: `Nova tarefa atribuída: ${title}`,
        })),
      });
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(assigneeErrorStatus(err.message)).json({ error: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }

    const tasks = await prisma.task.findMany({
      where: { familyId: user.familyId },
      include: { assignees: { select: assigneesSelect } },
      orderBy: { id: "desc" },
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, dueDate, assigneeIds } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }

    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
      include: { assignees: { select: { id: true } } },
    });

    if (!task || task.familyId !== user.familyId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const assigneesResult = await getAssigneesData(assigneeIds, user.familyId);

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        priority,
        status,
        dueDate: dueDate === undefined ? undefined : dueDate ? new Date(dueDate) : null,
        assignees: assigneesResult?.assigneesData,
      },
      include: { assignees: { select: assigneesSelect } },
    });

    if (assigneesResult?.normalizedIds) {
      const previousIds = new Set(task.assignees.map((assignee) => assignee.id));
      const newAssigneeIds = assigneesResult.normalizedIds.filter(
        (userId) => !previousIds.has(userId)
      );

      if (newAssigneeIds.length > 0) {
        await prisma.notification.createMany({
          data: newAssigneeIds.map((userId) => ({
            userId,
            message: `Tarefa atribuida: ${updatedTask.title}`,
          })),
        });
      }
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(assigneeErrorStatus(err.message)).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }

    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!task || task.familyId !== user.familyId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    await prisma.task.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Tarefa deletada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
