"use client";

export default function LoginButton() {
  return (
    <a
      href="/auth/login"
      className="bg-purple-500  text-xs md:text-xl tracking-wider md:px-4 md:py-2 px-2 py-1 hover:bg-white/10 text-white rounded-full"
    >
      Log In 
    </a>
  );
}