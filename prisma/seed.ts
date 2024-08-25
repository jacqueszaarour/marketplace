import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const flowerColors = [
  { name: "Red", imageUrl: "/redflower.jpg", price: 10, rating: 4 },
  { name: "Blue", imageUrl: "/blueflower.jpg", price: 15, rating: 5 },
  { name: "Yellow", imageUrl: "/yellowflower.jpg", price: 8, rating: 3 },
  { name: "Pink", imageUrl: "/pinkflower.jpg", price: 12, rating: 4 },
  {
    name: "Purple",
    imageUrl: "/purpleflower.jpg",
    price: 14,
    rating: 5,
  },
  { name: "White", imageUrl: "/whiteflower.jpg", price: 9, rating: 3 },
  {
    name: "Orange",
    imageUrl: "/orangeflower.jpg",
    price: 11,
    rating: 4,
  },
  { name: "Green", imageUrl: "/greenflower.jpg", price: 13, rating: 5 },
];

async function main() {
  console.log("Start seeding...");

  for (const color of flowerColors) {
    const product = await prisma.product.create({
      data: {
        name: `${color.name} Flower`,
        imageUrl: color.imageUrl,
        price: color.price,
        rating: color.rating,
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
