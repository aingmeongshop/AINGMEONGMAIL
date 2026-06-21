import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function RootLayout({ children }) {
  const cookieHeader = cookies().toString();
  if (!isAuthenticated({ headers: { cookie: cookieHeader } })) {
    redirect("/admin/login");
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
