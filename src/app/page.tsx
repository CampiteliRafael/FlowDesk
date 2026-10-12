import type { Metadata } from "next";
import LoginScreen from "@/features/auth/components/login-screen";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse a demonstração do FlowDesk.",
};

export default function HomePage() {
  return <LoginScreen />;
}
