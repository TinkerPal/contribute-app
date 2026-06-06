export default function DashboardSidebarContainer({ children }) {
  return (
    <div className="fixed top-0 bottom-0 left-0 hidden w-[283px] flex-col gap-3 bg-white md:flex">
      {children}
    </div>
  );
}
