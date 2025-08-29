"use client";

import {
  Home,
  Users,
  FileText,
  Calendar,
  Settings,
  Building,
  Target,
  BookOpen,
  FileCheck,
  DollarSign,
  Camera,
  LinkIcon,
  BarChart3,
  Activity,
  User,
} from "lucide-react";
import { LogoutButton } from "@/components/admin/auth/LogoutButton";
import Image from "next/image";
import NavLink from "@/components/admin/NavLink";
import NavDropdown from "@/components/admin/NavDropdown";
import NavDropdownItem from "@/components/admin/NavDropdownItem";

export default function Sidebar() {
  return (
    <div className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-gray-200 bg-white h-full overflow-hidden">
      {/* Header dengan Logo */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-full shadow-sm p-1 border border-gray-100">
            <Image
              src="https://drive.google.com/uc?export=view&id=1gb5FoF_-uUJ6LnVH6ZJr2OAdwbZxl-tg"
              alt="HUMANIKA Logo"
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-800">HUMANIKA</h1>
            <p className="text-blue-600 font-medium text-sm">
              Himpunan Mahasiswa Informatika
            </p>
            <p className="text-gray-500 text-xs">
              Universitas AKPRIND Indonesia
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Dashboard Section */}
        <div className="mt-2 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
            Dashboard
          </h3>
        </div>
        <NavLink href="/admin/dashboard/overview" icon={BarChart3}>
          Overview
        </NavLink>
        <NavLink href="/admin/dashboard/activity" icon={Activity}>
          Recent Activity
        </NavLink>
        <NavLink href="/admin/dashboard/stats" icon={Home}>
          Quick Stats
        </NavLink>

        {/* Governance Section */}
        <div className="mt-6 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
            Governance
          </h3>
        </div>

        <NavDropdown icon={Calendar} title="Period">
          <NavDropdownItem href="/admin/governance/period/all">
            All Period
          </NavDropdownItem>
          <NavDropdownItem href="/admin/governance/period/add">
            Add New
          </NavDropdownItem>
        </NavDropdown>

        <NavDropdown icon={Building} title="Organizational Structure">
          <NavDropdownItem href="/admin/governance/organizational/all">
            All Structure
          </NavDropdownItem>
          <NavDropdownItem href="/admin/governance/organizational/manage">
            Add Manage
          </NavDropdownItem>
          <NavDropdownItem href="/admin/governance/organizational/structure">
            Structure
          </NavDropdownItem>
        </NavDropdown>

        {/* People & Access Section */}
        <div className="mt-6 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
            People & Access
          </h3>
        </div>

        <NavDropdown icon={Users} title="Users">
          <NavDropdownItem href="/admin/people/users/all">
            All Users
          </NavDropdownItem>
          <NavDropdownItem href="/admin/people/users/add">
            Add New
          </NavDropdownItem>
          <NavDropdownItem href="/admin/people/users/approval">
            Approval
          </NavDropdownItem>
        </NavDropdown>

        {/* Programs & Events Section */}
        <div className="mt-6 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
            Programs & Events
          </h3>
        </div>

        <NavDropdown icon={Target} title="Work Programs">
          <NavDropdownItem href="/admin/programs/work/all">
            All Programs
          </NavDropdownItem>
          <NavDropdownItem href="/admin/programs/work/add">
            Add New
          </NavDropdownItem>
          <NavDropdownItem href="/admin/programs/work/approval">
            Approval
          </NavDropdownItem>
          <NavDropdownItem href="/admin/programs/work/reports">
            Reports
          </NavDropdownItem>
        </NavDropdown>

        <NavDropdown icon={Calendar} title="Events">
          <NavDropdownItem href="/admin/programs/events/all">
            All Events
          </NavDropdownItem>
          <NavDropdownItem href="/admin/programs/events/add">
            Add New
          </NavDropdownItem>
          <NavDropdownItem href="/admin/programs/events/approval">
            Approval
          </NavDropdownItem>
          <NavDropdownItem href="/admin/programs/events/reports">
            Reports
          </NavDropdownItem>
        </NavDropdown>

        {/* Administration Section */}
        <div className="mt-6 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
            Administration
          </h3>
        </div>

        <NavDropdown icon={FileText} title="Documents">
          <NavDropdownItem href="/admin/administration/documents/all">
            All Documents
          </NavDropdownItem>
          <NavDropdownItem href="/admin/administration/documents/add">
            Add New
          </NavDropdownItem>
          <NavDropdownItem href="/admin/administration/documents/approval">
            Approval
          </NavDropdownItem>
          <NavDropdownItem href="/admin/administration/documents/templates">
            Templates
          </NavDropdownItem>
          <NavDropdownItem href="/admin/administration/documents/reports">
            Reports
          </NavDropdownItem>
        </NavDropdown>

        <NavDropdown icon={FileCheck} title="Letter">
          <NavDropdownItem href="/admin/administration/letter/all">
            All Letter
          </NavDropdownItem>
          <NavDropdownItem href="/admin/administration/letter/add">
            Add New
          </NavDropdownItem>
          <NavDropdownItem href="/admin/administration/letter/approval">
            Approval
          </NavDropdownItem>
          <NavDropdownItem href="/admin/administration/letter/templates">
            Templates
          </NavDropdownItem>
          <NavDropdownItem href="/admin/administration/letter/reports">
            Reports
          </NavDropdownItem>
        </NavDropdown>

        {/* Content & Media Section */}
        <div className="mt-6 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
            Content & Media
          </h3>
        </div>

        <NavDropdown icon={BookOpen} title="Article">
          <NavDropdownItem href="/admin/content/article/all">
            All Article
          </NavDropdownItem>
          <NavDropdownItem href="/admin/content/article/add">
            Add New
          </NavDropdownItem>
          <NavDropdownItem href="/admin/content/article/approval">
            Approval
          </NavDropdownItem>
          <NavDropdownItem href="/admin/content/article/categories">
            Categories
          </NavDropdownItem>
        </NavDropdown>

        <NavDropdown icon={Camera} title="Gallery">
          <NavDropdownItem href="/admin/content/gallery/all">
            All Gallery
          </NavDropdownItem>
          <NavDropdownItem href="/admin/content/gallery/add">
            Add New
          </NavDropdownItem>
          <NavDropdownItem href="/admin/content/gallery/approval">
            Approval
          </NavDropdownItem>
        </NavDropdown>

        <NavDropdown icon={LinkIcon} title="Links">
          <NavDropdownItem href="/admin/content/links/all">
            All Links
          </NavDropdownItem>
          <NavDropdownItem href="/admin/content/links/add">
            Add New
          </NavDropdownItem>
        </NavDropdown>

        {/* Finance Section */}
        <div className="mt-6 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
            Finance
          </h3>
        </div>

        <NavDropdown icon={DollarSign} title="Transaction">
          <NavDropdownItem href="/admin/finance/transaction/all">
            All Transaction
          </NavDropdownItem>
          <NavDropdownItem href="/admin/finance/transaction/add">
            Add New
          </NavDropdownItem>
          <NavDropdownItem href="/admin/finance/transaction/approval">
            Approval
          </NavDropdownItem>
          <NavDropdownItem href="/admin/finance/transaction/categories">
            Categories
          </NavDropdownItem>
          <NavDropdownItem href="/admin/finance/transaction/reports">
            Reports
          </NavDropdownItem>
        </NavDropdown>

        {/* System Section */}
        <div className="mt-6 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
            System
          </h3>
        </div>

        <NavLink href="/admin/system/activity" icon={Activity}>
          Activity
        </NavLink>

        {/* Settings Section */}
        <div className="mt-6 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
            Settings
          </h3>
        </div>

        <NavLink href="/admin/settings/profile" icon={User}>
          Profile
        </NavLink>
        <NavLink href="/admin/settings/account" icon={Settings}>
          Account
        </NavLink>
      </nav>

      {/* Footer dengan Info Pengguna dan Logout */}
      <div className="mt-auto p-4 border-t border-gray-200 space-y-4 bg-gray-50">
        <div className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer border border-transparent hover:border-red-100">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
