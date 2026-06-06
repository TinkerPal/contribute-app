import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function CustomPagination({ currentPage, totalPages, onPageChange }) {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);

  const getPages = () => {
    const pages = [];
    const delta = 1;

    if (safeTotalPages <= 1) return [1];

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(safeTotalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) pages.push("left-ellipsis");

    for (let i = left; i <= right; i += 1) {
      pages.push(i);
    }

    if (right < safeTotalPages - 1) pages.push("right-ellipsis");

    pages.push(safeTotalPages);

    return pages;
  };

  if (safeTotalPages <= 1) return null;

  return (
    <Pagination className="justify-end pt-2">
      <PaginationContent className="flex-wrap gap-2">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={currentPage === 1}
            className={[
              "rounded-lg border border-[#EAECF5] bg-white text-[#667085] shadow-sm",
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "hover:bg-[#F9FAFB]",
            ].join(" ")}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>

        {getPages().map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === "left-ellipsis" || page === "right-ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                className={[
                  "rounded-lg border shadow-sm",
                  page === currentPage
                    ? "border-[#2F0FD1] bg-[#2F0FD1] text-white hover:bg-[#2F0FD1] hover:text-white"
                    : "border-[#EAECF5] bg-white text-[#667085] hover:bg-[#F9FAFB]",
                ].join(" ")}
                onClick={(e) => {
                  e.preventDefault();
                  if (page !== currentPage) onPageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={currentPage === safeTotalPages}
            className={[
              "rounded-lg border border-[#EAECF5] bg-white text-[#667085] shadow-sm",
              currentPage === safeTotalPages
                ? "pointer-events-none opacity-50"
                : "hover:bg-[#F9FAFB]",
            ].join(" ")}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < safeTotalPages) onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default CustomPagination;
