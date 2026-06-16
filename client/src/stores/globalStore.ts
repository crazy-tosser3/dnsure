import { create } from "zustand";

interface globalStore{
  sidebarOpen:boolean;
  theme:string;

  setSidebarIsOpen(bool:boolean):void;
  setTheme(theme:string):void;
}

const useGlobalStore = create<globalStore>((set) => ({
  sidebarOpen: false,
  theme: "light",

  setSidebarIsOpen: (bool) => {
    set((state:globalStore) => ({...state, sidebarOpen: bool}));
  },

  setTheme: (theme) => {
    set((state:globalStore) => ({...state, theme}));
  }
}))

export default useGlobalStore;