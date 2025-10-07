import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (error) {
    console.error("Erreur récupération produits:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des produits" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    res.json(product);
  } catch (error) {
    console.error("Erreur récupération produit:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération du produit" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      code,
      name,
      description,
      image,
      category,
      price,
      internalReference,
      shellId,
      inventoryStatus,
      rating,
    } = req.body;

    if (!code || !name || !description || !category || !price) {
      return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    const product = await prisma.product.create({
      data: {
        code,
        name,
        description,
        image: image || "",
        category,
        price: parseFloat(price),
        internalReference: internalReference || "",
        shellId: shellId ? parseInt(shellId) : 0,
        inventoryStatus: inventoryStatus || "INSTOCK",
        rating: rating ? parseFloat(rating) : 0,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error);
    res.status(500).json({ error: "Erreur lors de la création du produit" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        price: data.price ? parseFloat(data.price) : undefined,
        shellId: data.shellId ? parseInt(data.shellId) : undefined,
        rating: data.rating ? parseFloat(data.rating) : undefined,
      },
    });

    res.json(product);
  } catch (error) {
    console.error("Erreur mise à jour produit:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du produit" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression produit:", error);
    res.status(500).json({ error: "Erreur lors de la suppression du produit" });
  }
};
