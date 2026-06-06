import { IoIosArrowDropleftCircle } from "react-icons/io";
import { useNavigate } from "react-router";

function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex cursor-pointer items-center gap-2"
    >
      <IoIosArrowDropleftCircle className="text-[32px] text-[#525866]" />
      <span className="text-[18px] text-[#525866]">Back</span>
    </button>
  );
}

export default BackButton;
