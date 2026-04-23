import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" }
    });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id: Number(id) }
    });
    
    if (!notification) {
        return res.status(404).json({ error: "Notificação não encontrada" });
    }

    if (notification.userId !== req.user.userId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const updated = await prisma.notification.update({
      where: { id: Number(id) },
      data: { read: true }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};