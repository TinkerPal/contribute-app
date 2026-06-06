export default function DashboardMobileHeader({ children }) {
  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex h-[70px] items-center justify-between border-b border-[#F7F9FD] bg-white px-5 py-3 md:hidden">
      {children}
    </div>
  );
}
