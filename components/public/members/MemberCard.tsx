import React from "react";
import type { User } from "@/types/user";

interface MemberCardProps {
  user: User;
}

const MemberCard: React.FC<MemberCardProps> = ({ user }) => (
  <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center">
    {/* Placeholder for avatar */}
    <div
      className="w-24 h-24 rounded-full flex items-center justify-center text-xl font-bold text-white mb-4"
      style={{ backgroundColor: user.avatarColor || "#9CA3AF" }} // fallback to gray-400
    >
      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
    </div>
    <h3 className="text-lg font-semibold text-gray-800">
      {user.name || "Unnamed User"}
    </h3>
  </div>
);

export default MemberCard;
