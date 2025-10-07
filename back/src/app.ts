import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
// import wishlistRoutes from './routes/wishlistRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
// app.use('/wishlist', wishlistRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route non trouvée" });
});

export default app;
