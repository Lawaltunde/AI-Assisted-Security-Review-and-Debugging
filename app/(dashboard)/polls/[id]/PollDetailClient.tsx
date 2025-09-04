"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Poll } from "@/app/lib/types";
import { submitVote } from "@/app/lib/actions/poll-actions";
import VulnerableShare from "../vulnerable-share";

export default function PollDetailClient({ poll }: { poll: Poll }) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + (option.votes || 0),
    0,
  );

  const handleVote = async () => {
    if (selectedOption === null) return;

    setIsSubmitting(true);

    const { error } = await submitVote(poll.id, selectedOption);

    if (error) {
      // Handle error, e.g., show a toast notification
      console.error(error);
    } else {
      setHasVoted(true);
    }

    setIsSubmitting(false);
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/polls" className="text-blue-600 hover:underline">
          &larr; Back to Polls
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/polls/${poll.id}/edit`}>Edit Poll</Link>
          </Button>
          <Button variant="outline" className="text-red-500 hover:text-red-700">
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poll.question}</CardTitle>
          <CardDescription>{poll.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasVoted ? (
            <div className="space-y-3">
              {poll.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedOption === index
                      ? "border-blue-500 bg-blue-50"
                      : "hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedOption(index)}
                >
                  {option.text}
                </div>
              ))}
              <Button
                onClick={handleVote}
                disabled={selectedOption === null || isSubmitting}
                className="mt-4"
              >
                {isSubmitting ? "Submitting..." : "Submit Vote"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium">Results:</h3>
              {poll.options.map((option, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{option.text}</span>
                    <span>
                      {getPercentage(option.votes || 0)}% ({option.votes || 0}{" "}
                      votes)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${getPercentage(option.votes || 0)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="text-sm text-slate-500 pt-2">
                Total votes: {totalVotes}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-slate-500 flex justify-between">
          <span>Created by {poll.user_id}</span>
          <span>
            Created on {new Date(poll.created_at).toLocaleDateString()}
          </span>
        </CardFooter>
      </Card>

      <div className="pt-4">
        <VulnerableShare pollId={poll.id} pollTitle={poll.question} />
      </div>
    </div>
  );
}