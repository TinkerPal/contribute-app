import { LuArrowUpDown } from "react-icons/lu";

const Sort = ({ onToggle, order = "DESC" }) => {
  const handleToggle = () => {
    const newOrder = order === "DESC" ? "ASC" : "DESC";
    onToggle?.(newOrder);
  };

  return (
    <button
      onClick={handleToggle}
      className="group flex cursor-pointer items-center gap-2 rounded-md bg-[#F7F9FD] px-4 py-2 text-sm font-medium text-[#2F0FD1] hover:bg-[#2F0FD1] hover:text-[#F7F9FD] shadow"
    >
      <LuArrowUpDown className="text-[#2F0FD1] group-hover:text-[#F7F9FD]" />
      {order === "DESC" ? "Oldest" : "Newest"}
    </button>
  );
};

export default Sort;
