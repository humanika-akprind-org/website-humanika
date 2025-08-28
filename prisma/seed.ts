// seed.ts
import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Mulai seeding data user...");

  // Hash password untuk semua user
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Data user yang akan di-seed
  const users = [
    {
      name: "Admin DPO",
      email: "dpo@example.com",
      username: "dpo_admin",
      password: hashedPassword,
      role: UserRole.DPO,
      division: "DPO",
      position: "Admin DPO",
      verifiedEmail: true,
    },
    {
      name: "Ketua BPH",
      email: "bph@example.com",
      username: "bph_ketua",
      password: hashedPassword,
      role: UserRole.BPH,
      division: "BPH",
      position: "Ketua",
      verifiedEmail: true,
    },
    {
      name: "Sekretaris BPH",
      email: "sekretaris@example.com",
      username: "bph_sekretaris",
      password: hashedPassword,
      role: UserRole.BPH,
      division: "BPH",
      position: "Sekretaris",
      verifiedEmail: true,
    },
    {
      name: "Bendahara BPH",
      email: "bendahara@example.com",
      username: "bph_bendahara",
      password: hashedPassword,
      role: UserRole.BPH,
      division: "BPH",
      position: "Bendahara",
      verifiedEmail: true,
    },
    {
      name: "Koordinator Acara",
      email: "acara@example.com",
      username: "pengurus_acara",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      division: "Acara",
      position: "Koordinator",
      verifiedEmail: true,
    },
    {
      name: "Anggota Biasa",
      email: "anggota@example.com",
      username: "anggota_biasa",
      password: hashedPassword,
      role: UserRole.ANGGOTA,
      division: "Umum",
      position: "Anggota",
      verifiedEmail: true,
    },
    {
      name: "John Doe",
      email: "john.doe@example.com",
      username: "john_doe",
      password: hashedPassword,
      role: UserRole.ANGGOTA,
      division: "Kreatif",
      position: "Desainer",
      verifiedEmail: true,
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      username: "jane_smith",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      division: "Media",
      position: "Koordinator Media",
      verifiedEmail: true,
    },
  ];

  // Menambahkan user ke database
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    console.log(`User ${user.name} telah dibuat/diperbarui`);
  }

  console.log("Seeding data user selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
