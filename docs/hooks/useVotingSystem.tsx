"use client";

import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FhevmInstance } from "@/fhevm/fhevmTypes";
import { GenericStringStorage } from "@/fhevm/GenericStringStorage";
import { FhevmDecryptionSignature } from "@/fhevm/FhevmDecryptionSignature";

// Import generated ABI and addresses
import { VotingSystemABI } from "@/abi/VotingSystemABI";
import { VotingSystemAddresses } from "@/abi/VotingSystemAddresses";

export interface VotingInfo {
  id: number;
  title: string;
  description: string;
  options: string[];
  creator: string;
  startTime: number;
  endTime: number;
  isActive: boolean;
  isPublic: boolean;
  totalVotes: number;
}

export interface VotingResults {
  votingId: number;
  results: number[];
  totalVotes: number;
}

export type VotingStatus = "upcoming" | "active" | "ended";

function getVotingSystemByChainId(chainId: number | undefined) {
  if (!chainId) {
    return { abi: VotingSystemABI.abi };
  }

  const entry = VotingSystemAddresses[chainId.toString()];
  
  if (!entry || !entry.address || entry.address === ethers.ZeroAddress) {
    return { abi: VotingSystemABI.abi, chainId };
  }

  return {
    address: entry.address as `0x${string}`,
    chainId: entry.chainId ?? chainId,
    chainName: entry.chainName,
    abi: VotingSystemABI.abi,
  };
}

export function useVotingSystem(parameters: {
  instance: FhevmInstance | undefined;
  fhevmDecryptionSignatureStorage: GenericStringStorage;
  eip1193Provider: ethers.Eip1193Provider | undefined;
  chainId: number | undefined;
  ethersSigner: ethers.JsonRpcSigner | undefined;
  ethersReadonlyProvider: ethers.ContractRunner | undefined;
  sameChain: React.RefObject<(chainId: number | undefined) => boolean>;
  sameSigner: React.RefObject<(ethersSigner: ethers.JsonRpcSigner | undefined) => boolean>;
}) {
  const {
    instance,
    fhevmDecryptionSignatureStorage,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  } = parameters;

  // State
  const [votings, setVotings] = useState<VotingInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [votingResults, setVotingResults] = useState<Map<number, VotingResults>>(new Map());

  // Refs
  const votingSystemRef = useRef<any>(undefined);
  const isLoadingRef = useRef<boolean>(false);
  const isCreatingRef = useRef<boolean>(false);
  const isVotingRef = useRef<boolean>(false);

  // Contract info - memoize to prevent recreation
  const votingSystem = useMemo(() => {
    const contract = getVotingSystemByChainId(chainId);
    votingSystemRef.current = contract;
    return contract;
  }, [chainId]);

  // Stable references for contract address and ABI
  const contractAddress = useMemo(() => votingSystem.address, [votingSystem.address]);
  const contractABI = useMemo(() => votingSystem.abi, [votingSystem.abi]);

  const isDeployed = useMemo(() => {
    return Boolean(contractAddress) && contractAddress !== ethers.ZeroAddress;
  }, [contractAddress]);

  const canInteract = useMemo(() => {
    return contractAddress && ethersReadonlyProvider && !isLoading;
  }, [contractAddress, ethersReadonlyProvider, isLoading]);

  const canRead = useMemo(() => {
    return contractAddress && ethersReadonlyProvider;
  }, [contractAddress, ethersReadonlyProvider]);

  // Load all votings
  const loadVotings = useCallback(async () => {
    if (isLoadingRef.current || !contractAddress || !ethersReadonlyProvider) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    setMessage("Loading votings...");

    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        ethersReadonlyProvider
      );

      const totalVotings = await contract.getTotalVotings();
      const votingPromises: Promise<VotingInfo>[] = [];

      for (let i = 0; i < totalVotings; i++) {
        votingPromises.push(
          contract.getVotingInfo(i).then((info: any) => ({
            id: i,
            title: info.title,
            description: info.description,
            options: info.options,
            creator: info.creator,
            startTime: Number(info.startTime),
            endTime: Number(info.endTime),
            isActive: info.isActive,
            isPublic: info.isPublic,
            totalVotes: Number(info.totalVotes),
          }))
        );
      }

      const loadedVotings = await Promise.all(votingPromises);
      setVotings(loadedVotings);
      setMessage(`Loaded ${loadedVotings.length} votings`);
    } catch (error) {
      console.error("Failed to load votings:", error);
      setMessage("Failed to load votings");
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [contractAddress, contractABI, ethersReadonlyProvider]); // Remove canInteract to break circular dependency

  // Create voting
  const createVoting = useCallback(async (
    title: string,
    description: string,
    options: string[],
    startTime: number,
    endTime: number,
    isPublic: boolean
  ) => {
    if (isCreatingRef.current || !ethersSigner || !contractAddress) return;

    isCreatingRef.current = true;
    setIsCreating(true);
    setMessage("Creating voting...");

    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        ethersSigner
      );

      const tx = await contract.createVoting(
        title,
        description,
        options,
        startTime,
        endTime,
        isPublic
      );

      setMessage(`Transaction submitted: ${tx.hash}`);
      const receipt = await tx.wait();
      setMessage("Voting created successfully!");

      // Reload votings
      setTimeout(() => loadVotings(), 1000); // Async reload to break dependency cycle

      return receipt;
    } catch (error) {
      console.error("Failed to create voting:", error);
      setMessage("Failed to create voting");
      throw error;
    } finally {
      isCreatingRef.current = false;
      setIsCreating(false);
    }
  }, [ethersSigner, contractAddress, contractABI]); // Remove loadVotings dependency

  // Cast vote
  const castVote = useCallback(async (votingId: number, optionIndex: number) => {
    if (isVotingRef.current || !instance || !ethersSigner || !contractAddress) return;

    isVotingRef.current = true;
    setIsVoting(true);
    setMessage("Preparing encrypted vote...");

    try {
      // Create encrypted input
      const input = instance.createEncryptedInput(
        contractAddress,
        ethersSigner.address
      );
      input.add8(optionIndex);

      setMessage("Encrypting vote...");
      const encryptedInput = await input.encrypt();

      setMessage("Submitting vote...");
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        ethersSigner
      );

      const tx = await contract.vote(
        votingId,
        encryptedInput.handles[0],
        encryptedInput.inputProof
      );

      setMessage(`Transaction submitted: ${tx.hash}`);
      const receipt = await tx.wait();
      setMessage("Vote cast successfully!");

      // Reload votings to update vote counts
      setTimeout(() => loadVotings(), 1000); // Async reload to break dependency cycle

      return receipt;
    } catch (error) {
      console.error("Failed to cast vote:", error);
      setMessage("Failed to cast vote");
      throw error;
    } finally {
      isVotingRef.current = false;
      setIsVoting(false);
    }
  }, [instance, ethersSigner, contractAddress, contractABI]); // Remove loadVotings dependency

  // End voting
  const endVoting = useCallback(async (votingId: number) => {
    if (!ethersSigner || !contractAddress) return;

    try {
      setMessage("Ending voting...");
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        ethersSigner
      );

      const tx = await contract.endVoting(votingId);
      setMessage(`Transaction submitted: ${tx.hash}`);
      
      const receipt = await tx.wait();
      setMessage("Voting ended successfully!");

      // Reload votings
      setTimeout(() => loadVotings(), 1000); // Async reload to break dependency cycle

      return receipt;
    } catch (error) {
      console.error("Failed to end voting:", error);
      setMessage("Failed to end voting");
      throw error;
    }
  }, [ethersSigner, contractAddress, contractABI]); // Remove loadVotings dependency

  // Decrypt voting results (creators have default access)
  const decryptVotingResults = useCallback(async (votingId: number) => {
    if (!instance || !ethersSigner || !contractAddress) return;

    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        ethersSigner
      );

      // Get voting info to check if user is creator
      const votingInfo = await contract.getVotingInfo(votingId);
      const isCreator = votingInfo.creator.toLowerCase() === ethersSigner.address.toLowerCase();
      
      // If not creator, make results public first
      if (!isCreator) {
        setMessage("Making results public...");
        const makePublicTx = await contract.makeResultsPublic(votingId);
        setMessage(`Transaction submitted: ${makePublicTx.hash}`);
        await makePublicTx.wait();
      }
      
      setMessage("Preparing decryption...");
      const optionsCount = votingInfo.options.length;

      // Get decryption signature
      const sig = await FhevmDecryptionSignature.loadOrSign(
        instance,
        [contractAddress as `0x${string}`],
        ethersSigner,
        fhevmDecryptionSignatureStorage
      );

      if (!sig) {
        setMessage("Unable to build FHEVM decryption signature");
        return;
      }

      setMessage("Decrypting results...");

      // Get encrypted vote counts and decrypt them
      const decryptPromises = [];
      for (let i = 0; i < optionsCount; i++) {
        const encryptedCount = await contract.getEncryptedVoteCount(votingId, i);
        if (encryptedCount !== ethers.ZeroHash) {
          decryptPromises.push(
            instance.userDecrypt(
              [{ handle: encryptedCount, contractAddress: contractAddress }],
              sig.privateKey,
              sig.publicKey,
              sig.signature,
              sig.contractAddresses,
              sig.userAddress,
              sig.startTimestamp,
              sig.durationDays
            ).then(result => Number(result[encryptedCount]))
          );
        } else {
          decryptPromises.push(Promise.resolve(0));
        }
      }

      const results = await Promise.all(decryptPromises);
      const totalVotes = results.reduce((sum, count) => sum + count, 0);

      const votingResults: VotingResults = {
        votingId,
        results,
        totalVotes,
      };

      setVotingResults(prev => new Map(prev.set(votingId, votingResults)));
      setMessage("Results decrypted successfully!");

      return votingResults;
    } catch (error) {
      console.error("Failed to decrypt results:", error);
      setMessage("Failed to decrypt results: " + (error as Error).message);
      throw error;
    }
  }, [instance, ethersSigner, contractAddress, contractABI, fhevmDecryptionSignatureStorage]);

  // Check if user has voted
  const hasVoted = useCallback(async (votingId: number, userAddress: string) => {
    if (!canInteract) return false;

    try {
      const contract = new ethers.Contract(
        contractAddress!,
        contractABI,
        ethersReadonlyProvider
      );

      return await contract.hasVoted(votingId, userAddress);
    } catch (error) {
      console.error("Failed to check voting status:", error);
      return false;
    }
  }, [canInteract, contractAddress, contractABI, ethersReadonlyProvider]);

  // Check if user can vote
  const canVote = useCallback(async (votingId: number, userAddress: string) => {
    if (!canInteract) return false;

    try {
      const contract = new ethers.Contract(
        contractAddress!,
        contractABI,
        ethersReadonlyProvider
      );

      return await contract.canVoteInVoting(votingId, userAddress);
    } catch (error) {
      console.error("Failed to check voting eligibility:", error);
      return false;
    }
  }, [canInteract, contractAddress, contractABI, ethersReadonlyProvider]);

  // Get voting status
  const getVotingStatus = useCallback((voting: VotingInfo): VotingStatus => {
    const now = Math.floor(Date.now() / 1000);
    
    if (!voting.isActive) return "ended";
    if (now < voting.startTime) return "upcoming";
    if (now > voting.endTime) return "ended";
    return "active";
  }, []);

  // Auto-load votings when contract is available
  useEffect(() => {
    if (canRead) {
      loadVotings();
    }
  }, [canRead, loadVotings]); // Use stable dependencies

  return {
    // Contract info
    contractAddress,
    isDeployed,
    canInteract,

    // State
    votings,
    votingResults,
    isLoading,
    isCreating,
    isVoting,
    message,

    // Actions
    refreshVotings: loadVotings, // Rename to avoid confusion
    createVoting,
    castVote,
    endVoting,
    decryptVotingResults,
    hasVoted,
    canVote,
    getVotingStatus,
  };
}
