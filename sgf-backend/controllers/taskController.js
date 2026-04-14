import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assigneeIds } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    let assigneesData = undefined;

    if (assigneeIds && assigneeIds.length > 0) {
      const validUsers = await prisma.user.findMany({
        where: {
          id: { in: assigneeIds },
          familyId: user.familyId // ensure they belong to the same family
        }
      });

      if (validUsers.length !== assigneeIds.length) {
        return res.status(400).json({
          error: "Um ou mais usuários não existem ou não pertencem à família"
        });
      }

      assigneesData = {
        connect: assigneeIds.map(id => ({ id }))
      };
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdBy: user.id,
        familyId: user.familyId,
        assignees: assigneesData
      },
      include: { assignees: true }
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    const tasks = await prisma.task.findMany({
      where: { familyId: user.familyId },
      include: { assignees: true }
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    const task = await prisma.task.findUnique({
      where: { id: Number(id) }
    });

    if (!task || task.familyId !== user.familyId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: req.body
    });

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    const task = await prisma.task.findUnique({
      where: { id: Number(id) }
    });

    if (!task || task.familyId !== user.familyId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    await prisma.task.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Tarefa deletada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};