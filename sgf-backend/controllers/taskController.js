import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, familyId } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        familyId,
        createdBy: req.user.userId
      }
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { familyId } = req.query;

    const tasks = await prisma.task.findMany({
      where: { familyId: Number(familyId) },
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

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: req.body
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Tarefa deletada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};