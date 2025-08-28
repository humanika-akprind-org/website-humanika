import { PrismaClient, UserRole, Department, Position } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

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
      verifiedEmail: true,
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
      verifiedEmail: true,
    },
    {
      name: "Wakil Ketua BPH",
      email: "wakil_bph@example.com",
      username: "wakil_bph",
      password: hashedPassword,
      role: UserRole.BPH,
      position: Position.WAKIL_KETUA_UMUM,
      verifiedEmail: true,
    },
    {
      name: "Sekretaris BPH",
      email: "sekretaris_bph@example.com",
      username: "sekretaris_bph",
      password: hashedPassword,
      role: UserRole.BPH,
      position: Position.SEKRETARIS,
    },
    {
      name: "Bendahara BPH",
      email: "bendahara_bph@example.com",
      username: "bendahara_bph",
      password: hashedPassword,
      role: UserRole.BPH,
      position: Position.BENDAHARA,
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
    },
    {
      name: "Staff Infokom",
      email: "staff_infokom@example.com",
      username: "staff_infokom",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.INFOKOM,
      position: Position.STAFF_DEPARTEMEN,
    },
    {
      name: "Kepala PSDM",
      email: "kepala_psdm@example.com",
      username: "kepala_psdm",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.PSDM,
      position: Position.KEPALA_DEPARTEMEN,
    },
    {
      name: "Staff PSDM",
      email: "staff_psdm@example.com",
      username: "staff_psdm",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.PSDM,
      position: Position.STAFF_DEPARTEMEN,
    },
    {
      name: "Kepala Litbang",
      email: "kepala_litbang@example.com",
      username: "kepala_litbang",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.LITBANG,
      position: Position.KEPALA_DEPARTEMEN,
    },
    {
      name: "Staff Litbang",
      email: "staff_litbang@example.com",
      username: "staff_litbang",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.LITBANG,
      position: Position.STAFF_DEPARTEMEN,
    },
    {
      name: "Kepala KWU",
      email: "kepala_kwu@example.com",
      username: "kepala_kwu",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.KWU,
      position: Position.KEPALA_DEPARTEMEN,
    },
    {
      name: "Staff KWU",
      email: "staff_kwu@example.com",
      username: "staff_kwu",
      password: hashedPassword,
      role: UserRole.PENGURUS,
      department: Department.KWU,
      position: Position.STAFF_DEPARTEMEN,
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
    },
    {
      name: "Anggota 2",
      email: "anggota2@example.com",
      username: "anggota2",
      password: hashedPassword,
      role: UserRole.ANGGOTA,
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
