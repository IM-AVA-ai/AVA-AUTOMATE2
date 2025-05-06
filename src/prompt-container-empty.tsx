import PromptContainerEmptyBase from "./components/prompt-container-empty-base";
import AIPlayground from "./app/dashboard/playground/ai-playground";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <AIPlayground />
    </div>
  );
}