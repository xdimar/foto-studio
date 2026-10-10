import React from "react";

export default function AdminLoading() {
  return (
    <div className="py-24 flex flex-col items-center justify-center gap-3 animate-pulse">
      <div className="w-8 h-8 rounded-full border-2 border-[#720C10] border-t-white animate-spin" />
      <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
        Memuat Workspace Studio...
      </p>
    </div>
  );
}
