import { useNavigate } from "react-router";
import { Button } from "./ui/button";

function ExploreButtons({ tag }) {
  const navigate = useNavigate();

  return (
    <div
      className={`${tag === "footer" ? "flex flex-col justify-center gap-4 sm:flex-row sm:justify-start" : "flex flex-col items-center justify-center gap-4 sm:flex-row"}`}
    >
      <Button
        onClick={() => {
          navigate("/communities");
        }}
        variant="secondary"
        size="lg"
      >
        Explore Communities
      </Button>
      <Button
        onClick={() => {
          navigate("/tasks");
        }}
        variant="outline"
        size="lg"
        className={tag === "footer" && "bg-white"}
      >
        View Tasks
      </Button>
    </div>
  );
}

export default ExploreButtons;
