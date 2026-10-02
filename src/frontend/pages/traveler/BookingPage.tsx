import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { BookingSummary } from '../../components/traveler/booking/BookingSummary';
import { BookingSuccessPage } from '../../components/traveler/booking/BookingSuccessPage';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService, getApiErrorMessage, tourService } from '../../services/api';
import defaultTourImage from '../../assets/imgs/tour1.jpeg';

type Tour = { id: number; title: string; location: string; duration: string; price: number; image: string };

export function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tourId } = useParams<{ tourId: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!tourId) {
        setError('No tour was selected.');
        setLoading(false);
        return;
      }
      try {
        const data = location.state?.tourData || await tourService.getTourById(tourId);
        if (!active) return;
        if (!data) throw new Error('Tour not found.');
        setTour({
          id: Number(data.tour_id || data.id),
          title: String(data.tour_title || data.title),
          location: String(data.location || ''),
          duration: String(data.duration || ''),
          price: Number(data.price || 0),
          image: String(data.images?.[0] || data.image || defaultTourImage),
        });
      } catch (err) {
        if (active) setError(getApiErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [tourId, location.state]);

  async function sendRequest() {
    if (!tour || submitting) return;
    if (!user || user.userType !== 'traveller') {
      navigate('/traveler/signin', { state: { from: location.pathname } });
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await bookingService.createBooking({ traveller_id: user.id, tour_id: String(tour.id) });
      if (!response.success) throw new Error(response.error || 'Could not send your request.');
      const ref = response.data?.booking_id || response.data?.booking_ref;
      setBookingRef(ref ? String(ref) : undefined);
      setSuccess(true);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || authLoading) return <div className="flex min-h-64 items-center justify-center text-teal-700"><Loader2 className="animate-spin" /></div>;
  if (success) return <BookingSuccessPage tourTitle={tour?.title} bookingRef={bookingRef} onNavigate={page => navigate(page === 'requests' ? '/traveler/requests' : '/traveler/explore')} />;

  return <main className="min-h-screen bg-[#f5f8f7] px-4 py-8 sm:px-6">
    <div className="mx-auto max-w-5xl">
      <button onClick={() => navigate(tourId ? `/traveler/details/${tourId}` : '/traveler/explore')} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-teal-800 hover:underline"><ArrowLeft size={18} /> Back to tour</button>
      <h1 className="text-2xl font-bold text-[#173f3d] sm:text-3xl">Request this tour</h1>
      <p className="mb-7 mt-2 text-slate-600">The provider will review your request. No payment is collected here.</p>
      {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      {tour && <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-semibold text-[#173f3d]">Before you send</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Your request will appear in My Requests with a pending status. The provider can confirm it there. You can cancel a pending request from your account.</p>
          {!user && <p className="mt-4 rounded-lg bg-teal-50 p-3 text-sm text-teal-900">You will be asked to sign in before sending the request.</p>}
          <button onClick={() => void sendRequest()} disabled={submitting} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 disabled:opacity-60 sm:w-auto">
            {submitting && <Loader2 size={18} className="animate-spin" />}{submitting ? 'Sending request...' : user ? 'Send booking request' : 'Sign in to request'}
          </button>
        </section>
        <BookingSummary {...tour} />
      </div>}
    </div>
  </main>;
}
