import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();
  const u1 = await prisma.user.create({
    data: { firstName: "Alice", lastName: "Peeters", email: "alice@student.be" },
  });

  const u2 = await prisma.user.create({
    data: { firstName: "Bilal", lastName: "El Amrani", email: "bilal@student.be" },
  });

  const listings = [
    { title: "iPhone 13 - good condition", description: "Battery 88%, includes case.", price: 420, zip: "1000", city: "Brussels", userId: u1.id },
    { title: "MacBook Air M1", description: "8GB/256GB, perfect for students.", price: 650, zip: "3000", city: "Leuven", userId: u1.id },
    { title: "Basketball shoes size 46", description: "Used twice, like new.", price: 75, zip: "2000", city: "Antwerp", userId: u2.id },
    { title: "Desk chair", description: "Comfortable chair, minor scratches.", price: 40, zip: "9000", city: "Ghent", userId: u2.id },
    { title: "Calculator TI-84", description: "Works perfectly, includes cover.", price: 55, zip: "1090", city: "Jette", userId: u1.id },
  ];

  for (const l of listings) {
    await prisma.listing.create({ data: l });
  }

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


