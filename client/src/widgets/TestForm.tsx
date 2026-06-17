import CheckBox from "@/components/CheckBox";
import { toFetchData } from "@/shared/config";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react"
import { FaChevronDown, FaChevronUp, FaRocket } from "react-icons/fa"
import { useNavigate } from "react-router-dom";

const ToFetchBtn = ({title, isOn, onCheck}:{title:string, isOn:boolean, onCheck:(value:boolean)=>void}) => {
  return (
    <div>
      <div className="flex gap-4 items-center">
        <CheckBox isOn={isOn} onClickFunc={(val) => onCheck(val)} />
        <span>{title}</span>
      </div>
    </div>
  )
}

const TestForm = () => {
  const navigate = useNavigate();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [toFetch, setToFetch] = useState({
    get: true,
    ping: true,
    tcp: false,
    traceroute: false,
    lookup: false,
  });

  return (
    <motion.div layoutId="testForm" className="w-full max-w-150 flex flex-col gap-16 items-center">
      {!isSettingsOpen && <form action={() => {}} className="w-full grid grid-cols-2 gap-3 bg-white-400 p-4 rounded-4xl shadow-neu-soft">
        <label htmlFor="adress" className="px-6">Введите IP или домен:</label>
        <input type="text" id="adress" placeholder="www.google.com" className="col-span-2 py-3 px-6 rounded-full bg-white-300" />
        <div className="relative rounded-full bg-white-300 flex items-center">
          <select className="w-full py-3 px-6 rounded-full">
            <option>🇷🇺 Россия</option>
          </select>
          <FaChevronDown className="absolute right-4" />
        </div>
        <button type="submit" className="primary py-3 px-6 rounded-full justify-between" onClick={() => navigate("/result")}>
          <FaRocket />
          <span>проверить</span>
        </button>
      </form>}
      <button className="gap-4 p-1 rounded-md" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
        <span>продвинутые настройки</span>
        {isSettingsOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      <AnimatePresence mode="wait">
        {isSettingsOpen && <motion.div
        initial={{opacity: 0, scaleY: 0.5}} 
        animate={{opacity: 1, scaleY: 1}} 
        exit={{opacity: 0, scaleY: 0.5}}
        className="w-full m-auto grid grid-cols-2 gap-3 bg-white-400 p-4 rounded-4xl shadow-neu-soft"
        >
          {toFetchData.map((item:string) => (
            <ToFetchBtn 
            title={item} 
            isOn={toFetch[item as keyof typeof toFetch]} 
            onCheck={(value:boolean) => setToFetch({...toFetch, [item]: value})} 
            key={item}
            />
          ))}
          <button className="border border-accent rounded-full justify-center" onClick={() => setToFetch({
            get: true,
            ping: true,
            tcp: true,
            traceroute: true,
            lookup: true,
          })}>
            выбрать все
          </button>
        </motion.div>}
      </AnimatePresence>
    </motion.div>
  )
}

export default TestForm