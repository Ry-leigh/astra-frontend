import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-white mr-4">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex h-full overflow-y-auto p-6 bg-indigo-50 rounded-2xl scrollbar-none">{children}</main>
      </div>
    </div>
  );
}
