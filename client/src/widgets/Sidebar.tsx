import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/shared/utils";
import useGlobalStore from "@/stores/globalStore";
import { navData } from "@/shared/config";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isOpen = useGlobalStore(state => state.sidebarOpen);

  return ( 
    <motion.aside initial={{width: 0}} animate={{width: isOpen ? 260 : 0}} className={cn("bg-white-400 max-w-64 fixed top-12 left-12 rounded-xl z-2001", isOpen ? "" : "pointer-events-none")}>
      <AnimatePresence>
        {isOpen && <motion.nav exit={{opacity: 0}} className="p-4 flex flex-col h-full gap-2 overflow-hidden">
          {navData.map((item, index) => (
            <motion.button 
            initial={{x: 50, opacity: 0}} 
            animate={{x: 0, opacity: 1}} 
            transition={{delay: 0.1 * index}}
            className={"p-3 rounded-xl justify-between " + (location.pathname.startsWith(item.url) ? "_active" : "")}
            key={"sidebar-btn-"+index}
            onClick={() => navigate(item.url)}
            >
              {item.ico}
              <span className="text-nowrap">{item.title}</span>
            </motion.button>
          ))}
        </motion.nav>}
      </AnimatePresence>
    </motion.aside>
   );
}

export default Sidebar;