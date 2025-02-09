import Link from "next/link";

const Home = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center mx-auto">
      <h1 className="text-xl font-bold">Taskify</h1>
      <div className="space-x-4">
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link href="/register" className="hover:underline">
          Register
        </Link>
        <Link href="/login" className="hover:underline">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Home;
