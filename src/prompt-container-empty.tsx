import PromptContainerEmptyBase from "./components/prompt-container-empty-base";
import { Providers } from "@/providers";
import AIPlayground from "./app/dashboard/playground/page";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <AIPlayground />
    </div>
  );
}
