import { checkAdress } from "@/shared/api";
import TestForm from "@/widgets/TestForm"
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
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
    queryKey: ['checkResult'],
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
    staleTime: 15 * 60 * 1000
  });

  return (
    <main className="flex gap-8 flex-col lg:flex-row py-8 px-4">
      <div className="flex flex-col gap-4 items-center w-full max-w-150">
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
          {!copyResult && hostname && <button className="p-1 rounded-md text-accent" onClick={() => hostname && navigator.clipboard.writeText(hostname).then(() => setCopyResult("success")).catch(() => setCopyResult("error"))}>
            <FaCopy />
          </button>}
        </span>
        <TestForm />
      </div>
      
    </main>
  )
}

export default Result