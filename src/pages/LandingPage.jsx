export default function LandingPage() {
  return (
    <div className="flex flex-col items-center h-screen bg-gray-100">
      <div className="flex justify-between items-center py-4 px-8 w-full">
          <div className="flex gap-16 text-xl font-bold">
            <a href="#" className="">Home</a>
            <a href="#" className="">About</a>
          </div>
          <a href="/login" className="flex rounded-full px-8 py-2 justify-center items-center bg-blue-400 text-lg font-medium text-gray-100">
            Login
          </a>
      </div>
      <div className="flex flex-col w-full h-full p-4">
        <div className="bg-blue-300 rounded-2xl h-full py-2 px-4  ">
          hello
        </div>
      </div>
    </div>
  );
}