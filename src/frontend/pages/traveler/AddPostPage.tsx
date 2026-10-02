import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PostComposer } from '../../components/community/PostComposer';
import { PageHeader } from '../../components/ui';

export default function AddPostPage() {
  const navigate = useNavigate();
  return <div className="page-shell max-w-3xl space-y-6">
    <Link to="/traveler/community" className="button button-quiet -ml-3"><ArrowLeft size={16} />Back to community</Link>
    <PageHeader eyebrow="Traveler stories" title="Share your journey" description="Help fellow travelers discover Algeria through your experience." />
    <section className="panel panel-body"><PostComposer onCreated={() => navigate('/traveler/community', { state: { published: true } })} onCancel={() => navigate('/traveler/community')} /></section>
  </div>;
}
