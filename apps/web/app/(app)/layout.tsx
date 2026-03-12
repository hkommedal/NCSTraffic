import Sidebar from "@/app/components/Sidebar";
import TutorialGuide from "@/app/components/TutorialGuide";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <TutorialGuide />
      {children}
    </>
  );
}
