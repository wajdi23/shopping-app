import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { username, firstname, email, password } = req.body;

    if (!username || !firstname || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Adresse email déja utilisée",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        firstname,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        firstname: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: "Compte créé avec succès",
      user,
    });
  } catch (error) {
    console.error("Erreur lors de la création compte:", error);
    res.status(500).json({ error: "Erreur lors de la création du compte" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et password requis" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};
