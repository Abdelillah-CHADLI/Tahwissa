import { Link } from 'react-router-dom';
import { PageState } from '../../ui';
export default function EmptyState({ activeTab }: { activeTab: string }) { return <PageState title={activeTab === 'all' ? 'Your next trip is waiting' : 'No '+activeTab+' requests'} description="Explore Algeria’s tours and send a request when you find your next adventure." action={<Link className="button button-primary" to="/traveler/explore">Explore tours</Link>} />; }
