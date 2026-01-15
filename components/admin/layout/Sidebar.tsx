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
  Wallet,
} from "lucide-react";
import { LogoutButton } from "@/components/admin/auth/LogoutButton";
import Image from "next/image";
import NavLink from "@/components/admin/layout/NavLink";
import NavDropdown from "@/components/admin/layout/NavDropdown";
import NavDropdownItem from "@/components/admin/layout/NavDropdownItem";
import { UserRole } from "@/types/enums";

export default function Sidebar() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const user = await response.json();
          setUserRole(user.role);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Access control function
  const hasAccess = (allowedRoles: UserRole[]) =>
    userRole && allowedRoles.includes(userRole as UserRole);

  // Check if dropdown has any accessible items
  const hasDropdownAccess = (items: { href: string; roles: UserRole[] }[]) =>
    items.some((item) => hasAccess(item.roles));

  if (loading) {
    return (
      <div className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-gray-200 bg-white h-full overflow-hidden">
        {/* Header dengan Logo */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full shadow-sm p-1 border border-gray-100">
              <Image
                src="/logo.png"
                alt="HUMANIKA"
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

        {/* Navigation Menu Skeleton */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Dashboard Section Skeleton */}
          <div className="mt-2 mb-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 rounded-lg">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-28" />
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            </div>
          </div>

          {/* Governance Section Skeleton */}
          <div className="mt-6 mb-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="ml-6 space-y-1">
              <div className="flex items-center space-x-3 p-2 rounded-lg">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
              </div>
            </div>
          </div>

          {/* People & Access Section Skeleton */}
          <div className="mt-6 mb-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Content & Media Section Skeleton */}
          <div className="mt-6 mb-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Programs & Events Section Skeleton */}
          <div className="mt-6 mb-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-36" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Administration Section Skeleton */}
          <div className="mt-6 mb-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-28" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Organization Management Section Skeleton */}
          <div className="mt-6 mb-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-40" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Finance Section Skeleton */}
          <div className="mt-6 mb-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* System Section Skeleton */}
          <div className="mt-6 mb-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-14" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 rounded-lg">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            </div>
          </div>

          {/* Settings Section Skeleton */}
          <div className="mt-6 mb-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 rounded-lg">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-14" />
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
            </div>
          </div>
        </nav>

        {/* Footer dengan Logout Skeleton */}
        <div className="mt-auto p-4 border-t border-gray-200 space-y-4 bg-gray-50">
          <div className="flex items-center space-x-3 p-3 rounded-lg">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-gray-200 bg-white h-full overflow-hidden">
      {/* Header dengan Logo */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-full shadow-sm p-1 border border-gray-100">
            <Image
              src="/logo.png"
              alt="HUMANIKA"
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
            href: "/admin/governance/structure",
            roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
          },
          { href: "/admin/governance/structure/add", roles: [UserRole.BPH] },
          {
            href: "/admin/governance/managements",
            roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
          },
          {
            href: "/admin/governance/managements/add",
            roles: [UserRole.BPH, UserRole.PENGURUS],
          },
          {
            href: "/admin/governance/tasks",
            roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
          },
          {
            href: "/admin/governance/tasks/add",
            roles: [UserRole.BPH, UserRole.PENGURUS],
          },
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
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
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
                href: "/admin/governance/structure",
                roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
              },
              {
                href: "/admin/governance/structure/add",
                roles: [UserRole.BPH],
              },
            ]) && (
              <NavDropdown icon={Network} title="Organizational Structure">
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
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
                href: "/admin/governance/managements",
                roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
              },
              {
                href: "/admin/governance/managements/add",
                roles: [UserRole.BPH, UserRole.PENGURUS],
              },
            ]) && (
              <NavDropdown icon={UserCog} title="Profile Managements">
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
                  <NavDropdownItem href="/admin/governance/managements">
                    All Profile Management
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
                href: "/admin/governance/tasks",
                roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
              },
              {
                href: "/admin/governance/tasks/add",
                roles: [UserRole.BPH, UserRole.PENGURUS],
              },
            ]) && (
              <NavDropdown icon={ClipboardList} title="Department Tasks">
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
                  <NavDropdownItem href="/admin/governance/tasks">
                    All Tasks
                  </NavDropdownItem>
                )}
                {hasAccess([UserRole.BPH, UserRole.PENGURUS]) && (
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

        {/* Content & Media Section */}
        {hasDropdownAccess([
          {
            href: "/admin/content/articles",
            roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
          },
          {
            href: "/admin/content/articles/add",
            roles: [UserRole.BPH, UserRole.PENGURUS],
          },
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
            roles: [UserRole.BPH, UserRole.PENGURUS],
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
                roles: [UserRole.BPH, UserRole.PENGURUS],
              },
              {
                href: "/admin/content/articles/categories",
                roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
              },
            ]) && (
              <NavDropdown icon={Newspaper} title="Articles">
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
                  <NavDropdownItem href="/admin/content/articles">
                    All Article
                  </NavDropdownItem>
                )}
                {hasAccess([UserRole.BPH, UserRole.PENGURUS]) && (
                  <NavDropdownItem href="/admin/content/articles/add">
                    Add New
                  </NavDropdownItem>
                )}
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
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
                roles: [UserRole.BPH, UserRole.PENGURUS],
              },
              {
                href: "/admin/content/galleries/categories",
                roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
              },
            ]) && (
              <NavDropdown icon={Images} title="Galleries">
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
                  <NavDropdownItem href="/admin/content/galleries">
                    All Gallery
                  </NavDropdownItem>
                )}
                {hasAccess([UserRole.BPH, UserRole.PENGURUS]) && (
                  <NavDropdownItem href="/admin/content/galleries/add">
                    Add New
                  </NavDropdownItem>
                )}
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
                  <NavDropdownItem href="/admin/content/galleries/categories">
                    Categories
                  </NavDropdownItem>
                )}
              </NavDropdown>
            )}
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
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
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
                roles: [UserRole.BPH, UserRole.PENGURUS],
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
                {hasAccess([UserRole.BPH, UserRole.PENGURUS]) && (
                  <NavDropdownItem href="/admin/program/events/add">
                    Add New
                  </NavDropdownItem>
                )}
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
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
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
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
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
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
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
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
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
                  <NavDropdownItem href="/admin/administration/documents">
                    All Documents
                  </NavDropdownItem>
                )}
                {hasAccess([UserRole.BPH, UserRole.PENGURUS]) && (
                  <NavDropdownItem href="/admin/administration/documents/add">
                    Add New
                  </NavDropdownItem>
                )}
                {hasAccess([UserRole.DPO, UserRole.BPH, UserRole.PENGURUS]) && (
                  <NavDropdownItem href="/admin/administration/documents/types">
                    Document Type
                  </NavDropdownItem>
                )}
              </NavDropdown>
            )}
          </>
        )}

        {/* Organization Management Section - BPH Only */}
        {hasDropdownAccess([
          {
            href: "/admin/content/organization-contacts",
            roles: [UserRole.BPH],
          },
          {
            href: "/admin/content/organization-contacts/add",
            roles: [UserRole.BPH],
          },
          {
            href: "/admin/content/statistics",
            roles: [UserRole.BPH],
          },
          {
            href: "/admin/content/statistics/add",
            roles: [UserRole.BPH],
          },
        ]) && (
          <>
            <div className="mt-6 mb-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                Organization Management
              </h3>
            </div>

            <NavDropdown icon={Landmark} title="Organization">
              {hasAccess([UserRole.BPH]) && (
                <NavDropdownItem href="/admin/content/organization-contacts">
                  Organization Contacts
                </NavDropdownItem>
              )}
              {hasAccess([UserRole.BPH]) && (
                <NavDropdownItem href="/admin/content/statistics">
                  Statistics
                </NavDropdownItem>
              )}
            </NavDropdown>
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

            <NavDropdown icon={Wallet} title="Transactions">
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

      {/* Footer dengan Info Pengguna dan Logout */}
      <div className="mt-auto p-4 border-t border-gray-200 space-y-4 bg-gray-50">
        <div className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer border border-transparent hover:border-red-100">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
