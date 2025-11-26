import { FiMail } from "react-icons/fi";
import type { User } from "@/types/user";

interface UserInfoProps {
  user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="ml-4">
      <div className="text-sm font-medium text-gray-900">{user.name}</div>
      <div className="text-sm text-gray-500 flex items-center">
        <FiMail className="mr-1 text-gray-400" size={14} />
        {user.email}
      </div>
      <div className="text-xs text-gray-400">@{user.username}</div>
    </div>
  );
}
