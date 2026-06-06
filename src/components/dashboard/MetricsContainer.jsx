function MetricsContainer({ children }) {
  return (
    <div className="scrollbar-hidden flex gap-4 overflow-x-auto pb-1">
      {children}
    </div>
  );
}

export default MetricsContainer;
