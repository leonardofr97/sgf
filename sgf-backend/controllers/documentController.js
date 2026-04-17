import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    const document = await prisma.document.create({
      data: {
        name: file.originalname,
        fileUrl: file.path,
        type: file.mimetype,
        size: file.size,
        familyId: user.familyId
      }
    });

    res.status(201).json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    const docs = await prisma.document.findMany({
      where: { familyId: user.familyId },
      orderBy: { createdAt: "desc" }
    });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    const doc = await prisma.document.findUnique({
      where: { id: Number(id) }
    });

    if (!doc || doc.familyId !== user.familyId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    await prisma.document.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Documento deletado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};