// types/auth.d.ts
import { IconType } from "react-icons";

export interface AuthProvider {
  id: string;
  name: string;
  Icon: IconType;
  scopes?: string[];
}
