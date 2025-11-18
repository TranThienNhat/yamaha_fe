import MainLayout from "@/components/MainLayout";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
