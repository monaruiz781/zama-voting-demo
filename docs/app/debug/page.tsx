"use client";

import { useFhevm } from "@/fhevm/useFhevm";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { useMetaMask } from "@/hooks/useMetaMask";
import { useVotingSystem } from "@/hooks/useVotingSystem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useMemo } from "react";
import { ethers } from "ethers";

export default function DebugPage() {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  
  const {
    provider,
    chainId,
    accounts,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
    status: walletStatus,
    error: walletError,
  } = useMetaMask();

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider: provider || "http://localhost:8545",
    chainId: chainId || 31337,
    initialMockChains,
    enabled: true,
  });

  const readonlyProvider = useMemo(() => {
    if (ethersReadonlyProvider) return ethersReadonlyProvider;
    return new ethers.JsonRpcProvider("http://localhost:8545");
  }, [ethersReadonlyProvider]);

  const {
    contractAddress,
    isDeployed,
    canInteract,
    votings,
    votingResults,
    isLoading,
    message,
    refreshVotings,
  } = useVotingSystem({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId: chainId || 31337,
    ethersSigner,
    ethersReadonlyProvider: readonlyProvider,
    sameChain,
    sameSigner,
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>ZamaVoting 调试信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>钱包状态:</strong>
                <p>连接状态: {isConnected ? "已连接" : "未连接"}</p>
                <p>状态: {walletStatus}</p>
                <p>链ID: {chainId || "未知"}</p>
                <p>账户: {accounts?.[0] || "无"}</p>
              </div>
              
              <div>
                <strong>FHEVM状态:</strong>
                <p>状态: {fhevmStatus}</p>
                <p>实例: {fhevmInstance ? "已创建" : "未创建"}</p>
                <p>错误: {fhevmError?.message || "无"}</p>
              </div>
              
              <div>
                <strong>合约状态:</strong>
                <p>地址: {contractAddress || "未知"}</p>
                <p>已部署: {isDeployed ? "是" : "否"}</p>
                <p>可交互: {canInteract ? "是" : "否"}</p>
              </div>
              
              <div>
                <strong>投票数据:</strong>
                <p>投票数量: {votings.length}</p>
                <p>加载中: {isLoading ? "是" : "否"}</p>
                <p>消息: {message || "无"}</p>
              </div>
            </div>

            <div>
              <strong>投票列表:</strong>
              {votings.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {votings.map((voting, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <p><strong>ID:</strong> {voting.id}</p>
                      <p><strong>标题:</strong> {voting.title}</p>
                      <p><strong>选项:</strong> {voting.options.join(", ")}</p>
                      <p><strong>总票数:</strong> {voting.totalVotes}</p>
                      <p><strong>状态:</strong> {voting.isActive ? "进行中" : "已结束"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground mt-2">暂无投票数据</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button onClick={refreshVotings} disabled={isLoading}>
                刷新投票数据
              </Button>
              
              {!isConnected && (
                <Button onClick={connect} disabled={walletStatus === "connecting"}>
                  连接钱包
                </Button>
              )}
            </div>

            <div className="text-xs text-muted-foreground">
              <p>如果投票数据为空，请检查:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Hardhat节点是否运行在 http://localhost:8545</li>
                <li>VotingSystem合约是否已部署</li>
                <li>是否已创建投票</li>
                <li>FHEVM实例是否正确初始化</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
