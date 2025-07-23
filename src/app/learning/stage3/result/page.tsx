import { Suspense } from "react";
import { Stage3ResultPage } from "@/components/learning/stage3/ui/Stage3ResultPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-blue-100 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-xl font-bold">결과를 불러오고 있어요...</p>
          </div>
        </div>
      }
    >
      <Stage3ResultPage />
    </Suspense>
  );
}
