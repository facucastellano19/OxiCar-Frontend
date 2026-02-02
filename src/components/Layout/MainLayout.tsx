import { Outlet } from "react-router-dom";
import { Sidebar } from "./SideBar/SideBar";

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-jet-black overflow-hidden font-sans text-lavender">
      <Sidebar />

      <main className="flex-1 h-screen overflow-y-auto p-8 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-icy-blue/5 blur-[150px] rounded-full -z-10 pointer-events-none"></div>
    
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};