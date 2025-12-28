import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tourService, getApiErrorMessage } from '../../services/api';
import { getCurrentAgencyUuid } from '../../utils/session';

type Tour = Record<string, any>;

export function AgencyEditTourProgram() {
  const navigate = useNavigate();
  const { tourId } = useParams();

  const agencyId = useMemo(() => getCurrentAgencyUuid(), []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tour, setTour] = useState<Tour | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        if (!agencyId) {
          throw new Error('Agency account not detected. Please sign out and sign back in.');
        }
        if (!tourId) {
          throw new Error('Missing tour id');
        }

        const found = await tourService.getTourById(tourId);
        if (!found) throw new Error('Tour not found');

        // Guard: only allow editing own tours (agency)
        if (String(found.agency_id || '') !== String(agencyId)) {
          throw new Error("You don't have permission to edit this tour.");
        }

        if (alive) setTour(found);
      } catch (e) {
        if (alive) setError(getApiErrorMessage(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [agencyId, tourId]);

  const disabledReason = "This project doesn't expose a tour update endpoint yet (backend only has POST /api/tours).";

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-gray-600">Loading tour…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
          {error}
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/agency/tour-programs')}
            className="px-4 py-2 rounded bg-gray-900 text-white"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Tour</h1>
          <p className="text-sm text-gray-600">{tour?.tour_title || tour?.title || ''}</p>
        </div>
        <button
          onClick={() => navigate('/agency/tour-programs')}
          className="px-4 py-2 rounded bg-gray-100 text-gray-900 hover:bg-gray-200"
        >
          Back
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800">
        {disabledReason}
      </div>

      <div className="bg-white border border-gray-100 rounded p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={String(tour?.tour_title || '')}
              disabled
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={String(tour?.location || '')}
              disabled
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={String(tour?.price ?? '')}
              disabled
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start date</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={String(tour?.start_date || '')}
              disabled
              readOnly
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 cursor-not-allowed"
            disabled
            title={disabledReason}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
