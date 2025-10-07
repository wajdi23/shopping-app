import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// interface ProductData {
//   id: number;
//   code: string;
//   name: string;
//   description: string;
//   image: string;
//   price: number;
//   category: string;
//   createdAt: number;
//   updatedAt: number;
//   shellId: number;
//   internalReference: string;
//   inventoryStatus: "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK";
//   rating: number;
// }

async function main() {
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // admin
  const adminPassword = await bcrypt.hash("admin", 10);
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      firstname: "Admin",
      email: "admin@admin.com",
      password: adminPassword,
    },
  });
  console.log("admin créé:", admin.email);

  const productsPath = join(__dirname, "../src/data/products.json");
  const productsData = JSON.parse(readFileSync(productsPath, "utf-8"));

  for (const product of productsData) {
    await prisma.product.create({
      data: {
        code: product.code,
        name: product.name,
        description: product.description,
        image: product.image,
        category: product.category,
        price: product.price,
        internalReference: product.internalReference,
        shellId: product.shellId,
        inventoryStatus: product.inventoryStatus,
        rating: product.rating,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
      },
    });
  }
  console.log(`${productsData.length} produits ajoutés`);
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
