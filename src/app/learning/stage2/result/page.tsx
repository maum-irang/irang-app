import { Suspense } from "react";
import { Stage2ResultPage } from "@/components/learning/stage2/ui/Stage2ResultPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-purple-100 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-xl font-bold">결과를 불러오고 있어요...</p>
          </div>
        </div>
      }
    >
      <Stage2ResultPage />
    </Suspense>
  );
}
