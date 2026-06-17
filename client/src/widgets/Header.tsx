import { FaBars } from "react-icons/fa"
import { FaX } from "react-icons/fa6"
import useGlobalStore from "@/stores/globalStore"
import { useNavigate } from "react-router-dom";
import ThemeBtn from "@/components/ThemeBtn";
import { cn } from "@/shared/utils";

const Header = () => {
  const setSidebarIsOpen = useGlobalStore(state => state.setSidebarIsOpen);
  const isOpen = useGlobalStore(state => state.sidebarOpen);
  const theme = useGlobalStore(state => state.theme);

  const navigate = useNavigate();

  return (
    <header className={cn("sticky top-0 flex gap-4 shadow-neu-bottom p-4 z-2000", theme === "dark" ? "bg-white-200" : "bg-white-400")}>
      <button 
      onClick={() => setSidebarIsOpen(!isOpen)} 
      className="p-1 rounded-md" 
      aria-label="Открыть боковое меню"
      >
        {isOpen ? <FaX size={24} /> : <FaBars size={24} />}
      </button>
      <button className="py-1 px-2 rounded-md gap-2 text-accent" onClick={() => navigate("/home")}>
        <h1 className="text-3xl"><span className="font-black">DNS</span>ure</h1>
      </button>
      <div className="flex gap-4 ml-auto">
        <ThemeBtn />
      </div>
    </header>
  )
}

export default Header