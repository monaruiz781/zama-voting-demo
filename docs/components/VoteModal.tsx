"use client";

import { useState } from "react";
import { VotingInfo } from "@/hooks/useVotingSystem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/app/providers";
import { Vote, X, Check } from "lucide-react";

interface VoteModalProps {
  voting: VotingInfo;
  isOpen: boolean;
  onClose: () => void;
  onVote: (votingId: number, optionIndex: number) => Promise<void>;
  isLoading?: boolean;
}

export function VoteModal({ voting, isOpen, onClose, onVote, isLoading = false }: VoteModalProps) {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (selectedOption === null) return;

    try {
      setIsSubmitting(true);
      await onVote(voting.id, selectedOption);
      onClose();
      setSelectedOption(null);
    } catch (error) {
      console.error("Failed to vote:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSelectedOption(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">{t("voting.vote")}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            {voting.title}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Voting Description */}
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">{voting.description}</p>
          </div>

          {/* Options */}
          <div>
            <h4 className="font-medium text-sm mb-3">{t("form.options")}:</h4>
            <div className="space-y-2">
              {voting.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedOption(index)}
                  disabled={isSubmitting}
                  className={`w-full p-4 text-left border rounded-lg transition-all duration-200 ${
                    selectedOption === index
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-accent"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{option}</div>
                      <div className="text-xs text-muted-foreground">
                        {t("form.options")} {index + 1}
                      </div>
                    </div>
                    {selectedOption === index && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800">
            🔒 Your vote will be encrypted using FHEVM technology. Your choice will remain completely private and anonymous.
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedOption === null || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner w-4 h-4 mr-2" />
                  Voting...
                </>
              ) : (
                <>
                  <Vote className="w-4 h-4 mr-2" />
                  {t("voting.vote")}
                </>
              )}
            </Button>
          </div>

          {/* Selected Option Confirmation */}
          {selectedOption !== null && !isSubmitting && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 dark:bg-green-900 dark:text-green-300 dark:border-green-800">
              ✅ Selected: {voting.options[selectedOption]}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
