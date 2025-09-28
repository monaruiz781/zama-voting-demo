import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

export function formatTimeRemaining(endTime: number): string {
  const now = Math.floor(Date.now() / 1000);
  const remaining = endTime - now;
  
  if (remaining <= 0) return "Ended";
  
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function getVotingStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900";
    case "ended":
      return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900";
    case "upcoming":
      return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900";
    default:
      return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900";
  }
}
