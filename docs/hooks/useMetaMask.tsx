"use client";

import { ethers } from "ethers";
import { useCallback, useEffect, useRef, useState } from "react";

export type MetaMaskState = "idle" | "connecting" | "connected" | "error";

export function useMetaMask() {
  const [provider, setProvider] = useState<ethers.Eip1193Provider | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [accounts, setAccounts] = useState<string[] | undefined>(undefined);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [status, setStatus] = useState<MetaMaskState>("idle");
  const [error, setError] = useState<Error | undefined>(undefined);
  const [ethersSigner, setEthersSigner] = useState<ethers.JsonRpcSigner | undefined>(undefined);
  const [ethersReadonlyProvider, setEthersReadonlyProvider] = useState<ethers.ContractRunner | undefined>(undefined);

  const sameChain = useRef<(chainId: number | undefined) => boolean>(() => false);
  const sameSigner = useRef<(ethersSigner: ethers.JsonRpcSigner | undefined) => boolean>(() => false);
  const initialMockChains = useRef<Record<number, string>>({ 31337: "http://localhost:8545" });

  // Update refs when values change
  useEffect(() => {
    const currentChainId = chainId;
    sameChain.current = (id: number | undefined) => id === currentChainId;
  }, [chainId]);

  useEffect(() => {
    const currentSigner = ethersSigner;
    sameSigner.current = (signer: ethers.JsonRpcSigner | undefined) => signer === currentSigner;
  }, [ethersSigner]);

  // Initialize MetaMask connection
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const ethereum = window.ethereum as ethers.Eip1193Provider;
      setProvider(ethereum);

      // Check if already connected
      ethereum.request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccounts(accounts);
            setIsConnected(true);
            updateChainId(ethereum);
            setupProviders(ethereum);
          }
        })
        .catch((error) => {
          console.error("Failed to get accounts:", error);
        });

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        setAccounts(accounts);
        setIsConnected(accounts.length > 0);
        if (accounts.length > 0) {
          setupProviders(ethereum);
        } else {
          setEthersSigner(undefined);
          setEthersReadonlyProvider(undefined);
        }
      };

      // Listen for chain changes
      const handleChainChanged = (chainId: string) => {
        const newChainId = parseInt(chainId, 16);
        setChainId(newChainId);
        if (isConnected) {
          setupProviders(ethereum);
        }
      };

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);

      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [isConnected]);

  const updateChainId = async (ethereum: ethers.Eip1193Provider) => {
    try {
      const chainId = await ethereum.request({ method: "eth_chainId" });
      setChainId(parseInt(chainId as string, 16));
    } catch (error) {
      console.error("Failed to get chain ID:", error);
    }
  };

  const setupProviders = async (ethereum: ethers.Eip1193Provider) => {
    try {
      const browserProvider = new ethers.BrowserProvider(ethereum);
      const signer = await browserProvider.getSigner();
      setEthersSigner(signer);
      setEthersReadonlyProvider(browserProvider);
    } catch (error) {
      console.error("Failed to setup providers:", error);
      setError(error as Error);
    }
  };

  const connect = useCallback(async () => {
    if (!provider) {
      setError(new Error("MetaMask not detected"));
      setStatus("error");
      return;
    }

    try {
      setStatus("connecting");
      setError(undefined);

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      }) as string[];

      setAccounts(accounts);
      setIsConnected(accounts.length > 0);
      await updateChainId(provider);
      await setupProviders(provider);
      setStatus("connected");
    } catch (error) {
      console.error("Failed to connect:", error);
      setError(error as Error);
      setStatus("error");
    }
  }, [provider]);

  const disconnect = useCallback(() => {
    setAccounts(undefined);
    setIsConnected(false);
    setEthersSigner(undefined);
    setEthersReadonlyProvider(undefined);
    setStatus("idle");
    setError(undefined);
  }, []);

  const switchToChain = useCallback(async (targetChainId: number) => {
    if (!provider) return;

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error: any) {
      // If the chain doesn't exist, add it (for localhost)
      if (error.code === 4902 && targetChainId === 31337) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0x7a69",
              chainName: "Hardhat Local",
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["http://localhost:8545"],
            }],
          });
        } catch (addError) {
          console.error("Failed to add chain:", addError);
          throw addError;
        }
      } else {
        throw error;
      }
    }
  }, [provider]);

  return {
    provider,
    chainId,
    accounts,
    isConnected,
    status,
    error,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains: initialMockChains.current,
    connect,
    disconnect,
    switchToChain,
  };
}
