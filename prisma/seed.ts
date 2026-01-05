import { PrismaClient, UserRole, Department, Position } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { colors } from "../lib/random-color";

const prisma = new PrismaClient();

// Function to shuffle array and get unique colors
function getUniqueRandomColors(count: number): string[] {
  const shuffled = [...colors].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Get unique random colors for all users
  const userColors = getUniqueRandomColors(18);
  let colorIndex = 0;

  const users = [
    // =========================
    // ROLE: DPO
    // =========================
    {
      name: "DPO",
      email: "dpo@example.com",
      username: "dpo",
      password: hashedPassword,
      role: UserRole.DPO,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },

    // =========================
    // ROLE: BPH
    // =========================
    {
      name: "Ketua Umum BPH",
      email: "ketua_bph@example.com",
      username: "ketua_bph",
      password: hashedPassword,
      role: UserRole.BPH,
      position: Position.KETUA_UMUM,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Wakil Ketua BPH",
      email: "wakil_bph@example.com",
      username: "wakil_bph",
      password: hashedPassword,
      role: UserRole.BPH,
      position: Position.WAKIL_KETUA_UMUM,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Sekretaris BPH",
      email: "sekretaris_bph@example.com",
      username: "sekretaris_bph",
      password: hashedPassword,
      role: UserRole.BPH,
      position: Position.SEKRETARIS,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Bendahara BPH",
      email: "bendahara_bph@example.com",
      username: "bendahara_bph",
      password: hashedPassword,
      role: UserRole.BPH,
      position: Position.BENDAHARA,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },

    // =========================
    // ROLE: PENGURUS DEPARTEMEN
    // =========================
    {
      name: "Kepala Infokom",
      email: "kepala_infokom@example.com",
      username: "kepala_infokom",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.INFOKOM,
      position: Position.KEPALA_DEPARTEMEN,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Staff Infokom",
      email: "staff_infokom@example.com",
      username: "staff_infokom",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.INFOKOM,
      position: Position.STAFF_DEPARTEMEN,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Kepala PSDM",
      email: "kepala_psdm@example.com",
      username: "kepala_psdm",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.PSDM,
      position: Position.KEPALA_DEPARTEMEN,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Staff PSDM",
      email: "staff_psdm@example.com",
      username: "staff_psdm",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.PSDM,
      position: Position.STAFF_DEPARTEMEN,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Kepala Litbang",
      email: "kepala_litbang@example.com",
      username: "kepala_litbang",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.LITBANG,
      position: Position.KEPALA_DEPARTEMEN,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Staff Litbang",
      email: "staff_litbang@example.com",
      username: "staff_litbang",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.LITBANG,
      position: Position.STAFF_DEPARTEMEN,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Kepala KWU",
      email: "kepala_kwu@example.com",
      username: "kepala_kwu",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.KWU,
      position: Position.KEPALA_DEPARTEMEN,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Staff KWU",
      email: "staff_kwu@example.com",
      username: "staff_kwu",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.KWU,
      position: Position.STAFF_DEPARTEMEN,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },

    // =========================
    // ROLE: ANGGOTA
    // =========================
    {
      name: "Anggota 1",
      email: "anggota1@example.com",
      username: "anggota1",
      password: hashedPassword,
      role: UserRole.ANGGOTA,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Anggota 2",
      email: "anggota2@example.com",
      username: "anggota2",
      password: hashedPassword,
      role: UserRole.ANGGOTA,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log("✅ Seeding selesai: Semua role user berhasil dibuat!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
