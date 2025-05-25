import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export const handleLogout = (auth?: boolean) => {
  if (typeof window === "undefined") return;

  document.cookie = `authToken=; Path=/; Max-Age=0`;

  if (auth) {
    toast.info("Token de autenticação não encontrado!");
  } else {
    toast.info("Logout realizado com sucesso!");
  }
  setTimeout(() => {
    redirect("/sign-in");
  }, 2000);
};
