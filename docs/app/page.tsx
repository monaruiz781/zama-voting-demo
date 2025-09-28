"use client";

import { useFhevm } from "@/fhevm/useFhevm";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { useMetaMask } from "@/hooks/useMetaMask";
import { useVotingSystem } from "@/hooks/useVotingSystem";
import { useLanguage } from "./providers";
import { VotingCard } from "@/components/VotingCard";
import { CreateVotingForm } from "@/components/CreateVotingForm";
import { VoteModal } from "@/components/VoteModal";
import { ResultsModal } from "@/components/ResultsModal";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import { Wallet, Plus, Vote, BarChart3, Globe, Settings, RefreshCw } from "lucide-react";

export default function HomePage() {
  const { t, language, setLanguage } = useLanguage();
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  
  const {
    provider,
    chainId,
    accounts,
    isConnected,
    connect,
    disconnect,
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
    provider: provider, // Don't use localhost fallback when connecting to Sepolia
    chainId: chainId,
    initialMockChains,
    enabled: isConnected, // Only enable when wallet is connected
  });

  // Create a readonly provider for reading data even without wallet connection
  const readonlyProvider = useMemo(() => {
    if (ethersReadonlyProvider) return ethersReadonlyProvider;
    
    // Use environment-specific fallback
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
    if (chainId === "11155111") {
      // Sepolia network
      return new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY || "78e2c8be8a32466cae545f06ebc780c1"}`);
    }
    
    // Default to localhost for development
    return new ethers.JsonRpcProvider("http://localhost:8545");
  }, [ethersReadonlyProvider]);

  const {
    contractAddress,
    isDeployed,
    canInteract,
    votings,
    votingResults,
    isLoading,
    isCreating,
    isVoting,
    message,
    refreshVotings,
    createVoting,
    castVote,
    endVoting,
    decryptVotingResults,
    hasVoted,
    canVote,
    getVotingStatus,
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

  const [activeTab, setActiveTab] = useState<"votings" | "create" | "admin">("votings");
  const [votingStates, setVotingStates] = useState<Map<number, { hasVoted: boolean; canVote: boolean }>>(new Map());
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [selectedVoting, setSelectedVoting] = useState<VotingInfo | null>(null);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [selectedResultsVoting, setSelectedResultsVoting] = useState<VotingInfo | null>(null);

  // Load voting states for current user
  useEffect(() => {
    if (!isConnected || !accounts?.[0] || !canInteract) return;

    const loadVotingStates = async () => {
      const states = new Map();
      
      for (const voting of votings) {
        try {
          const [userHasVoted, userCanVote] = await Promise.all([
            hasVoted(voting.id, accounts[0]),
            canVote(voting.id, accounts[0]),
          ]);
          
          states.set(voting.id, {
            hasVoted: userHasVoted,
            canVote: userCanVote,
          });
        } catch (error) {
          console.error(`Failed to load state for voting ${voting.id}:`, error);
        }
      }
      
      setVotingStates(states);
    };

    loadVotingStates();
  }, [votings, accounts, isConnected, canInteract]); // Remove function dependencies to prevent infinite loop

  const handleVote = async (votingId: number) => {
    const voting = votings.find(v => v.id === votingId);
    if (voting) {
      setSelectedVoting(voting);
      setVoteModalOpen(true);
    }
  };

  const handleVoteSubmit = async (votingId: number, optionIndex: number) => {
    try {
      await castVote(votingId, optionIndex);
      // Reload voting states
      if (accounts?.[0]) {
        const [userHasVoted, userCanVote] = await Promise.all([
          hasVoted(votingId, accounts[0]),
          canVote(votingId, accounts[0]),
        ]);
        
        setVotingStates(prev => new Map(prev.set(votingId, {
          hasVoted: userHasVoted,
          canVote: userCanVote,
        })));
      }
    } catch (error) {
      console.error("Failed to cast vote:", error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  const handleViewResults = async (votingId: number) => {
    const voting = votings.find(v => v.id === votingId);
    if (voting) {
      setSelectedResultsVoting(voting);
      setResultsModalOpen(true);
    }
  };

  const handleEndVoting = async (votingId: number) => {
    try {
      await endVoting(votingId);
    } catch (error) {
      console.error("Failed to end voting:", error);
    }
  };

  const handleCreateVoting = async (data: {
    title: string;
    description: string;
    options: string[];
    startTime: number;
    endTime: number;
    isPublic: boolean;
  }) => {
    await createVoting(
      data.title,
      data.description,
      data.options,
      data.startTime,
      data.endTime,
      data.isPublic
    );
    setActiveTab("votings");
  };

  const isAdmin = accounts?.[0] && contractAddress; // Simplified admin check

  // Show wallet connection prompt only if trying to interact
  const showWalletPrompt = !isConnected && (activeTab === "create" || activeTab === "admin");

  if (showWalletPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Vote className="w-8 h-8 text-primary" />
              {t("voting.title")}
            </CardTitle>
            <CardDescription>
              {t("voting.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={connect}
              disabled={walletStatus === "connecting"}
              className="w-full"
              size="lg"
            >
              <Wallet className="w-4 h-4 mr-2" />
              {walletStatus === "connecting" ? t("common.loading") : t("nav.connect")}
            </Button>
            
            {walletError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                {walletError.message}
              </div>
            )}

            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage("en")}
                className={language === "en" ? "bg-primary text-primary-foreground" : ""}
              >
                English
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage("zh")}
                className={language === "zh" ? "bg-primary text-primary-foreground" : ""}
              >
                中文
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isDeployed === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Contract Not Deployed</CardTitle>
            <CardDescription>
              VotingSystem contract not found for chain ID {chainId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>Please deploy the contract first:</p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Start Hardhat node: <code>npx hardhat node</code></li>
                <li>Deploy contract: <code>npx hardhat --network localhost deploy --tags VotingSystem</code></li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vote className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">{t("voting.title")}</h1>
                <p className="text-sm text-muted-foreground">{t("voting.subtitle")}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <div className="flex gap-1">
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                >
                  EN
                </Button>
                <Button
                  variant={language === "zh" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("zh")}
                >
                  中文
                </Button>
              </div>

              {/* Wallet Info */}
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <Badge variant="outline">
                      Chain: {chainId}
                    </Badge>
                    <Button
                      variant="outline"
                      onClick={disconnect}
                      size="sm"
                    >
                      {accounts?.[0]?.slice(0, 6)}...{accounts?.[0]?.slice(-4)}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={connect}
                    disabled={walletStatus === "connecting"}
                    size="sm"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    {walletStatus === "connecting" ? t("common.loading") : t("nav.connect")}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 mt-4">
            <Button
              variant={activeTab === "votings" ? "default" : "ghost"}
              onClick={() => setActiveTab("votings")}
              size="sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {t("nav.home")}
            </Button>
            <Button
              variant={activeTab === "create" ? "default" : "ghost"}
              onClick={() => setActiveTab("create")}
              size="sm"
              disabled={!isConnected}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("nav.create")}
            </Button>
            {isAdmin && (
              <Button
                variant={activeTab === "admin" ? "default" : "ghost"}
                onClick={() => setActiveTab("admin")}
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t("nav.admin")}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Status Messages */}
        {(fhevmStatus !== "ready" || message) && (
          <div className="mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">
                      <strong>FHEVM Status:</strong> {fhevmStatus}
                    </p>
                    {message && (
                      <p className="text-sm text-muted-foreground mt-1">{message}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshVotings}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "votings" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Active Votings</h2>
              <Badge variant="outline">
                {votings.length} {votings.length === 1 ? "voting" : "votings"}
              </Badge>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
                <p>{t("common.loading")}</p>
              </div>
            ) : votings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Vote className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No votings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create the first voting to get started
                  </p>
                  <Button onClick={() => setActiveTab("create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t("voting.create")}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="voting-grid">
                {votings.map((voting) => {
                  const status = getVotingStatus(voting);
                  const state = votingStates.get(voting.id);
                  const isCreator = accounts?.[0]?.toLowerCase() === voting.creator.toLowerCase();

                  return (
                    <VotingCard
                      key={voting.id}
                      voting={voting}
                      status={status}
                      onVote={handleVote}
                      onViewResults={handleViewResults}
                      onEndVoting={handleEndVoting}
                      canVote={state?.canVote || false}
                      hasVoted={state?.hasVoted || false}
                      isCreator={isCreator}
                      isAdmin={isAdmin}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "create" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{t("voting.create")}</h2>
              <p className="text-muted-foreground">
                Create a new confidential voting with encrypted votes
              </p>
            </div>

            <CreateVotingForm
              onSubmit={handleCreateVoting}
              isLoading={isCreating}
            />
          </div>
        )}

        {activeTab === "admin" && isAdmin && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{t("nav.admin")}</h2>
              <p className="text-muted-foreground">
                Manage votings and system settings
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Contract Address:</strong>
                    <p className="font-mono text-xs">{contractAddress}</p>
                  </div>
                  <div>
                    <strong>Chain ID:</strong>
                    <p>{chainId}</p>
                  </div>
                  <div>
                    <strong>Total Votings:</strong>
                    <p>{votings.length}</p>
                  </div>
                  <div>
                    <strong>FHEVM Status:</strong>
                    <p>{fhevmStatus}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Vote Modal */}
      {selectedVoting && (
        <VoteModal
          voting={selectedVoting}
          isOpen={voteModalOpen}
          onClose={() => setVoteModalOpen(false)}
          onVote={handleVoteSubmit}
          isLoading={isVoting}
        />
      )}

      {/* Results Modal */}
      {selectedResultsVoting && (
        <ResultsModal
          voting={selectedResultsVoting}
          results={votingResults.get(selectedResultsVoting.id)}
          isOpen={resultsModalOpen}
          onClose={() => setResultsModalOpen(false)}
          onDecrypt={decryptVotingResults}
          isDecrypting={isLoading}
          userAddress={accounts?.[0]}
        />
      )}
    </div>
  );
}
