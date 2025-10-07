import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  addToCart,
  clearCart,
  updateCartItem,
  removeCartItem,
  getMyCart,
} from "../controllers/cartController";

const router = Router();

router.use(authMiddleware);

router.get("/", authMiddleware, getMyCart);
router.post("/", authMiddleware, addToCart);
router.patch("/:id", authMiddleware, updateCartItem);
router.delete("/:id", authMiddleware, removeCartItem);
router.delete("/", authMiddleware, clearCart);

export default router;
