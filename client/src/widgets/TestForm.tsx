import CheckBox from "@/components/CheckBox";
import { getAgents } from "@/shared/api";
import { toFetchData } from "@/shared/config";
import { cn, isValidDomain } from "@/shared/utils";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react"
import { FaChevronDown, FaChevronUp, FaCircleNotch, FaRocket } from "react-icons/fa"
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
  const [domain, setDomain] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState("");

  const [toFetch, setToFetch] = useState({
    get: true,
    ping: true,
    tcp: false,
    traceroute: false,
    lookup: false,
  });

  function validateAdress(domain:string){
    const result = isValidDomain(domain);

    if (result) {
      setIsValid(true);
    }
    else{
      setIsValid(false);
    }
  }

  function onSubmit(){
    if (!isValidDomain(domain)) {
      return;
    }
    const query = new URLSearchParams({ host: domain, checkType: JSON.stringify(toFetch), serverLocation: selectedAgent })

    navigate("/result"+query)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (domain) validateAdress(domain);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [domain]);

  const { data:agents, isLoading, isError } = useQuery({
    queryKey: ['agents'],
    queryFn: getAgents,
    staleTime: 15 * 60 * 1000
  });

  return (
    <motion.div layoutId="testForm" className="w-full max-w-150 flex flex-col gap-16 items-center">
      {!isSettingsOpen && !isError && (isLoading ? <div className="w-full bg-white-400 flex items-center justify-center p-4 rounded-4xl shadow-neu-soft"><FaCircleNotch className="animate-spin" /></div> : <form action={onSubmit} className="w-full grid grid-cols-2 gap-3 bg-white-400 p-4 rounded-4xl shadow-neu-soft">
        <label htmlFor="adress" className="px-6 col-span-2">Введите IP или домен:</label>
        <input 
        type="text" 
        id="adress" 
        placeholder="www.google.com" 
        className={cn("col-span-2 py-3 px-6 rounded-full bg-white-300", domain && !isValid ? "text-red-400" : "")}
        value={domain}
        onChange={(e) => setDomain(e.target.value.trim())}
        onBlur={() => validateAdress(domain)}
        inputMode="url"
        required />
        <div className="relative rounded-full bg-white-300 flex items-center">
          <select 
          className="w-full py-3 px-6 rounded-full"
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          >
            {agents.length && agents.map((agent:string, index:number) => <option key={index}>{agent}</option>)}
          </select>
          <FaChevronDown className="absolute right-4 pointer-events-none" />
        </div>
        <motion.button whileTap={{scale: 0.95}} type="submit" className="primary py-3 px-6 rounded-full justify-between">
          <FaRocket />
          <span>проверить</span>
        </motion.button>
      </form>)}
      {!isSettingsOpen && isError && <div className="w-full bg-red-400 flex items-center justify-center p-4 rounded-4xl shadow-neu-soft">Что-то пошло не так. Попробуйте позже</div>}
      <motion.button whileHover={{scale: 1.1}} className="gap-4 p-1 rounded-md" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
        <span>продвинутые настройки</span>
        {isSettingsOpen ? <FaChevronUp /> : <FaChevronDown />}
      </motion.button>
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
          <motion.button whileTap={{scale: 0.95}} className="border border-accent rounded-full justify-center" onClick={() => setToFetch({
            get: true,
            ping: true,
            tcp: true,
            traceroute: true,
            lookup: true,
          })}>
            выбрать все
          </motion.button>
        </motion.div>}
      </AnimatePresence>
    </motion.div>
  )
}

export default TestForm