"use client";

import { VotingInfo, VotingStatus } from "@/hooks/useVotingSystem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatTime, formatTimeRemaining, truncateAddress, getVotingStatusColor } from "@/lib/utils";
import { useLanguage } from "@/app/providers";
import { Clock, Users, User, Lock, Globe } from "lucide-react";

interface VotingCardProps {
  voting: VotingInfo;
  status: VotingStatus;
  onVote?: (votingId: number) => void;
  onViewResults?: (votingId: number) => void;
  onEndVoting?: (votingId: number) => void;
  canVote?: boolean;
  hasVoted?: boolean;
  isCreator?: boolean;
  isAdmin?: boolean;
}

export function VotingCard({
  voting,
  status,
  onVote,
  onViewResults,
  onEndVoting,
  canVote = false,
  hasVoted = false,
  isCreator = false,
  isAdmin = false,
}: VotingCardProps) {
  const { t } = useLanguage();

  const getStatusBadge = () => {
    const statusText = t(`voting.${status}`);
    let variant: "success" | "warning" | "info" = "info";
    
    switch (status) {
      case "active":
        variant = "success";
        break;
      case "ended":
        variant = "warning";
        break;
      case "upcoming":
        variant = "info";
        break;
    }

    return <Badge variant={variant}>{statusText}</Badge>;
  };

  const canShowVoteButton = status === "active" && canVote && !hasVoted;
  const canShowEndButton = status === "active" && (isCreator || isAdmin);
  const canShowResults = status === "ended" || hasVoted;

  return (
    <Card className="voting-card hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{voting.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {voting.description}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge()}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {voting.isPublic ? (
                <>
                  <Globe className="w-3 h-3" />
                  <span>{t("voting.public")}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  <span>{t("voting.private")}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Voting Options */}
          <div>
            <h4 className="font-medium text-sm mb-2">{t("form.options")}:</h4>
            <div className="grid gap-2">
              {voting.options.map((option, index) => (
                <div
                  key={index}
                  className="p-2 bg-muted rounded-md text-sm"
                >
                  {index + 1}. {option}
                </div>
              ))}
            </div>
          </div>

          {/* Voting Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{t("voting.total_votes")}: {voting.totalVotes}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{t("voting.created_by")}: {truncateAddress(voting.creator)}</span>
            </div>
          </div>

          {/* Time Information */}
          <div className="space-y-2 text-sm">
            {status === "upcoming" && (
              <div className="flex items-center gap-2 text-blue-600">
                <Clock className="w-4 h-4" />
                <span>{t("voting.starts_at")}: {formatTime(voting.startTime)}</span>
              </div>
            )}
            
            {status === "active" && (
              <div className="flex items-center gap-2 text-green-600">
                <Clock className="w-4 h-4" />
                <span>{t("voting.time_left")}: {formatTimeRemaining(voting.endTime)}</span>
              </div>
            )}
            
            {status === "ended" && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{t("voting.ends_at")}: {formatTime(voting.endTime)}</span>
              </div>
            )}
          </div>

          {/* Voting Status Messages */}
          {hasVoted && status === "active" && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
              ✅ {t("msg.already_voted")}
            </div>
          )}

          {!canVote && status === "active" && !hasVoted && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
              ⚠️ {t("msg.not_authorized")}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {canShowVoteButton && (
              <Button
                onClick={() => onVote?.(voting.id)}
                className="flex-1"
                size="sm"
              >
                {t("voting.vote")}
              </Button>
            )}
            
            {status === "active" && !canVote && !hasVoted && (
              <Button
                disabled
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Connect Wallet to Vote
              </Button>
            )}

            {canShowResults && (
              <Button
                onClick={() => onViewResults?.(voting.id)}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                {t("voting.results")}
              </Button>
            )}

            {canShowEndButton && (
              <Button
                onClick={() => onEndVoting?.(voting.id)}
                variant="destructive"
                size="sm"
              >
                {t("common.end")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
