export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-indigo-600">Welcome to Astra</h1>
      <a href="/login" className="mt-4 text-blue-500 underline">
        Go to Login
      </a>
    </div>
  );
}