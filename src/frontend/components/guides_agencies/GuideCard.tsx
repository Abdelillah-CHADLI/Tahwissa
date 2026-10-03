import ProviderCard, { type ProviderCardData } from './ProviderCard';

export default function GuideCard({ guide, onViewProfile }: { guide: ProviderCardData; index: number; onViewProfile: () => void }) {
  return <ProviderCard provider={guide} kind="guide" onViewProfile={onViewProfile} />;
}
