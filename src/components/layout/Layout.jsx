import Sidebar from "./Sidebar";
import Header from "./Header";

export function Copyright() {
  return (
    <span className="pt-4 text-gray-500 font-light text-sm">&copy; All rights reserved <a href="https://github.com/Ry-leigh" target="_blank" className="text-violet-400">Mythrynne</a></span>
  )
}

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-white mr-4">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
          <main className="flex h-full p-6 overflow-y-auto bg-indigo-50 rounded-2xl scrollbar-none">
            {children}
          </main>
      </div>
    </div>
  );
}
