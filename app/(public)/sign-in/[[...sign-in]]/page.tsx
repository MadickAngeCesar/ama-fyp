import { SignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0B0F14] text-[#E6EAF2]">
      <header className="max-w-6xl sticky top-0 bg-[#0B0F14] z-50 mx-auto px-3 py-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4F7DFF] flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div>
            <div className="text-lg font-semibold">ASSS</div>
            <div className="text-xs text-[#A9B1C7]">Student Support System</div>
          </div>
        </div>
        <Link href="/">
          <Button
            variant="outline"
            className="bg-gray-400 text-gray-950 cursor-pointer hover:bg-gray-950 hover:text-gray-400"
            size="sm"
          >
            Back to Home
          </Button>
        </Link>
      </header>
      <div
        className="flex items-center justify-center px-6 w-full"
        style={{ minHeight: "calc(100vh - 72px)" }}
      >
        <SignIn />
      </div>
    </main>
  );
}
