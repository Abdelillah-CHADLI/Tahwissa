import ProviderCard, { type ProviderCardData } from './ProviderCard';

export default function AgencyCard({ agency, onViewProfile }: { agency: ProviderCardData; index: number; onViewProfile: () => void }) {
  return <ProviderCard provider={agency} kind="agency" onViewProfile={onViewProfile} />;
}
