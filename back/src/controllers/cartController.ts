import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getMyCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    res.json({
      items: cartItems,
      total: total.toFixed(2),
      itemCount: cartItems.length,
    });
  } catch (error) {
    console.error("Erreur lors de la récup du panier :: ", error);
    res.status(500).json({ error: "Erreuuuur" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId, quantity } = req.body;

    console.log("productId", productId, "qty", quantity);

    if (!productId || !quantity || quantity < 1) {
      return res
        .status(400)
        .json({ error: "Quantité invalide, vérifiez les informations" });
    }
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });
    if (!product) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }
    let cartItem;
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + parseInt(quantity);

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: { product: true },
      });
    }
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout au panier" });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Error" });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: parseInt(id),
        },
      },
    });

    if (!cartItem) {
      return res
        .status(404)
        .json({ error: "Article non trouvé dans le panier" });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: quantity },
      include: { product: true },
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const cartItem = await prisma.cartItem.findFirst({
      where: { userId, productId: parseInt(id) },
    });

    if (!cartItem) {
      return res
        .status(404)
        .json({ error: "Article non trouvé dans le panier" });
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });
    res.json({ message: "Article retiré du panier avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du produit" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    await prisma.cartItem.deleteMany({
      where: { userId },
    });
    res.json({ message: "Panier vidé avec succès" });
  } catch (error) {
    console.error("Erreur lors clear du panier:", error);
    res.status(500).json({ error: "Erreur lors clear du panier" });
  }
};
