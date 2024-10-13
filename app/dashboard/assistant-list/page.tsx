import AssistantDNDList from '@/components/ui/assistant-dnd-list/assistant-dnd-list';
import AssistantDNDListLoader from '@/components/ui/assistant-dnd-list/assistant-dnd-list-loader';
import { getAssistants } from '@/libs/db/actions/assistant-actions';
import { NotificationType } from '@/libs/enums/NotificationType';
import { getUser } from '@/libs/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function AssistantList() {
  const user = await getUser();
  if (!user) {
    redirect(`/${NotificationType.Unauthorized}=true`);
  }

  const assistantList = await getAssistants(user.id);

  return (
    <Suspense fallback={<AssistantDNDListLoader />}>
      <AssistantDNDList assistantList={assistantList} />
    </Suspense>
  );
}
