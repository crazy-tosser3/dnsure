import { checkAdress } from "@/shared/api";
import TestForm from "@/widgets/TestForm"
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCheck, FaCircleNotch } from "react-icons/fa";
import { FaCopy, FaX } from "react-icons/fa6";
import { useLocation } from "react-router-dom"

const Result = () => {
  const [copyResult, setCopyResult] = useState("");

  const query = new URLSearchParams(useLocation().search);

  const hostname = query.get("host");

  useEffect(() => {
    function resetCopyResult(){
      setCopyResult("");
    }

    const timeout = setTimeout(resetCopyResult, 2000);

    return () => {
      clearTimeout(timeout)
    }
  }, [copyResult])

  const { data:result, isLoading, isError } = useQuery({
    queryKey: ['checkResult', query.toString()],
    queryFn: () => {
      const host = query.get("host");
      const checkType = query.get("checkType");
      const serverLocation = query.get("serverLocation");

      if (!host || !checkType || !serverLocation){
        console.error("Недостаточно данных для проверки");
        return {message: "Недостаточно данных"};
      };

      return checkAdress(host, JSON.parse(checkType), serverLocation);
    },
    staleTime: 15 * 60 * 1000,
  });

  return (
    <main className="flex gap-8 flex-col lg:flex-row py-8 px-4">
      <div className="flex m-auto lg:m-0 flex-col gap-4 items-center w-full max-w-150">
        <span className="flex gap-2 items-center">
          <h1>Проверяем: {hostname ?? "отсутствует IP или хост"}</h1>
          {copyResult && (copyResult === "success" ? <span className="p-1">
              <FaCheck />
            </span> 
            :
            <span className="p-1">
              <FaX />
            </span>
          )}
          {!copyResult && hostname && (
            <button 
            className="p-1 rounded-md text-accent" 
            onClick={() => hostname && navigator.clipboard.writeText(hostname).then(() => setCopyResult("success")).catch(() => setCopyResult("error"))}
            >
              <FaCopy />
            </button>
          )}
        </span>
        <TestForm />
      </div>
      {!isError && (isLoading ? 
      <div className="w-full max-w-150 h-fit mx-auto bg-white-400 flex items-center justify-center p-4 rounded-4xl shadow-neu-soft"><FaCircleNotch className="animate-spin" /></div> 
      : 
      <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="w-full max-w-150 mx-auto h-fit bg-white-400 flex flex-col gap-8 p-4 rounded-4xl shadow-neu-soft">
          <h1 className="text-2xl">Отчет о проверке</h1>
          {result.status === "success" ? <div className="flex gap-4"><div className="py-2 px-1 rounded-full bg-green-300" /><h1>Успешно</h1></div> : <div className="flex gap-4"><div className="py-2 px-1 rounded-full bg-red-300" /><h1>Есть проблемы</h1></div>}
          <ul className="p-2 rounded-2xl bg-white-300">
            {result.data.results.http && <li>Http: {result.data.results.http}</li>}
            {result.data.results.https && <li>Https: {result.data.results.https}</li>}
            {result.data.results.tcp && <li>Tcp: {result.data.results.tcp}</li>}
            {result.data.results.traceroute && <li>Traceroute: {result.data.results.traceroute}</li>}
            {result.data.results.ping && <li>Ping: {result.data.results.ping}</li>}
          </ul>
      </motion.div>
      )}
      {isError && <div className="w-full bg-red-400 flex items-center justify-center p-4 rounded-4xl shadow-neu-soft">Что-то пошло не так. Попробуйте позже</div>}
    </main>
  )
}

export default Result