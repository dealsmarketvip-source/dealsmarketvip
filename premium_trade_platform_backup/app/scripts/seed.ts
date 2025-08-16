
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

const categories = [
  { name: "Oil & Gas", slug: "oil-gas", icon: "Fuel", description: "Energy sector opportunities and petroleum products" },
  { name: "Luxury Cars", slug: "luxury-cars", icon: "Car", description: "Premium automotive deals and luxury vehicles" },
  { name: "Gold & Precious Metals", slug: "gold-metals", icon: "Coins", description: "Precious metals trading and investments" },
  { name: "Luxury Watches", slug: "luxury-watches", icon: "Watch", description: "High-end timepieces and collector watches" },
  { name: "Business Acquisitions", slug: "business-acquisitions", icon: "Building2", description: "M&A opportunities and business investments" },
  { name: "Hotels & Real Estate", slug: "hotels-realestate", icon: "Hotel", description: "Property investments and hospitality assets" },
  { name: "Yachts & Boats", slug: "yachts-boats", icon: "Ship", description: "Marine luxury assets and watercraft" },
  { name: "Private Jets", slug: "private-jets", icon: "Plane", description: "Aviation opportunities and aircraft deals" },
  { name: "Art & Collectibles", slug: "art-collectibles", icon: "Palette", description: "Fine art, antiques and collectible items" },
  { name: "Diamonds & Jewelry", slug: "diamonds-jewelry", icon: "Diamond", description: "Luxury jewelry, gems and precious stones" }
]

async function main() {
  console.log("Starting database seeding...")

  // Create categories
  console.log("Creating categories...")
  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    })
  }
  console.log(`Created ${categories.length} categories`)

  // Create admin user
  console.log("Creating admin user...")
  const hashedPassword = await hash("admin123", 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@premiumtrade.com" },
    update: {},
    create: {
      email: "admin@premiumtrade.com",
      name: "System Administrator",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  })
  console.log("Created admin user:", adminUser.email)

  // Create test verified company user
  console.log("Creating test company user...")
  const testPassword = await hash("johndoe123", 12)
  
  const testUser = await prisma.user.upsert({
    where: { email: "john@doe.com" },
    update: {},
    create: {
      email: "john@doe.com",
      name: "John Doe",
      password: testPassword,
      role: "VERIFIED_COMPANY",
      emailVerified: new Date(),
      company: {
        create: {
          name: "Doe Trading LLC",
          country: "Germany",
          registryNumber: "HRB123456",
          licenseNumber: "TL789012",
          linkedinUrl: "https://linkedin.com/company/doe-trading",
          status: "VERIFIED",
        },
      },
    },
    include: {
      company: true,
    },
  })
  console.log("Created test company user:", testUser.email)

  // Create verification record for test company
  if (testUser.company) {
    const existingVerification = await prisma.companyVerification.findFirst({
      where: { companyId: testUser.company.id }
    })

    if (!existingVerification) {
      await prisma.companyVerification.create({
        data: {
          companyId: testUser.company.id,
          status: "APPROVED",
          reviewedBy: adminUser.id,
          reviewDate: new Date(),
          notes: "Test company - automatically approved during seeding",
        },
      })
    }
  }

  // Create some sample ads for the test user
  console.log("Creating sample ads...")
  const oilCategory = await prisma.category.findUnique({
    where: { slug: "oil-gas" }
  })
  const luxuryCarCategory = await prisma.category.findUnique({
    where: { slug: "luxury-cars" }
  })

  if (oilCategory && testUser.company) {
    await prisma.ad.create({
      data: {
        title: "Premium Crude Oil - 100,000 Barrels",
        description: "High-quality crude oil from North Sea reserves. Immediate delivery available. ISO certified and fully documented.",
        type: "SELL",
        categoryId: oilCategory.id,
        country: "Germany",
        contactInfo: "j.doe@doetrading.com | +49 30 12345678",
        price: 8500000.00,
        currency: "EUR",
        authorId: testUser.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    })
  }

  if (luxuryCarCategory && testUser.company) {
    await prisma.ad.create({
      data: {
        title: "Ferrari F8 Tributo - 2023 Model",
        description: "Brand new Ferrari F8 Tributo with only 500km. Full warranty and service package included. Collector condition.",
        type: "SELL",
        categoryId: luxuryCarCategory.id,
        country: "Germany",
        contactInfo: "luxury@doetrading.com | +49 30 87654321",
        price: 285000.00,
        currency: "EUR",
        authorId: testUser.id,
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      },
    })
  }

  console.log("Database seeding completed successfully!")
  console.log("\n=== Test Accounts ===")
  console.log("Admin: admin@premiumtrade.com / admin123")
  console.log("Test Company: john@doe.com / johndoe123")
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
