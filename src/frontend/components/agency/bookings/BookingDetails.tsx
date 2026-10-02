import { Button, Dialog, StatusBadge, Notice } from '../../ui';
type Booking = { id: string; customerName: string; email: string; phone: string; tour: string; date: string; people: number; totalPrice: number; status: 'confirmed' | 'pending' | 'cancelled'; bookedOn: string };

export function BookingDetails({ booking, onClose, onConfirmBooking, onCancelBooking, busy = false, error }: {
  booking: Booking; onClose: () => void; onConfirmBooking?: (id: string) => void; onCancelBooking?: (id: string) => void; busy?: boolean; error?: string;
}) {
  return <Dialog open onClose={onClose} busy={busy} title="Booking details" description={`Reference ${booking.id}`} wide footer={booking.status === 'pending' ? <><Button variant="secondary" disabled={busy} onClick={() => onCancelBooking?.(booking.id)}>Cancel booking</Button><Button busy={busy} onClick={() => onConfirmBooking?.(booking.id)}>Confirm booking</Button></> : <Button variant="secondary" onClick={onClose}>Done</Button>}>
    <div className="space-y-6">
      {error && <Notice tone="error">{error}</Notice>}
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs text-gray-500">Tour</p><h3 className="mt-1 text-lg font-semibold text-brand-ink">{booking.tour}</h3></div><StatusBadge status={booking.status} /></div>
      <section className="form-section"><h3 className="form-section-title mb-4">Traveler</h3><dl className="grid gap-4 text-sm sm:grid-cols-2">{[['Name', booking.customerName], ['Email', booking.email], ['Phone', booking.phone || 'Not provided'], ['Travelers', booking.people]].map(([label, value]) => <div key={label}><dt className="text-xs text-gray-500">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}</dl></section>
      <dl className="grid gap-4 text-sm sm:grid-cols-2">{[['Departure', booking.date], ['Booked on', booking.bookedOn], ['Booking value', `${booking.totalPrice.toLocaleString()} DZD`]].map(([label, value]) => <div key={label}><dt className="text-xs text-gray-500">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}</dl>
      <p className="rounded-lg bg-brand-soft p-3 text-xs leading-5 text-brand-ink">Booking status tracks the reservation. Payment is arranged directly with the provider.</p>
    </div>
  </Dialog>;
}
