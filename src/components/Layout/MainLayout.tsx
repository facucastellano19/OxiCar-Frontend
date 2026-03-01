import { Outlet } from "react-router-dom";
import { Sidebar } from "./SideBar/SideBar";
import { Header } from "./Header/Header";

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-jet-black font-sans text-lavender overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-icy-blue/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};