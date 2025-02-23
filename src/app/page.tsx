"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const Home = () => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isImageOpen) {
      setIsAnimating(true);
    }
  }, [isImageOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsImageOpen(false), 300); // Match transition duration
  };

  return (
    <div className="bg-white pt-10 w-screen">
      <nav className="flex justify-between mx-auto mb-12 w-1/2 rounded-lg px-5 border border-[#D0D0D0]">
        <div className="relative w-[100px]">
          <Image src="/taskify-dark.svg" alt="Taskify" fill />
        </div>
        <div className="flex gap-2 w-auto h-auto py-2">
          <Link
            href="/login"
            className="bg-[#E52020] rounded-lg text-sm px-10 py-3 text-white hover:shadow-[0_0_15px_rgba(229,32,32,0.5)] hover:scale-105 border border-[#E52020] transition-all"
          >
            Login
          </Link>
        </div>
      </nav>

      <section className="flex flex-col mb-20">
        <h1 className="text-6xl text-black text-center">
          Manage your tasks easily with
        </h1>
        <h1 className="text-6xl text-red-600 text-center mb-4">Taskify</h1>
        <p className="text-2xl text-black text-center mb-4">
          a fast, open-source, easy-to-use dashboard for all your task
          management
        </p>
        <div className="flex justify-center items-center gap-4 mb-12">
          <Link
            href="/register"
            className="bg-[#020818] rounded-lg text-sm px-10 py-3 text-white hover:shadow-[0_0_15px_rgba(2,8,24,0.5)] hover:scale-105 border border-[#020818] transition-all"
          >
            Get Started
          </Link>
          <Link
            href="https://github.com/AvgBlank/Taskify"
            className="text-black hover:text-[#E52020] hover:scale-105 underline transition-all"
          >
            GitHub
          </Link>
        </div>
        <div className="bg-contain bg-no-repeat bg-[url('/waves.png')] flex justify-center bg-center">
          {/* Thumbnail Image */}
          <div
            className="relative w-1/2 aspect-video cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            onClick={() => setIsImageOpen(true)}
          >
            <Image
              src="/dashboard.jpeg"
              alt="Dashboard"
              fill
              className="rounded-xl"
            />
          </div>

          {/* Modal */}
          {isImageOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              onClick={handleClose}
            >
              {/* Backdrop with animation */}
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-all duration-300 ease-in-out"
                style={{
                  opacity: isAnimating ? 1 : 0,
                }}
              />

              {/* Image Container with animation */}
              <div
                className="relative w-[80vw] h-[80vh] z-10 transition-all duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
                style={{
                  transform: isAnimating ? "scale(1)" : "scale(0.8)",
                  opacity: isAnimating ? 1 : 0,
                }}
              >
                <Image
                  src="/dashboard.jpeg"
                  alt="Dashboard"
                  fill
                  className="rounded-xl object-contain"
                  quality={100}
                  priority
                />

                {/* Close Button with fade-in animation */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:text-gray-500 transition-all duration-300 ease-in-out"
                  style={{
                    opacity: isAnimating ? 1 : 0,
                  }}
                  aria-label="Close preview"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="px-24 mb-20">
        <h1 className="text-5xl text-black mb-8">
          Features of <span className="text-red-600">Taskify</span>
        </h1>
        <div className="flex justify-between items-center gap-32 pb-4">
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              fill="#E52020"
              viewBox="0 0 256 256"
              className="pt-2"
            >
              <path
                d="M96,240l16-80L48,136,160,16,144,96l64,24Z"
                opacity="0.2"
              ></path>
              <path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z"></path>
            </svg>
            <div>
              <h1 className="text-4xl text-black">Blazing Fast</h1>
              <p className="text-black text-md">
                Built&nbsp;using&nbsp;Next.js,&nbsp;Postegres,&nbsp;and&nbsp;shadcn/ui
              </p>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-black font-bold">
              <p>Taskify loading time &lt; 1000ms</p>
              <p>Average website loading time: ~2.5s</p>
            </div>
            <div className="relative w-full h-3 flex">
              <Image src="/loading.svg" fill alt="Loading"></Image>
            </div>
          </div>
        </div>
        <div className="flex items-center pb-4">
          <div className="relative w-full h-32 flex">
            <Image src="/design.svg" fill alt="Loading"></Image>
          </div>
        </div>
        <div className="flex justify-between items-center gap-32">
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              fill="#E52020"
              viewBox="0 0 256 256"
              className="pt-2"
            >
              <path
                d="M128,48,68.32,70.38a8,8,0,0,0-5.08,6.17L40,216l139.45-23.24a8,8,0,0,0,6.17-5.08L208,128Zm-4,104a20,20,0,1,1,20-20A20,20,0,0,1,124,152Z"
                opacity="0.2"
              ></path>
              <path d="M248,92.68a15.86,15.86,0,0,0-4.69-11.31L174.63,12.68a16,16,0,0,0-22.63,0L123.57,41.11l-58,21.77A16.06,16.06,0,0,0,55.35,75.23L32.11,214.68A8,8,0,0,0,40,224a8.4,8.4,0,0,0,1.32-.11l139.44-23.24a16,16,0,0,0,12.35-10.17l21.77-58L243.31,104A15.87,15.87,0,0,0,248,92.68Zm-69.87,92.19L63.32,204l47.37-47.37a28,28,0,1,0-11.32-11.32L52,192.7,71.13,77.86,126,57.29,198.7,130ZM112,132a12,12,0,1,1,12,12A12,12,0,0,1,112,132Zm96-15.32L139.31,48l24-24L232,92.68Z"></path>
            </svg>
            <div>
              <h1 className="text-4xl text-black">
                Easy-to-use, Intuitive UI Design
              </h1>
              <p className="text-black text-md">
                Tailored UI design w/ shadcn/ui to provide easy-to-use interface
              </p>
            </div>
          </div>
          <div>
            <div className="flex justify-end">
              <h1 className="text-4xl text-black text-end mr-2">Open Source</h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="#E52020"
                viewBox="0 0 256 256"
              >
                <path
                  d="M88,64A24,24,0,1,1,64,40,24,24,0,0,1,88,64ZM192,40a24,24,0,1,0,24,24A24,24,0,0,0,192,40Z"
                  opacity="0.2"
                ></path>
                <path d="M224,64a32,32,0,1,0-40,31v17a8,8,0,0,1-8,8H80a8,8,0,0,1-8-8V95a32,32,0,1,0-16,0v17a24,24,0,0,0,24,24h40v25a32,32,0,1,0,16,0V136h40a24,24,0,0,0,24-24V95A32.06,32.06,0,0,0,224,64ZM48,64A16,16,0,1,1,64,80,16,16,0,0,1,48,64Zm96,128a16,16,0,1,1-16-16A16,16,0,0,1,144,192ZM192,80a16,16,0,1,1,16-16A16,16,0,0,1,192,80Z"></path>
              </svg>
            </div>
            <p className="text-black text-md">
              Code&nbsp;available&nbsp;on&nbsp;GitHub&nbsp;to&nbsp;contribute/develop&nbsp;upon
            </p>
          </div>
        </div>
      </section>

      <footer>
        <div className="relative w-full h-auto aspect-[16/2]">
          <Image src="/footer-waves.png" alt="Footer waves" fill></Image>
        </div>
        <div className="bg-cover bg-no-repeat bg-black flex flex-col justify-center items-center bg-center py-6">
          <h3 className="text-4xl mb-3 text-white">
            So why wait? Switch to <span className="text-red-600">Taskify</span>
          </h3>
          <div className="flex w-1/2 justify-center items-center gap-4 mb-3">
            <Link
              href="/register"
              className="bg-white rounded-lg text-sm px-10 py-3 text-black hover:bg-[#E52020] hover:text-white hover:shadow-[0_0_15px_rgba(229,32,32,0.5)] hover:scale-105 transition-all"
            >
              Get Started
            </Link>
            <Link
              href="https://github.com/AvgBlank/Taskify"
              className="text-white hover:text-[#E52020] hover:scale-105 underline transition-all"
            >
              GitHub
            </Link>
          </div>
          <p className="text-white text-md">
            &copy; Taskify 2025 | Created by{" "}
            <Link
              href="https://github.com/AvgBlank"
              className="underline hover:text-[#E52020] hover:scale-105 transition-all"
            >
              AvgBlank
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
