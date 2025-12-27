// components/admin/layout/SidebarMobile.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Users,
  CalendarClock,
  CalendarRange,
  Settings,
  Network,
  MonitorCog,
  Newspaper,
  Landmark,
  Images,
  BarChart3,
  Activity,
  User,
  ClipboardList,
  UserCog,
  SquareLibrary,
  FileText,
  BookCheck,
  BookText,
  Menu,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { LogoutButton } from "components/admin/auth/LogoutButton";
import Image from "next/image";
import NavLink from "components/admin/layout/NavLink";
import NavDropdown from "components/admin/layout/NavDropdown";
import NavDropdownItem from "components/admin/layout/NavDropdownItem";
import { UserRole } from "types/enums";

export default function SidebarMobile() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  // Access control function
  const hasAccess = (allowedRoles: UserRole[]) =>
    userRole && allowedRoles.includes(userRole as UserRole);

  // Check if dropdown has any accessible items
  const hasDropdownAccess = (items: { href: string; roles: UserRole[] }[]) =>
    items.some((item) => hasAccess(item.roles));

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
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
          {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
            <>
              <div className="mt-2 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                  Dashboard
                </h3>
              </div>
              <NavLink href="/admin/dashboard/overview" icon={Home}>
                Overview
              </NavLink>
              <NavLink href="/admin/dashboard/activity" icon={Activity}>
                Recent Activity
              </NavLink>
              <NavLink href="/admin/dashboard/stats" icon={BarChart3}>
                Quick Stats
              </NavLink>
            </>
          )}

          {/* Governance Section */}
          {hasDropdownAccess([
            {
              href: "/admin/governance/periods",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/governance/periods/add",
              roles: [UserRole.DPO, UserRole.BPH],
            },
            {
              href: "/admin/governance/managements",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/governance/managements/add",
              roles: [UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/governance/structure",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
            { href: "/admin/governance/structure/add", roles: [UserRole.BPH] },
            {
              href: "/admin/governance/tasks",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
            { href: "/admin/governance/tasks/add", roles: [UserRole.PENGURUS] },
          ]) && (
            <>
              <div className="mt-6 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                  Governance
                </h3>
              </div>

              {hasDropdownAccess([
                {
                  href: "/admin/governance/periods",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/governance/periods/add",
                  roles: [UserRole.DPO, UserRole.BPH],
                },
              ]) && (
                <NavDropdown icon={CalendarClock} title="Periods">
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/governance/periods">
                      All Period
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.DPO, UserRole.BPH]) && (
                    <NavDropdownItem href="/admin/governance/periods/add">
                      Add New
                    </NavDropdownItem>
                  )}
                </NavDropdown>
              )}

              {hasDropdownAccess([
                {
                  href: "/admin/governance/managements",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/governance/managements/add",
                  roles: [UserRole.BPH, UserRole.PENGURUS],
                },
              ]) && (
                <NavDropdown icon={UserCog} title="Managements">
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/governance/managements">
                      All Management
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.BPH, UserRole.PENGURUS]) && (
                    <NavDropdownItem href="/admin/governance/managements/add">
                      Add New
                    </NavDropdownItem>
                  )}
                </NavDropdown>
              )}

              {hasDropdownAccess([
                {
                  href: "/admin/governance/structure",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/governance/structure/add",
                  roles: [UserRole.BPH],
                },
              ]) && (
                <NavDropdown icon={Network} title="Organizational Structure">
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/governance/structure">
                      All Structure
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.BPH]) && (
                    <NavDropdownItem href="/admin/governance/structure/add">
                      Add New
                    </NavDropdownItem>
                  )}
                </NavDropdown>
              )}

              {hasDropdownAccess([
                {
                  href: "/admin/governance/tasks",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/governance/tasks/add",
                  roles: [UserRole.PENGURUS],
                },
              ]) && (
                <NavDropdown icon={ClipboardList} title="Department Tasks">
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/governance/tasks">
                      All Tasks
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.PENGURUS]) && (
                    <NavDropdownItem href="/admin/governance/tasks/add">
                      Add New
                    </NavDropdownItem>
                  )}
                </NavDropdown>
              )}
            </>
          )}

          {/* People & Access Section */}
          {hasDropdownAccess([
            { href: "/admin/people/users", roles: [UserRole.BPH] },
            { href: "/admin/people/users/add", roles: [UserRole.BPH] },
            { href: "/admin/people/users/roles", roles: [UserRole.BPH] },
          ]) && (
            <>
              <div className="mt-6 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                  People & Access
                </h3>
              </div>

              <NavDropdown icon={Users} title="Users">
                {hasAccess([UserRole.BPH]) && (
                  <NavDropdownItem href="/admin/people/users">
                    All Users
                  </NavDropdownItem>
                )}
                {hasAccess([UserRole.BPH]) && (
                  <NavDropdownItem href="/admin/people/users/add">
                    Add New
                  </NavDropdownItem>
                )}
                {hasAccess([UserRole.BPH]) && (
                  <NavDropdownItem href="/admin/people/users/roles">
                    Roles & Permissions
                  </NavDropdownItem>
                )}
              </NavDropdown>
            </>
          )}

          {/* Programs & Events Section */}
          {hasDropdownAccess([
            {
              href: "/admin/program/works",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/program/works/add",
              roles: [UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/program/works/approval",
              roles: [UserRole.DPO, UserRole.BPH],
            },
            {
              href: "/admin/program/events",
              roles: [UserRole.BPH, UserRole.PENGURUS],
            },
            { href: "/admin/program/events/add", roles: [UserRole.PENGURUS] },
            {
              href: "/admin/program/events/categories",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/program/events/approval",
              roles: [UserRole.DPO, UserRole.BPH],
            },
          ]) && (
            <>
              <div className="mt-6 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                  Programs & Events
                </h3>
              </div>

              {hasDropdownAccess([
                {
                  href: "/admin/program/works",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/program/works/add",
                  roles: [UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/program/works/approval",
                  roles: [UserRole.DPO, UserRole.BPH],
                },
              ]) && (
                <NavDropdown icon={MonitorCog} title="Work Programs">
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/program/works">
                      All Programs
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.BPH, UserRole.PENGURUS]) && (
                    <NavDropdownItem href="/admin/program/works/add">
                      Add New
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.DPO, UserRole.BPH]) && (
                    <NavDropdownItem href="/admin/program/works/approval">
                      Approval
                    </NavDropdownItem>
                  )}
                </NavDropdown>
              )}

              {hasDropdownAccess([
                {
                  href: "/admin/program/events",
                  roles: [UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/program/events/add",
                  roles: [UserRole.PENGURUS],
                },
                {
                  href: "/admin/program/events/categories",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/program/events/approval",
                  roles: [UserRole.DPO, UserRole.BPH],
                },
              ]) && (
                <NavDropdown icon={CalendarRange} title="Events">
                  {hasAccess([UserRole.BPH, UserRole.PENGURUS]) && (
                    <NavDropdownItem href="/admin/program/events">
                      All Events
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.PENGURUS]) && (
                    <NavDropdownItem href="/admin/program/events/add">
                      Add New
                    </NavDropdownItem>
                  )}
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/program/events/categories">
                      Categories
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.DPO, UserRole.BPH]) && (
                    <NavDropdownItem href="/admin/program/events/approval">
                      Approval
                    </NavDropdownItem>
                  )}
                </NavDropdown>
              )}
            </>
          )}

          {/* Administration Section */}
          {hasDropdownAccess([
            {
              href: "/admin/administration/proposals",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/administration/proposals/add",
              roles: [UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/administration/proposals/approval",
              roles: [UserRole.DPO, UserRole.BPH],
            },
            {
              href: "/admin/administration/accountability-reports",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/administration/accountability-reports/add",
              roles: [UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/administration/accountability-reports/approval",
              roles: [UserRole.DPO, UserRole.BPH],
            },
            {
              href: "/admin/administration/letters",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/administration/letters/add",
              roles: [UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/administration/letters/approval",
              roles: [UserRole.DPO, UserRole.BPH],
            },
            {
              href: "/admin/administration/documents",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/administration/documents/add",
              roles: [UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/administration/documents/types",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
          ]) && (
            <>
              <div className="mt-6 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                  Administration
                </h3>
              </div>

              {hasDropdownAccess([
                {
                  href: "/admin/administration/proposals",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/administration/proposals/add",
                  roles: [UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/administration/proposals/approval",
                  roles: [UserRole.DPO, UserRole.BPH],
                },
              ]) && (
                <NavDropdown icon={BookText} title="Proposals">
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/administration/proposals">
                      All Proposals
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.BPH, UserRole.PENGURUS]) && (
                    <NavDropdownItem href="/admin/administration/proposals/add">
                      Add New
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.DPO, UserRole.BPH]) && (
                    <NavDropdownItem href="/admin/administration/proposals/approval">
                      Approval
                    </NavDropdownItem>
                  )}
                </NavDropdown>
              )}

              {hasDropdownAccess([
                {
                  href: "/admin/administration/accountability-reports",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/administration/accountability-reports/add",
                  roles: [UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/administration/accountability-reports/approval",
                  roles: [UserRole.DPO, UserRole.BPH],
                },
              ]) && (
                <NavDropdown icon={BookCheck} title="Accountability Reports">
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/administration/accountability-reports">
                      All Accountability Reports
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.BPH, UserRole.PENGURUS]) && (
                    <NavDropdownItem href="/admin/administration/accountability-reports/add">
                      Add New
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.DPO, UserRole.BPH]) && (
                    <NavDropdownItem href="/admin/administration/accountability-reports/approval">
                      Approval
                    </NavDropdownItem>
                  )}
                </NavDropdown>
              )}

              {hasDropdownAccess([
                {
                  href: "/admin/administration/letters",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/administration/letters/add",
                  roles: [UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/administration/letters/approval",
                  roles: [UserRole.DPO, UserRole.BPH],
                },
              ]) && (
                <NavDropdown icon={FileText} title="Letter">
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/administration/letters">
                      All Letter
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.BPH, UserRole.PENGURUS]) && (
                    <NavDropdownItem href="/admin/administration/letters/add">
                      Add New
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.DPO, UserRole.BPH]) && (
                    <NavDropdownItem href="/admin/administration/letters/approval">
                      Approval
                    </NavDropdownItem>
                  )}
                </NavDropdown>
              )}

              {hasDropdownAccess([
                {
                  href: "/admin/administration/documents",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/administration/documents/add",
                  roles: [UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/administration/documents/types",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
              ]) && (
                <NavDropdown icon={SquareLibrary} title="Documents">
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/administration/documents">
                      All Documents
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.BPH, UserRole.PENGURUS]) && (
                    <NavDropdownItem href="/admin/administration/documents/add">
                      Add New
                    </NavDropdownItem>
                  )}
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/administration/documents/types">
                      Document Type
                    </NavDropdownItem>
                  )}
                </NavDropdown>
              )}
            </>
          )}

          {/* Content & Media Section */}
          {hasDropdownAccess([
            {
              href: "/admin/content/articles",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
            { href: "/admin/content/articles/add", roles: [UserRole.PENGURUS] },
            {
              href: "/admin/content/articles/categories",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/content/galleries",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/content/galleries/add",
              roles: [UserRole.PENGURUS],
            },
            {
              href: "/admin/content/galleries/categories",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
          ]) && (
            <>
              <div className="mt-6 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                  Content & Media
                </h3>
              </div>

              {hasDropdownAccess([
                {
                  href: "/admin/content/articles",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/content/articles/add",
                  roles: [UserRole.PENGURUS],
                },
                {
                  href: "/admin/content/articles/categories",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
              ]) && (
                <NavDropdown icon={Newspaper} title="Articles">
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/content/articles">
                      All Article
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.PENGURUS]) && (
                    <NavDropdownItem href="/admin/content/articles/add">
                      Add New
                    </NavDropdownItem>
                  )}
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/content/articles/categories">
                      Categories
                    </NavDropdownItem>
                  )}
                </NavDropdown>
              )}

              {hasDropdownAccess([
                {
                  href: "/admin/content/galleries",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
                {
                  href: "/admin/content/galleries/add",
                  roles: [UserRole.PENGURUS],
                },
                {
                  href: "/admin/content/galleries/categories",
                  roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
                },
              ]) && (
                <NavDropdown icon={Images} title="Galleries">
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/content/galleries">
                      All Gallery
                    </NavDropdownItem>
                  )}
                  {hasAccess([UserRole.PENGURUS]) && (
                    <NavDropdownItem href="/admin/content/galleries/add">
                      Add New
                    </NavDropdownItem>
                  )}
                  {hasAccess([
                    UserRole.DPO,
                    UserRole.BPH,
                    UserRole.PENGURUS,
                  ]) && (
                    <NavDropdownItem href="/admin/content/galleries/categories">
                      Categories
                    </NavDropdownItem>
                  )}
                </NavDropdown>
              )}
            </>
          )}

          {/* Finance Section */}
          {hasDropdownAccess([
            {
              href: "/admin/finance/transactions",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/finance/transactions/add",
              roles: [UserRole.BPH, UserRole.PENGURUS],
            },
            {
              href: "/admin/finance/transactions/approval",
              roles: [UserRole.DPO, UserRole.BPH],
            },
            {
              href: "/admin/finance/transactions/reports",
              roles: [UserRole.DPO, UserRole.BPH],
            },
            {
              href: "/admin/finance/transactions/categories",
              roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
            },
          ]) && (
            <>
              <div className="mt-6 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                  Finance
                </h3>
              </div>

              <NavDropdown icon={Landmark} title="Transactions">
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
                  <NavDropdownItem href="/admin/finance/transactions">
                    All Transaction
                  </NavDropdownItem>
                )}
                {hasAccess([UserRole.BPH, UserRole.PENGURUS]) && (
                  <NavDropdownItem href="/admin/finance/transactions/add">
                    Add New
                  </NavDropdownItem>
                )}
                {hasAccess([UserRole.DPO, UserRole.BPH]) && (
                  <NavDropdownItem href="/admin/finance/transactions/approval">
                    Approval
                  </NavDropdownItem>
                )}
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
                  <NavDropdownItem href="/admin/finance/transactions/categories">
                    Categories
                  </NavDropdownItem>
                )}
                {hasAccess([UserRole.DPO, UserRole.BPH]) && (
                  <NavDropdownItem href="/admin/finance/transactions/reports">
                    Reports
                  </NavDropdownItem>
                )}
              </NavDropdown>
            </>
          )}

          {/* System Section */}
          {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
            <>
              <div className="mt-6 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                  System
                </h3>
              </div>

              <NavLink href="/admin/system/activity" icon={Activity}>
                Activity Log
              </NavLink>
            </>
          )}

          {/* Settings Section */}
          {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
            <>
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
            </>
          )}
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
