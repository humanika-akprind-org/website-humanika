import React from "react";
import type { Project } from "@/types/project";
import { Status, Department } from "@/types/enums";

export default function ProjectsPage() {
  // Static sample work programs data
  const workPrograms: Project[] = [
    {
      id: "1",
      name: "Pengembangan Website HUMANIKA",
      department: Department.INFOKOM,
      schedule: "Januari - Juni 2024",
      status: Status.PUBLISH,
      goal: "Membuat website resmi HUMANIKA yang modern dan responsif untuk meningkatkan branding dan komunikasi organisasi.",
      periodId: "2024",
      period: {
        id: "2024",
        name: "2024",
        startYear: 2024,
        endYear: 2024,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      responsibleId: "user1",
      responsible: {
        id: "user1",
        name: "Ahmad Rahman",
        email: "ahmad.rahman@humanika.com",
        username: "ahmadrahman",
        role: "PENGURUS",
        department: Department.INFOKOM,
        position: "KEPALA_DEPARTEMEN",
        isActive: true,
        verifiedAccount: true,
        attemptLogin: 0,
        blockExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatarColor: "#3B82F6",
      },
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-03-20"),
    },
    {
      id: "2",
      name: "Pelatihan Soft Skills Anggota",
      department: Department.PSDM,
      schedule: "Februari - April 2024",
      status: Status.PUBLISH,
      goal: "Meningkatkan kemampuan soft skills anggota melalui berbagai workshop dan pelatihan untuk persiapan karir.",
      periodId: "2024",
      period: {
        id: "2024",
        name: "2024",
        startYear: 2024,
        endYear: 2024,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      responsibleId: "user2",
      responsible: {
        id: "user2",
        name: "Siti Nurhaliza",
        email: "siti.nurhaliza@humanika.com",
        username: "sitinurhaliza",
        role: "PENGURUS",
        department: Department.PSDM,
        position: "KEPALA_DEPARTEMEN",
        isActive: true,
        verifiedAccount: true,
        attemptLogin: 0,
        blockExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatarColor: "#10B981",
      },
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-03-15"),
    },
    {
      id: "3",
      name: "Penelitian Teknologi AI",
      department: Department.LITBANG,
      schedule: "Maret - Desember 2024",
      status: Status.PUBLISH,
      goal: "Melakukan penelitian dan pengembangan aplikasi berbasis AI untuk membantu kegiatan akademik mahasiswa informatika.",
      periodId: "2024",
      period: {
        id: "2024",
        name: "2024",
        startYear: 2024,
        endYear: 2024,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      responsibleId: "user3",
      responsible: {
        id: "user3",
        name: "Budi Santoso",
        email: "budi.santoso@humanika.com",
        username: "budisantoso",
        role: "PENGURUS",
        department: Department.LITBANG,
        position: "KEPALA_DEPARTEMEN",
        isActive: true,
        verifiedAccount: true,
        attemptLogin: 0,
        blockExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatarColor: "#F59E0B",
      },
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2024-04-10"),
    },
    {
      id: "4",
      name: "Program Kreativitas Mahasiswa",
      department: Department.KWU,
      schedule: "April - November 2024",
      status: Status.PUBLISH,
      goal: "Mengembangkan program kreativitas mahasiswa melalui berbagai kegiatan seni, budaya, dan inovasi.",
      periodId: "2024",
      period: {
        id: "2024",
        name: "2024",
        startYear: 2024,
        endYear: 2024,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      responsibleId: "user4",
      responsible: {
        id: "user4",
        name: "Maya Sari",
        email: "maya.sari@humanika.com",
        username: "mayasari",
        role: "PENGURUS",
        department: Department.KWU,
        position: "KEPALA_DEPARTEMEN",
        isActive: true,
        verifiedAccount: true,
        attemptLogin: 0,
        blockExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatarColor: "#EF4444",
      },
      createdAt: new Date("2024-04-01"),
      updatedAt: new Date("2024-05-05"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 to-red-700 text-white rounded-xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-20 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold mb-4">Program Kerja HUMANIKA</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Berbagai program kerja dan kegiatan yang dilaksanakan oleh
              Himpunan Mahasiswa Informatika untuk kemajuan bersama.
            </p>
          </div>
        </section>

        {/* Projects Grid */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-blue-600 pb-2 inline-block">
              Program Kerja {new Date().getFullYear()}
            </h2>
            <div className="text-sm text-gray-600">
              Total Program: {workPrograms.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {workPrograms.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold leading-tight">
                      {program.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        program.status === Status.PUBLISH
                          ? "bg-green-500 text-white"
                          : program.status === Status.PENDING
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {program.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        program.department === Department.INFOKOM
                          ? "bg-blue-500 text-white"
                          : program.department === Department.PSDM
                          ? "bg-green-500 text-white"
                          : program.department === Department.LITBANG
                          ? "bg-purple-500 text-white"
                          : "bg-pink-500 text-white"
                      }`}
                    >
                      {program.department}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Responsible Person */}
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{
                          backgroundColor: program.responsible.avatarColor,
                        }}
                      >
                        {program.responsible.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Penanggung Jawab
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {program.responsible.name}
                        </p>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Jadwal</p>
                        <p className="text-sm font-medium text-gray-800">
                          {program.schedule}
                        </p>
                      </div>
                    </div>

                    {/* Goal */}
                    <div className="border-t pt-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-1">Tujuan</p>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            {program.goal}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Ringkasan Program Kerja
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {workPrograms.length}
              </div>
              <p className="text-gray-600">Total Program</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {
                  workPrograms.filter(
                    (program) => program.status === Status.PUBLISH
                  ).length
                }
              </div>
              <p className="text-gray-600">Program Diterbitkan</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
