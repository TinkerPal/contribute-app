export default function DashboardDesktopHeader({ children }) {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 ml-[283px] hidden h-[76px] border-b border-[#EAECF0] bg-white/90 px-6 backdrop-blur md:flex">
      <div className="flex w-full items-center justify-between gap-4">
        {children}
      </div>
    </header>
  );
}
