import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/productController";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();

//Get all products // everybody
router.get("/", getAllProducts);
//// ADMIN
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.patch("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
