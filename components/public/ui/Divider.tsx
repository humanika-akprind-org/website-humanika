import { Sparkles } from "lucide-react";

export default function Divider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-grey-200 to-transparent h-px" />
      <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-grey-200 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-grey-400" />
      </div>
    </div>
  );
}
