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

  const u3 = await prisma.user.create({
    data: { firstName: "Emma", lastName: "Janssens", email: "emma.janssens@student.be" },
  });

  const u4 = await prisma.user.create({
    data: { firstName: "Lucas", lastName: "Vermeulen", email: "lucas.v@student.be" },
  });

  const u5 = await prisma.user.create({
    data: { firstName: "Sophie", lastName: "Dubois", email: "sophie.dubois@student.be" },
  });

  const listings = [
    { title: "iPhone 13 - good condition", description: "Battery 88%, includes case.", price: 420, zip: "1000", city: "Brussels", userId: u1.id },
    { title: "MacBook Air M1", description: "8GB/256GB, perfect for students.", price: 650, zip: "3000", city: "Leuven", userId: u1.id },
    { title: "Basketball shoes size 46", description: "Used twice, like new.", price: 75, zip: "2000", city: "Antwerp", userId: u2.id },
    { title: "Desk chair", description: "Comfortable chair, minor scratches.", price: 40, zip: "9000", city: "Ghent", userId: u2.id },
    { title: "Calculator TI-84", description: "Works perfectly, includes cover.", price: 55, zip: "1090", city: "Jette", userId: u1.id },
    { title: "Samsung Galaxy S22", description: "128GB, black, no damage. Screen protector included.", price: 380, zip: "2018", city: "Antwerp", userId: u3.id },
    { title: "iPad Pro 11 inch", description: "2020 model, 64GB, WiFi only. Great for notes.", price: 450, zip: "3000", city: "Leuven", userId: u3.id },
    { title: "Gaming PC", description: "RTX 3060, Ryzen 5 5600X, 16GB RAM, 512GB SSD.", price: 850, zip: "1070", city: "Brussels", userId: u4.id },
    { title: "Nintendo Switch", description: "V2 model with better battery. Includes 3 games.", price: 220, zip: "9000", city: "Ghent", userId: u4.id },
    { title: "AirPods Pro 2", description: "Bought 3 months ago, still have warranty.", price: 180, zip: "1000", city: "Brussels", userId: u5.id },
    { title: "Study books Economics", description: "First year economics books, barely used.", price: 90, zip: "3000", city: "Leuven", userId: u5.id },
    { title: "Kindle Paperwhite", description: "8GB model, waterproof. Perfect condition.", price: 80, zip: "2000", city: "Antwerp", userId: u3.id },
    { title: "Mechanical keyboard", description: "Cherry MX Brown switches, RGB lighting.", price: 65, zip: "9000", city: "Ghent", userId: u2.id },
    { title: "Monitor 27 inch", description: "Dell 27 inch Full HD, perfect for dual setup.", price: 120, zip: "1070", city: "Brussels", userId: u4.id },
    { title: "Backpack North Face", description: "30L capacity, laptop compartment, waterproof.", price: 45, zip: "3001", city: "Leuven", userId: u1.id },
    { title: "Sony WH-1000XM4", description: "Noise cancelling headphones, barely used.", price: 210, zip: "1000", city: "Brussels", userId: u5.id },
    { title: "Bike lock Abus", description: "Heavy duty chain lock with 2 keys.", price: 35, zip: "9000", city: "Ghent", userId: u3.id },
    { title: "Coffee machine Nespresso", description: "Works perfectly, includes milk frother.", price: 75, zip: "2018", city: "Antwerp", userId: u2.id },
    { title: "Yoga mat", description: "6mm thick, non-slip, includes carrying bag.", price: 20, zip: "3000", city: "Leuven", userId: u4.id },
    { title: "Smart Watch Samsung", description: "Galaxy Watch 4, 44mm, includes charger.", price: 160, zip: "1070", city: "Brussels", userId: u1.id },
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


