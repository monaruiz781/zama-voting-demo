"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { VoteModal } from "@/components/VoteModal";
import { VotingInfo } from "@/hooks/useVotingSystem";

// Mock voting data for demonstration
const mockVoting: VotingInfo = {
  id: 0,
  title: "选择你最喜欢的颜色",
  description: "这是一个关于颜色偏好的投票演示",
  options: ["红色", "蓝色", "绿色", "黄色"],
  creator: "0x1234567890123456789012345678901234567890",
  startTime: Math.floor(Date.now() / 1000),
  endTime: Math.floor(Date.now() / 1000) + 3600,
  isActive: true,
  isPublic: true,
  totalVotes: 0,
};

export default function DemoPage() {
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleVote = async (votingId: number, optionIndex: number) => {
    console.log(`Demo vote: Voting ${votingId}, Option ${optionIndex} (${mockVoting.options[optionIndex]})`);
    setSelectedOption(optionIndex);
    alert(`Demo: You selected "${mockVoting.options[optionIndex]}"!`);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>投票选择功能演示</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">模拟投票:</h3>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">{mockVoting.title}</h4>
                <p className="text-sm text-muted-foreground">{mockVoting.description}</p>
                <div className="mt-2">
                  <strong>选项:</strong> {mockVoting.options.join(", ")}
                </div>
              </div>
            </div>

            <Button
              onClick={() => setVoteModalOpen(true)}
              className="w-full"
            >
              打开投票选择界面
            </Button>

            {selectedOption !== null && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <strong>您选择了:</strong> {mockVoting.options[selectedOption]}
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              <p>这是一个演示页面，展示投票选择界面的功能。</p>
              <p>在实际应用中，这会连接到FHEVM智能合约进行加密投票。</p>
            </div>
          </CardContent>
        </Card>

        <VoteModal
          voting={mockVoting}
          isOpen={voteModalOpen}
          onClose={() => setVoteModalOpen(false)}
          onVote={handleVote}
          isLoading={false}
        />
      </div>
    </div>
  );
}
