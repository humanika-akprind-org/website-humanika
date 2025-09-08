// components/admin/layout/SidebarMobile.jsx
"use client";

import { useState } from "react";
import {
  Home,
  Users,
  Calendar,
  Settings,
  Building,
  Target,
  BookOpen,
  DollarSign,
  Camera,
  LinkIcon,
  BarChart3,
  Activity,
  User,
  ClipboardList,
  Shield,
  FolderOpen,
  Mail,
  PieChart,
  Menu,
  X,
} from "lucide-react";
import { LogoutButton } from "@/components/admin/auth/LogoutButton";
import Image from "next/image";
import NavLink from "@/components/admin/layout/NavLink";
import NavDropdown from "@/components/admin/layout/NavDropdown";
import NavDropdownItem from "@/components/admin/layout/NavDropdownItem";

export default function SidebarMobile() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-full shadow-sm p-1 border border-gray-100">
            <Image
              src="/logo.png"
              alt="HUMANIKA"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-800">HUMANIKA</h1>
            <p className="text-blue-600 font-medium text-xs">
              Himpunan Mahasiswa
            </p>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full shadow-sm p-1 border border-gray-100">
              <Image
                src="/logo.png"
                alt="HUMANIKA"
                width={50}
                height={50}
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
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
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
        
                <NavDropdown icon={Calendar} title="Periods">
                  <NavDropdownItem href="/admin/governance/periods">
                    All Period
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/governance/periods/add">
                    Add New
                  </NavDropdownItem>
                </NavDropdown>
        
                <NavDropdown icon={Shield} title="Managements">
                  <NavDropdownItem href="/admin/governance/managements">
                    All Manage
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/governance/managements/add">
                    Add Manage
                  </NavDropdownItem>
                </NavDropdown>
        
                <NavDropdown icon={Building} title="Organizational Structure">
                  <NavDropdownItem href="/admin/governance/structure">
                    All Structure
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/governance/structure/add">
                    Add Structure
                  </NavDropdownItem>
                </NavDropdown>
        
                <NavDropdown icon={ClipboardList} title="Department Tasks">
                  <NavDropdownItem href="/admin/governance/tasks">
                    All Tasks
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/governance/tasks/add">
                    Add New
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/governance/tasks/approval">
                    Approval
                  </NavDropdownItem>
                </NavDropdown>
        
                {/* People & Access Section */}
                <div className="mt-6 mb-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                    People & Access
                  </h3>
                </div>
        
                <NavDropdown icon={Users} title="Users">
                  <NavDropdownItem href="/admin/people/users">
                    All Users
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/people/users/add">
                    Add New
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/people/users/roles">
                    Roles & Permissions
                  </NavDropdownItem>
                </NavDropdown>
        
                {/* Programs & Events Section */}
                <div className="mt-6 mb-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                    Programs & Events
                  </h3>
                </div>
        
                <NavDropdown icon={Target} title="Work Programs">
                  <NavDropdownItem href="/admin/programs/works">
                    All Programs
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/programs/works/add">
                    Add New
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/programs/works/approval">
                    Approval
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/programs/works/reports">
                    Reports
                  </NavDropdownItem>
                </NavDropdown>
        
                <NavDropdown icon={Calendar} title="Events">
                  <NavDropdownItem href="/admin/programs/events">
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
        
                <NavDropdown icon={FolderOpen} title="Documents">
                  <NavDropdownItem href="/admin/administration/documents">
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
        
                <NavDropdown icon={Mail} title="Letter">
                  <NavDropdownItem href="/admin/administration/letters">
                    All Letter
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/administration/letters/add">
                    Add New
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/administration/letters/approval">
                    Approval
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/administration/letters/templates">
                    Templates
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/administration/letters/reports">
                    Reports
                  </NavDropdownItem>
                </NavDropdown>
        
                {/* Content & Media Section */}
                <div className="mt-6 mb-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                    Content & Media
                  </h3>
                </div>
        
                <NavDropdown icon={BookOpen} title="Articles">
                  <NavDropdownItem href="/admin/content/articles">
                    All Article
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/content/articles/add">
                    Add New
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/content/articles/approval">
                    Approval
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/content/articles/categories">
                    Categories
                  </NavDropdownItem>
                </NavDropdown>
        
                <NavDropdown icon={Camera} title="Galleries">
                  <NavDropdownItem href="/admin/content/galleries">
                    All Gallery
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/content/galleries/add">
                    Add New
                  </NavDropdownItem>
                </NavDropdown>
        
                <NavDropdown icon={LinkIcon} title="Links">
                  <NavDropdownItem href="/admin/content/links/short">
                    Short Links
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/content/links/hubs">
                    Link Hubs
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/content/links/themes">
                    Hub Themes
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/content/links/approval">
                    Approval
                  </NavDropdownItem>
                </NavDropdown>
        
                {/* Finance Section */}
                <div className="mt-6 mb-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                    Finance
                  </h3>
                </div>
        
                <NavDropdown icon={DollarSign} title="Transactions">
                  <NavDropdownItem href="/admin/finance/transactions">
                    All Transaction
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/finance/transactions/add">
                    Add New
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/finance/transactions/approval">
                    Approval
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/finance/transactions/categories">
                    Categories
                  </NavDropdownItem>
                  <NavDropdownItem href="/admin/finance/transactions/reports">
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
                  Activity Log
                </NavLink>
                <NavLink href="/admin/system/settings" icon={Settings}>
                  System Settings
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
                <NavLink href="/admin/settings/preferences" icon={PieChart}>
                  Preferences
                </NavLink>
              </nav>

        {/* Footer dengan Logout */}
        <div className="mt-auto p-4 border-t border-gray-200 space-y-4 bg-gray-50">
          <div className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer border border-transparent hover:border-red-100">
            <LogoutButton />
          </div>
        </div>
      </div>
    </>
  );
}
