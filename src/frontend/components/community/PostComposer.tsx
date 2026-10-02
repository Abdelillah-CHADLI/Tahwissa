import { useEffect, useId, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Button, Notice, PageState } from '../ui';

export function PostComposer({ onCreated, onCancel }: { onCreated: () => void; onCancel?: () => void }) {
  const { user } = useAuth();
  const id = useId();
  const [draft, setDraft] = useState({ title: '', text: '', location: '', stars: '5' });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  if (!user) return <PageState title="Your next story starts here" description="Sign in to share a travel experience with the Tahwissa community." action={<Link className="button button-primary" to="/traveler/signin">Sign in to post</Link>} />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy || !draft.title.trim() || !draft.text.trim()) return;
    setBusy(true); setError('');
    try {
      const data = new FormData();
      Object.entries(draft).forEach(([key, value]) => data.append(key, value.trim()));
      data.append('traveller_id', String(user!.profileId || user!.id));
      if (file) data.append('images', file);
      const response = await api.post('/pst/posts', data);
      if (!response.data.success) throw new Error('Post was not saved');
      onCreated();
    } catch {
      setError('Your story could not be published. Your draft is still here; please try again.');
    } finally { setBusy(false); }
  }

  return <form onSubmit={submit} className="space-y-5">
    {error && <Notice tone="error">{error}</Notice>}
    <fieldset disabled={busy} className="space-y-5">
      <div><label className="field-label" htmlFor={`${id}-title`}>Story title <span className="text-gray-400">(required)</span></label><input id={`${id}-title`} className="field" placeholder="A weekend in the Aurès mountains" required maxLength={180} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="field-label" htmlFor={`${id}-location`}>Location <span className="text-gray-400">(optional)</span></label><input id={`${id}-location`} className="field" placeholder="City or region" maxLength={160} value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })} /></div>
        <div><label className="field-label" htmlFor={`${id}-rating`}>Your experience</label><select id={`${id}-rating`} className="field" value={draft.stars} onChange={e => setDraft({ ...draft, stars: e.target.value })}>{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} out of 5 stars</option>)}</select></div>
      </div>
      <div><label className="field-label" htmlFor={`${id}-story`}>Your story <span className="text-gray-400">(required)</span></label><textarea id={`${id}-story`} className="field min-h-36 resize-y" placeholder="What made this trip memorable? Share places, tips, and moments worth discovering." required rows={5} value={draft.text} onChange={e => setDraft({ ...draft, text: e.target.value })} /></div>
      <div className="rounded-lg border border-dashed border-line bg-canvas p-4">
        <label className="field-label flex items-center gap-2" htmlFor={`${id}-photo`}><ImagePlus size={17} />Add a photo <span className="font-normal text-gray-400">(optional)</span></label>
        <input id={`${id}-photo`} type="file" accept="image/png,image/jpeg,image/webp" className="block w-full min-w-0 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-soft file:px-3 file:py-2 file:text-brand" onChange={e => {
          const next = e.target.files?.[0];
          if (next && (!['image/jpeg', 'image/png', 'image/webp'].includes(next.type) || next.size > 5 * 1024 * 1024)) { setError('Choose a JPG, PNG, or WebP image under 5 MB.'); e.target.value = ''; return; }
          setError(''); setFile(next || null); setPreview(next ? URL.createObjectURL(next) : '');
        }} />
        <p className="field-hint">JPG, PNG, or WebP · up to 5 MB</p>
        {file && preview && <img src={preview} alt="Preview of your selected photo" className="mt-4 max-h-64 w-full rounded-lg object-contain" />}
      </div>
    </fieldset>
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4"><p className="text-xs text-gray-500">Your story will be visible to everyone.</p><div className="flex gap-2">{onCancel && <Button variant="secondary" disabled={busy} onClick={onCancel}>Cancel</Button>}<Button type="submit" busy={busy}>Publish story</Button></div></div>
  </form>;
}
