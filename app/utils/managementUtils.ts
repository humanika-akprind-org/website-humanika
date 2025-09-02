import { Department, Position } from "@/types/enums";

export const getDepartmentClass = (department: Department): string => {
  switch (department) {
    case Department.INFOKOM:
      return "bg-blue-100 text-blue-800";
    case Department.PSDM:
      return "bg-green-100 text-green-800";
    case Department.LITBANG:
      return "bg-purple-100 text-purple-800";
    case Department.KWU:
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getDepartmentDisplayName = (department: Department): string => {
  switch (department) {
    case Department.INFOKOM:
      return "INFOKOM";
    case Department.PSDM:
      return "PSDM";
    case Department.LITBANG:
      return "LITBANG";
    case Department.KWU:
      return "KWU";
    default:
      return department;
  }
};

export const getPositionDisplayName = (position: Position): string => {
  switch (position) {
    case Position.KETUA_UMUM:
      return "Ketua Umum";
    case Position.WAKIL_KETUA_UMUM:
      return "Wakil Ketua Umum";
    case Position.SEKRETARIS:
      return "Sekretaris";
    case Position.BENDAHARA:
      return "Bendahara";
    case Position.KEPALA_DEPARTEMEN:
      return "Kepala Departemen";
    case Position.STAFF_DEPARTEMEN:
      return "Staff Departemen";
    default:
      return position;
  }
};
