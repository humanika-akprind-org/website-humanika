import { FiMail } from "react-icons/fi";
import type { User } from "@/types/user";
import Avatar from "./avatar/Avatar";

interface UserInfoHeaderProps {
  user: User;
}

export default function UserInfoHeader({
  user,
}: UserInfoHeaderProps): JSX.Element {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
      <div className="flex items-center">
        <Avatar user={user} size="xl" />
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <FiMail className="mr-1 text-gray-400" size={14} />
            {user.email}
          </div>
          <div className="text-xs text-gray-400">@{user.username}</div>
        </div>
      </div>
    </div>
  );
}
