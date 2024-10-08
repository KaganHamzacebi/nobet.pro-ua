'use client';

import { removeQueryParam } from '@/libs/helpers/remove-query-param';
import { notificationMap } from '@/libs/mock/notification-map.data';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function NotificationCenter() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    Object.entries(notificationMap).forEach(([key, { handler, title, message }]) => {
      const paramContent = params.get(key);
      if (paramContent) {
        const notificationMessage = paramContent !== 'true' ? paramContent : message;
        handler({ title, message: notificationMessage });
        removeQueryParam(key, router, params);
      }
    });
  }, [params, router]);

  return null;
}
