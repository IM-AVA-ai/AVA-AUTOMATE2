import React from "react";
import {Card, CardBody, Select, SelectItem, Textarea, Button, Chip, Tabs, Tab, Avatar} from "@heroui/react";
import {Icon} from "@iconify/react";

const aiModels = [
  {
    label: "GPT-4 Turbo",
    value: "gpt4-turbo",
    description: "Most capable model, best for complex tasks",
    icon: "lucide:sparkles"
  },
  {
    label: "GPT-3.5",
    value: "gpt35",
    description: "Fast and efficient for most tasks",
    icon: "lucide:zap"
  },
  {
    label: "Claude 2",
    value: "claude2",
    description: "Specialized in analysis and reasoning",
    icon: "lucide:brain"
  }
];

const presetAssistants = [
  {
    label: "Code Expert",
    systemMessage: "You are an expert programmer focused on writing clean, efficient code.",
    icon: "lucide:code"
  },
  {
    label: "Writing Assistant",
    systemMessage: "You are a skilled writer helping with content creation and editing.",
    icon: "lucide:pen-tool"
  },
  {
    label: "Data Analyst",
    systemMessage: "You are a data analyst expert in interpreting and explaining complex data.",
    icon: "lucide:bar-chart"
  }
];

export default function AIPlayground() {
  const [selectedModel, setSelectedModel] = React.useState("gpt4-turbo");
  const [systemMessage, setSystemMessage] = React.useState("");
  const [userPrompt, setUserPrompt] = React.useState("");
  const [temperature, setTemperature] = React.useState(0.7);
  
  return (
    <div className="flex flex-col w-full h-screen bg-[#0D0B1F] text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl">Playground</h1>
        <div className="flex gap-2">
          <Select 
            label="Select a preset"
            className="w-48"
            variant="bordered"
          >
            <SelectItem key="preset1">Preset 1</SelectItem>
            <SelectItem key="preset2">Preset 2</SelectItem>
          </Select>
          <Button variant="flat">Save</Button>
          <Button variant="flat">Update</Button>
          <Button color="danger" variant="flat">Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-[300px,1fr] gap-4">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-4">
          <Card className="bg-[#1A1A1A]/50 border border-white/10">
            <CardBody>
              <h3 className="text-sm font-medium mb-2">System</h3>
              <Textarea 
                placeholder="You are a helpful AI assistant..."
                value={systemMessage}
                onValueChange={setSystemMessage}
                variant="bordered"
                className="bg-transparent"
                minRows={3}
              />
            </CardBody>
          </Card>

          <Card className="bg-[#1A1A1A]/50 border border-white/10">
            <CardBody className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Model</h3>
                <Select 
                  selectedKeys={[selectedModel]}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  variant="bordered"
                >
                  {aiModels.map((model) => (
                    <SelectItem key={model.value}>{model.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Temperature</h3>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-1">{temperature}</div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Max Length</h3>
                <input
                  type="range"
                  min="0"
                  max="2048"
                  value="1024"
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-1">1024</div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Top P</h3>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value="0.5"
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-1">0.5</div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg">Creative Uses for Kids' Art</h2>
            <div className="flex gap-2">
              <Button variant="flat" color="primary">Creative</Button>
              <Button variant="flat">Technical</Button>
              <Button variant="flat">Precise</Button>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 bg-[#1A1A1A]/30 rounded-lg p-4 mb-4 overflow-y-auto">
            <div className="flex gap-4 mb-6">
              <Avatar src="https://img.heroui.chat/image/avatar?w=40&h=40&u=1" size="sm" />
              <div className="flex-1">
                <p className="bg-[#1A1A1A]/50 p-3 rounded-lg">
                  What are 5 creative things I could do with my kids' art? I don't want to throw them away, but it's also so much clutter.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <img src="/images/favicon.svg" width="24" height="24" alt="Logo" />
              <div className="flex-1">
                <div className="bg-[#1A1A1A]/50 p-3 rounded-lg">
                  <p className="mb-2">Certainly! Here's a summary of five creative ways to use your kids' art:</p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>Create Art Books: Turn scanned artwork into custom photo books.</li>
                    <li>Set Up a Gallery Wall: Use a dedicated wall with interchangeable frames for displaying art.</li>
                    <li>Make Functional Items: Print designs on items like pillows, bags, or mugs.</li>
                    <li>Implement an Art Rotation System: Regularly change the displayed art, archiving the older pieces.</li>
                    <li>Use as Gift Wrap: Repurpose art as unique wrapping paper for presents.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="relative">
            <Textarea
              placeholder="Enter a prompt here"
              value={userPrompt}
              onValueChange={setUserPrompt}
              minRows={3}
              className="bg-[#1A1A1A]/50 border border-white/10"
            />
            <div className="absolute bottom-4 left-4 flex gap-4">
              <Button variant="light" size="sm" startContent={<Icon icon="lucide:paperclip" />}>
                Attach
              </Button>
              <Button variant="light" size="sm" startContent={<Icon icon="lucide:mic" />}>
                Voice Commands
              </Button>
              <Button variant="light" size="sm" startContent={<Icon icon="lucide:file-text" />}>
                Templates
              </Button>
            </div>
            <div className="absolute bottom-4 right-4 text-xs text-gray-400">
              {userPrompt.length}/2000
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
