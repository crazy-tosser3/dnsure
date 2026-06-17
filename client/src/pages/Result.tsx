import TestForm from "@/widgets/TestForm"
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FaCopy, FaX } from "react-icons/fa6";
import { useLocation } from "react-router-dom"

const Result = () => {
  const [copyResult, setCopyResult] = useState("");

  const query = new URLSearchParams(useLocation().search);

  const id = query.get("id");

  useEffect(() => {
    function resetCopyResult(){
      setCopyResult("");
    }

    const timeout = setTimeout(resetCopyResult, 2000);

    return () => {
      clearTimeout(timeout)
    }
  }, [copyResult])

  return (
    <main className="flex gap-8 flex-col lg:flex-row py-8 px-4">
      <div className="flex flex-col gap-4 items-center w-full max-w-150">
        <span className="flex gap-2 items-center">
          <h1>Код проверки: {id ?? "отсутствует ID"}</h1>
          {copyResult && (copyResult === "success" ? <span className="p-1">
              <FaCheck />
            </span> 
            :
            <span className="p-1">
              <FaX />
            </span>
          )}
          {!copyResult && id && <button className="p-1 rounded-md text-accent" onClick={() => id && navigator.clipboard.writeText(id).then(() => setCopyResult("success")).catch(() => setCopyResult("error"))}>
            <FaCopy />
          </button>}
        </span>
        <TestForm />
      </div>
      
    </main>
  )
}

export default Result