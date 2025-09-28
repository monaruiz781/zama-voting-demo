"use client";

import { VotingInfo, VotingResults } from "@/hooks/useVotingSystem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/app/providers";
import { BarChart3, X, Eye, Users, Trophy } from "lucide-react";

interface ResultsModalProps {
  voting: VotingInfo;
  results?: VotingResults;
  isOpen: boolean;
  onClose: () => void;
  onDecrypt: (votingId: number) => Promise<void>;
  isDecrypting?: boolean;
  userAddress?: string;
}

export function ResultsModal({ 
  voting, 
  results, 
  isOpen, 
  onClose, 
  onDecrypt, 
  isDecrypting = false,
  userAddress
}: ResultsModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleDecrypt = async () => {
    try {
      await onDecrypt(voting.id);
    } catch (error) {
      console.error("Failed to decrypt results:", error);
    }
  };

  const getWinningOption = () => {
    if (!results || results.results.length === 0) return null;
    
    const maxVotes = Math.max(...results.results);
    const winningIndex = results.results.findIndex(count => count === maxVotes);
    
    return {
      index: winningIndex,
      option: voting.options[winningIndex],
      votes: maxVotes,
    };
  };

  const winningOption = getWinningOption();
  const isCreator = userAddress && voting.creator.toLowerCase() === userAddress.toLowerCase();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">{t("voting.results")}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            {voting.title}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Voting Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Total Votes:</strong>
              <p className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {voting.totalVotes}
              </p>
            </div>
            <div>
              <strong>Status:</strong>
              <div className="mt-1">
                <Badge variant={voting.isActive ? "success" : "warning"}>
                  {voting.isActive ? t("voting.active") : t("voting.ended")}
                </Badge>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {!results ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <Eye className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium mb-2">Results Not Decrypted</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  Click the button below to make results public and decrypt them.
                </p>
                {voting.isActive && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800">
                    ⚠️ Note: Voting is still active. Results can only be decrypted after voting ends.
                  </div>
                )}
              </div>
              
              <Button
                onClick={handleDecrypt}
                disabled={isDecrypting}
                size="lg"
              >
                {isDecrypting ? (
                  <>
                    <div className="loading-spinner w-4 h-4 mr-2" />
                    Decrypting...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Decrypt Results
                  </>
                )}
              </Button>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800">
                🔒 Results are encrypted and will be decrypted using FHEVM technology.
                {isCreator ? (
                  <div className="mt-2 text-green-700 dark:text-green-300">
                    ✅ As the creator, you have default access to decrypt results.
                  </div>
                ) : (
                  <div className="mt-2">
                    This process will first make the results publicly decryptable, then decrypt them.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Winner Announcement */}
              {winningOption && (
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg dark:from-yellow-900 dark:to-orange-900 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Winning Option
                    </h3>
                  </div>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    <strong>{winningOption.option}</strong> with {winningOption.votes} votes
                  </p>
                </div>
              )}

              {/* Detailed Results */}
              <div>
                <h4 className="font-medium mb-3">Detailed Results:</h4>
                <div className="space-y-3">
                  {voting.options.map((option, index) => {
                    const votes = results.results[index] || 0;
                    const percentage = results.totalVotes > 0 
                      ? ((votes / results.totalVotes) * 100).toFixed(1)
                      : "0.0";
                    const isWinner = winningOption?.index === index;

                    return (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg ${
                          isWinner 
                            ? "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900" 
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{option}</span>
                            {isWinner && <Trophy className="w-4 h-4 text-yellow-600" />}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{votes} votes</div>
                            <div className="text-sm text-muted-foreground">{percentage}%</div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              isWinner 
                                ? "bg-yellow-500" 
                                : "bg-primary"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Total Votes:</strong>
                    <p>{results.totalVotes}</p>
                  </div>
                  <div>
                    <strong>Participation:</strong>
                    <p>{results.totalVotes} voters</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={onClose} variant="outline">
              {t("common.back")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
