import "./globals.css";
import { Figtree } from "next/font/google";

const inter = Figtree({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="mx-auto">{children}</div>
      </body>
    </html>
  );
}
