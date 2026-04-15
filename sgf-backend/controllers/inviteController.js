import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export const createInvite = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    const code = crypto.randomUUID();

    const invite = await prisma.invite.create({
      data: {
        code,
        familyId: user.familyId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24h
      }
    });

    res.json({
      code: invite.code,
      link: `http://localhost:3000/join/${invite.code}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const joinFamily = async (req, res) => {
  try {
    const { code } = req.body;

    const invite = await prisma.invite.findUnique({
      where: { code }
    });

    if (!invite || invite.used || invite.expiresAt < new Date()) {
      return res.status(400).json({ error: "Convite inválido ou expirado" });
    }

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { familyId: invite.familyId }
    });

    await prisma.invite.update({
      where: { code },
      data: { used: true }
    });

    res.json({ message: "Você entrou na família com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};