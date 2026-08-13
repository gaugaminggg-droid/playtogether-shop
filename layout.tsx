import "./globals.css";

export const metadata = {
  title: "PlayTogether Shop",
  description: "Shop dịch vụ Play Together - nhanh, uy tín, giá hợp lý"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}