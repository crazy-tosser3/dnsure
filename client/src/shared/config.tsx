import { FaInfoCircle } from "react-icons/fa"
import { FaEarthEurope } from "react-icons/fa6"

export const toFetchData = [
  "http",
  "https",
  "ping",
  "tcp",
  "traceroute",
]

export const navData = [
  {ico: <FaEarthEurope size={20} />, title: "проверить", url: "/home"},
  {ico: <FaInfoCircle size={20} />, title: "о нас", url: "/about"},
]