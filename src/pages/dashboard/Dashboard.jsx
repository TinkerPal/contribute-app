import { useEffect } from "react";
import { useNavigate } from "react-router";

function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard/overview");
  }, [navigate]);
  return null;
}

export default Dashboard;
