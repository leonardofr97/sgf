import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, endDate, recurrence } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        recurrence,
        familyId: user.familyId
      }
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { start, end } = req.query;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    const events = await prisma.event.findMany({
      where: {
        familyId: user.familyId,
        ...(start && end && {
          date: {
            gte: new Date(start),
            lte: new Date(end)
          }
        })
      },
      orderBy: { date: "asc" }
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    const event = await prisma.event.findUnique({
      where: { id: Number(id) }
    });

    if (!event || event.familyId !== user.familyId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const updated = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    const event = await prisma.event.findUnique({
      where: { id: Number(id) }
    });

    if (!event || event.familyId !== user.familyId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    await prisma.event.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Evento deletado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};