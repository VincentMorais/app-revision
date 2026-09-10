import { BottomNav } from "@/components/nav/BottomNav";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto max-w-md px-4 pb-24 pt-4">{children}</div>
      <BottomNav />
    </>
  );
}
