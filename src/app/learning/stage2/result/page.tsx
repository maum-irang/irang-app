import { Suspense } from "react";
import { Stage2ResultPage } from "@/components/learning/stage2/ui/Stage2ResultPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stage2ResultPage />
    </Suspense>
  );
}
