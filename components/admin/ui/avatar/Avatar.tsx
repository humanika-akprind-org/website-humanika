import type { User } from "@/types/user";

interface AvatarProps {
  user: User;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Avatar({ user, size = "md" }: AvatarProps) {
  const sizeClasses = {
    sm: {
      avatar: "w-10 h-10",
      text: "text-xs",
    },
    md: {
      avatar: "w-12 h-12",
      text: "text-sm",
    },
    lg: {
      avatar: "w-14 h-14",
      text: "text-base",
    },
    xl: {
      avatar: "w-16 h-16",
      text: "text-lg",
    },
    xxl: {
      avatar: "w-18 h-18",
      text: "text-xl",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex items-center">
      <div
        className={`flex-shrink-0 rounded-full overflow-hidden ${currentSize.avatar}`}
        style={{ backgroundColor: user.avatarColor }}
      >
        <span
          className={`${currentSize.avatar} flex items-center justify-center text-white font-semibold ${currentSize.text}`}
        >
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </span>
      </div>
    </div>
  );
}
