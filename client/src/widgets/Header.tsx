import { FaPlugCircleCheck } from "react-icons/fa6"

const Header = () => {
  return (
    <header className="sticky top-0 shadow-neu-bottom p-3">
      <button className="py-1 px-2 rounded-xl gap-2">
        <FaPlugCircleCheck size={28} />
        <h1 className="text-xl"><span className="font-black">DNS</span>ure</h1>
      </button>
    </header>
  )
}

export default Header