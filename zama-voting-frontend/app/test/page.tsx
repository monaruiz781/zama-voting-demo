"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { VoteModal } from "@/components/VoteModal";
import { ResultsModal } from "@/components/ResultsModal";
import { VotingInfo, VotingResults } from "@/hooks/useVotingSystem";

// Mock voting data for testing
const mockVoting: VotingInfo = {
  id: 0,
  title: "测试投票",
  description: "这是一个测试投票，用于验证投票选择功能",
  options: ["选项A", "选项B", "选项C"],
  creator: "0x1234567890123456789012345678901234567890",
  startTime: Math.floor(Date.now() / 1000) - 3600,
  endTime: Math.floor(Date.now() / 1000) + 3600,
  isActive: true,
  isPublic: true,
  totalVotes: 5,
};

const mockResults: VotingResults = {
  votingId: 0,
  results: [2, 1, 2], // A:2票, B:1票, C:2票
  totalVotes: 5,
};

export default function TestPage() {
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleVote = async (votingId: number, optionIndex: number) => {
    console.log(`Test vote: Voting ${votingId}, Option ${optionIndex} (${mockVoting.options[optionIndex]})`);
    setSelectedOption(optionIndex);
    setVoteModalOpen(false);
    alert(`✅ 投票成功！您选择了: "${mockVoting.options[optionIndex]}"`);
  };

  const handleDecrypt = async (votingId: number) => {
    console.log(`Test decrypt: Voting ${votingId}`);
    // Simulate decryption delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowResults(true);
    alert("✅ 结果解密成功！");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">ZamaVoting 功能测试页面</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              这个页面用于测试投票选择和结果查看功能。所有操作都是模拟的，不会与真实的智能合约交互。
            </p>
          </CardContent>
        </Card>

        {/* Test Voting Card */}
        <Card>
          <CardHeader>
            <CardTitle>模拟投票</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted">
              <h3 className="font-semibold text-lg">{mockVoting.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{mockVoting.description}</p>
              <div className="mt-3">
                <strong>选项:</strong>
                <ul className="list-disc list-inside mt-1">
                  {mockVoting.options.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 text-sm">
                <strong>总票数:</strong> {mockVoting.totalVotes}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setVoteModalOpen(true)}
                className="w-full"
                size="lg"
              >
                🗳️ 测试投票选择
              </Button>
              
              <Button
                onClick={() => setResultsModalOpen(true)}
                variant="outline"
                className="w-full"
                size="lg"
              >
                📊 测试结果查看
              </Button>
            </div>

            {selectedOption !== null && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800">最后投票结果:</h4>
                <p className="text-green-700">
                  您选择了: <strong>{mockVoting.options[selectedOption]}</strong>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">1. 测试投票选择:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                <li>点击"测试投票选择"按钮</li>
                <li>在弹出的模态框中选择任意选项</li>
                <li>确认选择并提交</li>
                <li>查看选择结果反馈</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">2. 测试结果查看:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                <li>点击"测试结果查看"按钮</li>
                <li>在结果模态框中点击"Decrypt Results"</li>
                <li>查看模拟的投票结果和统计</li>
                <li>观察获胜选项的高亮显示</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">3. 真实使用:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                <li>返回主页 (/) 进行真实的投票</li>
                <li>连接MetaMask钱包</li>
                <li>参与真实的FHEVM加密投票</li>
                <li>体验完整的隐私保护投票流程</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center">
          <Button
            onClick={() => window.location.href = "/"}
            variant="outline"
          >
            ← 返回主页
          </Button>
        </div>
      </div>

      {/* Modals */}
      <VoteModal
        voting={mockVoting}
        isOpen={voteModalOpen}
        onClose={() => setVoteModalOpen(false)}
        onVote={handleVote}
        isLoading={false}
      />

      <ResultsModal
        voting={mockVoting}
        results={showResults ? mockResults : undefined}
        isOpen={resultsModalOpen}
        onClose={() => setResultsModalOpen(false)}
        onDecrypt={handleDecrypt}
        isDecrypting={false}
      />
    </div>
  );
}
