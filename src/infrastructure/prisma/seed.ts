import {
  PrismaClient,
  UserRole,
  Department,
  Position,
  FinanceType,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import { colors } from "../lib/random-color";

const prisma = new PrismaClient();

// Function to shuffle array and get unique colors
function getUniqueRandomColors(count: number): string[] {
  const shuffled = [...colors].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function main() {
  // Get unique random colors for all users
  const userColors = getUniqueRandomColors(18);
  let colorIndex = 0;

  const users = [
    // =========================
    // ROLE: DPO
    // =========================
    {
      name: "DPO",
      email: "dpo@humanika.org",
      username: "dpo",
      password: await bcrypt.hash("HUm@n1k@DPO2024!", 10),
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
      email: "ketua_bph@humanika.org",
      username: "ketua_bph",
      password: await bcrypt.hash("HUm@n1k@Ketua2024!", 10),
      role: UserRole.BPH,
      position: Position.KETUA_UMUM,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Wakil Ketua BPH",
      email: "wakil_bph@humanika.org",
      username: "wakil_bph",
      password: await bcrypt.hash("HUm@n1k@Wakil2024!", 10),
      role: UserRole.BPH,
      position: Position.WAKIL_KETUA_UMUM,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Sekretaris BPH",
      email: "sekretaris_bph@humanika.org",
      username: "sekretaris_bph",
      password: await bcrypt.hash("HUm@n1k@Sekretaris2024!", 10),
      role: UserRole.BPH,
      position: Position.SEKRETARIS,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Bendahara BPH",
      email: "bendahara_bph@humanika.org",
      username: "bendahara_bph",
      password: await bcrypt.hash("HUm@n1k@Bendahara2024!", 10),
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
      email: "kepala_infokom@humanika.org",
      username: "kepala_infokom",
      password: await bcrypt.hash("HUm@n1k@Infokom2024!", 10),
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
      email: "staff_infokom@humanika.org",
      username: "staff_infokom",
      password: await bcrypt.hash("HUm@n1k@StaffInfo2024!", 10),
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
      email: "kepala_psdm@humanika.org",
      username: "kepala_psdm",
      password: await bcrypt.hash("HUm@n1k@PSDM2024!", 10),
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
      email: "staff_psdm@humanika.org",
      username: "staff_psdm",
      password: await bcrypt.hash("HUm@n1k@StaffPSDM2024!", 10),
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
      email: "kepala_litbang@humanika.org",
      username: "kepala_litbang",
      password: await bcrypt.hash("HUm@n1k@Litbang2024!", 10),
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
      email: "staff_litbang@humanika.org",
      username: "staff_litbang",
      password: await bcrypt.hash("HUm@n1k@StaffLitbang2024!", 10),
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
      email: "kepala_kwu@humanika.org",
      username: "kepala_kwu",
      password: await bcrypt.hash("HUm@n1k@KWU2024!", 10),
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
      email: "staff_kwu@humanika.org",
      username: "staff_kwu",
      password: await bcrypt.hash("HUm@n1k@StaffKWU2024!", 10),
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
      email: "anggota1@humanika.org",
      username: "anggota1",
      password: await bcrypt.hash("HUm@n1k@Anggota12024!", 10),
      role: UserRole.ANGGOTA,
      isActive: true,
      verifiedAccount: true,
      attemptLogin: 0,
      avatarColor: userColors[colorIndex++],
    },
    {
      name: "Anggota 2",
      email: "anggota2@humanika.org",
      username: "anggota2",
      password: await bcrypt.hash("HUm@n1k@Anggota22024!", 10),
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

  // Seed Article Categories
  const articleCategories = [
    { name: "Berita", description: "Berita terkini dan informasi penting" },
    { name: "Pengumuman", description: "Pengumuman resmi organisasi" },
    { name: "Artikel", description: "Artikel informatif dan edukasi" },
    { name: "Opini", description: "Artikel opini dan pandangan" },
    { name: "Tutorial", description: "Panduan dan tutorial" },
  ];

  for (const category of articleCategories) {
    await prisma.articleCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Seed Document Types
  const documentTypes = [
    { name: "Proposal", description: "Dokumen proposal kegiatan atau program" },
    {
      name: "Laporan Kegiatan",
      description: "Laporan hasil kegiatan yang telah dilaksanakan",
    },
    {
      name: "Laporan Keuangan",
      description: "Laporan pertanggungjawaban keuangan",
    },
    {
      name: "Surat Keputusan",
      description: "Surat keputusan resmi organisasi",
    },
    { name: "Kontrak", description: "Dokumen kontrak kerja sama" },
    {
      name: "Sertifikat",
      description: "Sertifikat penghargaan atau partisipasi",
    },
    { name: "Undangan", description: "Surat undangan acara" },
    { name: "Memorandum", description: "Dokumen memorandum internal" },
  ];

  for (const docType of documentTypes) {
    await prisma.documentType.upsert({
      where: { name: docType.name },
      update: {},
      create: docType,
    });
  }

  // Seed Event Categories
  const eventCategories = [
    { name: "Seminar", description: "Kegiatan seminar dan diskusi" },
    { name: "Workshop", description: "Pelatihan praktis dan workshop" },
    { name: "Pelatihan", description: "Kegiatan pelatihan dan pengembangan" },
    { name: "Sosialisasi", description: "Kegiatan sosialisasi program" },
    { name: "Kompetisi", description: "Lomba dan kompetisi" },
    { name: "Pameran", description: "Pameran produk atau karya" },
    { name: "Rapat", description: "Rapat koordinasi dan evaluasi" },
  ];

  for (const category of eventCategories) {
    await prisma.eventCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Seed Finance Categories
  const financeCategories = [
    // Income categories
    {
      name: "Donasi",
      description: "Penerimaan donasi dari berbagai pihak",
      type: FinanceType.INCOME,
    },
    {
      name: "Sponsor",
      description: "Penerimaan sponsorship acara",
      type: FinanceType.INCOME,
    },
    {
      name: "Penjualan Merchandise",
      description: "Penjualan merchandise organisasi",
      type: FinanceType.INCOME,
    },
    {
      name: "Iuran Anggota",
      description: "Iuran keanggotaan",
      type: FinanceType.INCOME,
    },
    {
      name: "Pendapatan Usaha",
      description: "Pendapatan dari usaha organisasi",
      type: FinanceType.INCOME,
    },
    // Expense categories
    {
      name: "Transportasi",
      description: "Biaya transportasi dan perjalanan",
      type: FinanceType.EXPENSE,
    },
    {
      name: "Konsumsi",
      description: "Biaya makan dan minum",
      type: FinanceType.EXPENSE,
    },
    {
      name: "Sewa Tempat",
      description: "Biaya sewa lokasi kegiatan",
      type: FinanceType.EXPENSE,
    },
    {
      name: "Honorarium",
      description: "Honorarium pembicara atau panitia",
      type: FinanceType.EXPENSE,
    },
    {
      name: "Peralatan",
      description: "Pembelian peralatan dan bahan",
      type: FinanceType.EXPENSE,
    },
    {
      name: "Promosi",
      description: "Biaya promosi dan publikasi",
      type: FinanceType.EXPENSE,
    },
  ];

  for (const category of financeCategories) {
    await prisma.financeCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Seed Gallery Categories
  const galleryCategories = [
    { name: "Dokumentasi Kegiatan", description: "Foto dokumentasi kegiatan" },
    { name: "Promosi", description: "Foto untuk keperluan promosi" },
    { name: "Portofolio", description: "Koleksi karya dan prestasi" },
    { name: "Acara Khusus", description: "Foto acara-acara khusus" },
  ];

  for (const category of galleryCategories) {
    await prisma.galleryCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log(
    "✅ Seeding selesai: Semua role user, kategori artikel, tipe dokumen, kategori event, kategori keuangan, dan kategori galeri berhasil dibuat!"
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
