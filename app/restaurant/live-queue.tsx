import { LiveQueueTrackingView } from '@/components/live-queue-tracking-view';
import { useLocalSearchParams } from 'expo-router';
import * as React from 'react';

export default function LiveQueueRoute() {
  const params = useLocalSearchParams<{ id?: string }>();

  return <LiveQueueTrackingView restaurantId={params.id} isModal={false} />;
}
