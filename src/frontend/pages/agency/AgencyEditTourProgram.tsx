import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { tourService, getApiErrorMessage } from '../../services/api';
import { getCurrentAgencyUuid, getCurrentProfileType } from '../../utils/session';

type TourForm = {
  tour_title: string; location: string; price: string; start_date: string;
  category: string; duration: string; group_size: string;
};

export function AgencyEditTourProgram() {
  const navigate = useNavigate();
  const { tourId } = useParams();
  const [form, setForm] = useState<TourForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        if (!tourId) throw new Error('Missing tour ID.');
        const profileId = getCurrentAgencyUuid();
        const profileType = getCurrentProfileType();
        if (!profileId || !profileType) throw new Error('Please sign in to edit this tour.');
        const tour = await tourService.getTourById(tourId);
        if (!tour) throw new Error('Tour not found.');
        const ownerId = profileType === 'guide' ? tour.guide_id : tour.agency_id;
        if (String(ownerId) !== profileId) throw new Error('This tour belongs to another provider.');
        if (active) setForm({
          tour_title: String(tour.tour_title ?? ''), location: String(tour.location ?? ''),
          price: String(tour.price ?? ''), start_date: String(tour.start_date ?? '').slice(0, 10),
          category: String(tour.category ?? ''), duration: String(tour.duration ?? ''),
          group_size: String(tour.group_size ?? ''),
        });
      } catch (err) {
        if (active) setError(getApiErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [tourId]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form || !tourId) return;
    const price = Number(form.price);
    if (!form.tour_title.trim() || !form.location.trim() || !form.start_date || !Number.isFinite(price) || price < 0) {
      setError('Add a title, location, valid date, and non-negative price.');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await tourService.updateTour(tourId, {
        ...form, tour_title: form.tour_title.trim(), location: form.location.trim(), price,
      });
      navigate('/agency/tour-programs');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <button type="button" onClick={() => navigate('/agency/tour-programs')} className="inline-flex items-center gap-2 text-sm font-medium text-[#348086] hover:underline">
        <ArrowLeft size={16} /> Tour programs
      </button>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#348086]">Manage itinerary</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Edit tour</h1>
        <p className="mt-2 text-sm text-slate-600">Update the essentials visitors see before booking.</p>
      </div>
      {loading ? <p className="rounded-2xl bg-white p-6 text-slate-600">Loading tour…</p> : null}
      {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}
      {form && !loading ? (
        <form onSubmit={save} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {([
              ['tour_title', 'Tour title', 'text'], ['location', 'Location', 'text'],
              ['price', 'Price (DZD)', 'number'], ['start_date', 'Start date', 'date'],
              ['category', 'Category', 'text'], ['duration', 'Duration', 'text'],
              ['group_size', 'Group size', 'text'],
            ] as const).map(([field, label, type]) => (
              <label key={field} className="block text-sm font-medium text-slate-700">
                {label}
                <input type={type} value={form[field]}
                  onChange={event => setForm(current => current ? { ...current, [field]: event.target.value } : current)}
                  required={['tour_title', 'location', 'price', 'start_date'].includes(field)}
                  min={type === 'number' ? 0 : undefined}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#348086] focus:ring-2 focus:ring-[#348086]/15" />
              </label>
            ))}
          </div>
          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#348086] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#28676d] disabled:opacity-60">
              <Save size={16} /> {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
