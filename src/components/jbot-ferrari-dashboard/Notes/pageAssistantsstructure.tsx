// pages/assistants/[id].tsx
'use client';

import { useParams } from 'next/navigation';
import { assistants } from '@/lib/data/assistants';
import AssistantHeader from '@/components/AssistantHeader';
import AssistantStats from '@/components/AssistantStats';
import CloneThinktank from '@/components/CloneThinktank';
import AskBox from '@/components/AskBox';
import SponsorButton from '@/components/SponsorButton';

export default function AssistantProfilePage() {
  const { id } = useParams();
  const assistant = assistants[id as keyof typeof assistants];

  if (!assistant) {
    return <div className="text-center text-gray-400 py-20">Assistant not found.</div>;
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-10 px-4">
      <AssistantHeader assistant={assistant} />
      <section className="mt-10">
        <AssistantStats assistant={assistant} />
      </section>
      <section className="mt-10">
        <CloneThinktank assistant={assistant} />
      </section>
      <section className="mt-10">
        <AskBox assistantId={id} />
      </section>
      <section className="mt-10">
        <SponsorButton assistant={assistant} />
      </section>
    </main>
  );
}
