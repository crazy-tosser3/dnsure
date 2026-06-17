import { AnimatePresence, motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

const CheckBox = ({ isOn=false, onClickFunc }:{isOn:boolean, onClickFunc(value:boolean):void}) => {
  const handleSwitch = () => {
    onClickFunc(!isOn);
  };

  return (
    <button className="relative bg-white-300 justify-center h-8 max-w-8 rounded-full border-white-200 aspect-square overflow-clip" onClick={handleSwitch}>
      <AnimatePresence>
        {isOn && (
          <>
            <motion.div 
            className="absolute rounded-full bg-accent w-8 aspect-square" 
            animate={{scale: [0,1]}} 
            transition={{duration: 0.4}} 
            exit={{opacity: 0}} 
            key={"checkboxBg-"+isOn} 
            />
            <motion.div 
            className="absolute rounded-full border-2 border-accent bg-white-400 w-8 aspect-square flex items-center justify-center" 
            style={{willChange: "transform"}} 
            animate={{scale: [0,1]}} 
            transition={{duration: 0.4, delay: 0.2}} 
            exit={{scale: 0}} 
            key={"checkbox-"+isOn}>
              <FaCheck />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </button>
  )
}

export default CheckBox