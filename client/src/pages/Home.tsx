import CheckBox from "@/components/CheckBox";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react"
import { FaChevronDown, FaChevronUp, FaRocket } from "react-icons/fa"

const toFetchData = [
  "get",
  "ping",
  "tcp",
  "traceroute",
  "lookup",
]

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

const Home = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [toFetch, setToFetch] = useState({
    get: true,
    ping: true,
    tcp: false,
    traceroute: false,
    lookup: false,
  })

  return (
    <div className="flex flex-col gap-16 items-center py-8 px-4">
      <h1 className="text-2xl md:text-4xl lg:text-6xl">Проверим, работает ли</h1>
      <form action={() => {}} className="w-full max-w-150 m-auto grid grid-cols-2 gap-3 bg-white-400 p-4 rounded-4xl shadow-neu-soft">
        <input type="text" placeholder="www.google.com" className="col-span-2 py-3 px-6 rounded-full bg-white-300" />
        <div className="relative rounded-full bg-white-300 flex items-center">
          <select className="w-full py-3 px-6 rounded-full">
            <option>🇷🇺 Россия</option>
          </select>
          <FaChevronDown className="absolute right-4" />
        </div>
        <button type="submit" className="primary py-3 px-6 rounded-full justify-between">
          <FaRocket />
          <span>проверить</span>
        </button>
      </form>
      <button className="gap-4 p-1 rounded-md" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
        <span>продвинутые настройки</span>
        {isSettingsOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      <AnimatePresence mode="wait">
        {isSettingsOpen && <motion.div
        initial={{y: 50, opacity: 0}} 
        animate={{y: 0, opacity: 1}} 
        exit={{y: 50, opacity: 0}}
        className="w-full max-w-200 m-auto grid grid-cols-2 gap-3 bg-white-400 p-4 rounded-4xl shadow-neu-soft"
        >
          {toFetchData.map((item:string) => (
            <ToFetchBtn 
            title={item} 
            isOn={toFetch[item as keyof typeof toFetch]} 
            onCheck={(value:boolean) => setToFetch({...toFetch, [item]: value})} 
            key={item}
            />
          ))}
          <button className="primary rounded-full justify-center" onClick={() => setToFetch({
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
    </div>
  )
}

export default Home