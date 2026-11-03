import { notFound } from "next/navigation";
import { AgentRunner } from "@/components/cofounder/AgentRunner";
import { AGENTS, agentById } from "@/lib/agents";

export function generateStaticParams() {
  return AGENTS.map((a) => ({ id: a.id }));
}

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = agentById(id);
  if (!agent) notFound();
  return <AgentRunner agentId={agent.id} />;
}
