'use client';

import { useState } from 'react';
import { submitVote } from '@/app/lib/actions/poll-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define the types for the poll and vote
interface Vote {
  id: string;
  option: string;
  poll_id: string;
  user_id: string;
}

interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: Vote[];
  user_id: string;
}

export default function PollDetailClient({ poll: initialPoll }: { poll: Poll }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [poll, setPoll] = useState<Poll>(initialPoll);

  const handleVote = async () => {
    if (selectedOption) {
      try {
        const updatedPoll = await submitVote(poll.id, selectedOption);
        setPoll(updatedPoll);
      } catch (error) {
        console.error('Error submitting vote:', error);
      }
    }
  };

  const voteCounts = poll.options.map(option => ({
    name: option,
    value: poll.votes.filter(vote => vote.option === option).length,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{poll.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup onValueChange={setSelectedOption}>
            {poll.options.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <Button onClick={handleVote} disabled={!selectedOption} className="mt-4">
            Vote
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={voteCounts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {voteCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}