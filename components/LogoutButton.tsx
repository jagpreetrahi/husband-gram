"use client";

export default function LogoutButton() {
  return (
    <a
      href="/auth/logout"
      className="bg-purple-500 text-sm md:text-xl tracking-wider px-2 py-1 md:px-4 md:py-2  text-white rounded-full"
    >
      Log Out
    </a>
  );
}