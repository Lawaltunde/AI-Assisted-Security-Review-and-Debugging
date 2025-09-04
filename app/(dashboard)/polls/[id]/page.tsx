import { getPollById } from "@/app/lib/actions/poll-actions";
import PollDetailClient from "./PollDetailClient";

export default async function PollDetailPage({ params }: { params: { id: string } }) {
  const { poll, error } = await getPollById(params.id);

  if (error || !poll) {
    return <div>Poll not found</div>;
  }

  return <PollDetailClient poll={poll} />;
}
}