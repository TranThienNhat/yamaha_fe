import MainLayout from "@/components/MainLayout";

export default function NewsDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
