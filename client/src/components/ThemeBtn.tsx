import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { FaMoon, FaSun } from "react-icons/fa";
import useGlobalStore from "@/stores/globalStore";

const ThemeBtn = () => {
  const [themeValue, setThemeValue] = useState(Cookies.get('theme') ?? "light");

  const setStoreTheme = useGlobalStore((state) => state.setTheme);

  const applyTheme = (current: string) => {
    document.documentElement.setAttribute('data-theme', current);
  };

  const setTheme = () => {
    const nextTheme = themeValue === "dark" ? "light" : "dark";
    setThemeValue(nextTheme);
    Cookies.set('theme', nextTheme, { expires: 365 });
    applyTheme(nextTheme)
    setStoreTheme(nextTheme);

    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  useEffect(() => {
    applyTheme(themeValue);
      const savedTheme = Cookies.get('theme');
      if (savedTheme) {
        applyTheme(savedTheme);
        setStoreTheme(savedTheme);
      };
  }, [setStoreTheme, themeValue]);

  return (
    <button onClick={setTheme} className="p-1 rounded-md">
      {themeValue === "dark" ? <FaMoon size={24} /> : <FaSun size={24} />}
    </button>
  )
}

export default ThemeBtn