import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BookingSummary } from '../../components/traveler/booking/BookingSummary';
import { BookingSuccessPage } from '../../components/traveler/booking/BookingSuccessPage';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService, getApiErrorMessage, tourService } from '../../services/api';
import defaultTourImage from '../../assets/imgs/tour1.jpeg';
import { Button, Notice, PageHeader, PageState } from '../../components/ui';

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

  if (loading || authLoading) return <div className="page-shell"><PageState kind="loading" title="Preparing your request" /></div>;
  if (success) return <BookingSuccessPage tourTitle={tour?.title} bookingRef={bookingRef} onNavigate={page => navigate(page === 'requests' ? '/traveler/requests' : '/traveler/explore')} />;

  return <div className="min-h-screen bg-canvas px-4 py-8 sm:px-6">
    <div className="mx-auto max-w-5xl">
      <button onClick={() => navigate(tourId ? `/traveler/details/${tourId}` : '/traveler/explore')} className="button button-quiet -ml-3 mb-4"><ArrowLeft size={18} /> Back to tour</button>
      <div className="mb-7"><PageHeader eyebrow="Booking request" title="Request this tour" description="The provider will review your request. No payment is collected here." /></div>
      {error && <div className="mb-5"><Notice tone="error">{error}</Notice></div>}
      {tour ? <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_340px]">
        <section className="panel panel-body h-fit">
          <h2 className="text-lg font-semibold text-brand-ink">Before you send</h2>
          <p className="mt-3 text-sm leading-6 text-muted">Your request will appear in My Requests with a pending status. The provider can confirm it there. You can cancel a pending request from your account.</p>
          {!user && <div className="mt-4"><Notice>You will be asked to sign in before sending the request.</Notice></div>}
          <Button onClick={() => void sendRequest()} busy={submitting} className="mt-6 w-full sm:w-auto">{submitting ? 'Sending request…' : user ? 'Send booking request' : 'Sign in to request'}</Button>
        </section>
        <BookingSummary {...tour} />
      </div> : !error && <PageState title="Tour unavailable" description="Choose another tour to make a request." action={<Button onClick={() => navigate('/traveler/explore')}>Explore tours</Button>} />}
    </div>
  </div>;
}
