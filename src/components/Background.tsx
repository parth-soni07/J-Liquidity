import React from "react";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full bg-purple-200 mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full bg-indigo-200 mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-pink-200 mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
    </div>
  );
}
