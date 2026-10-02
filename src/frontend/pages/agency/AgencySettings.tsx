import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LockKeyhole, UserRound } from 'lucide-react';
import api, { getApiErrorMessage } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export function AgencySettings() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (newPassword.length < 8) return setError('Use at least 8 characters for your new password.');
    if (newPassword !== confirmPassword) return setError('The new passwords do not match.');
    try {
      setBusy(true);
      await api.post('/auth/changePass', { currentPassword, newPassword, confirmPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Password updated.');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#348086]">Your account</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-slate-600">Manage your public profile and sign-in details.</p>
      </div>
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-[#e3f1e9] p-2.5 text-[#348086]"><UserRound size={21} /></span>
          <div>
            <h2 className="font-semibold text-slate-900">Public profile</h2>
            <p className="mt-1 text-sm text-slate-600">{user?.email || 'Signed in'} · Edit your name, description, and contact details.</p>
          </div>
        </div>
        <Link to="/agency/profile" className="inline-flex shrink-0 justify-center rounded-xl border border-[#348086] px-4 py-2.5 text-sm font-semibold text-[#348086] hover:bg-[#f2f9f5]">Edit profile</Link>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <span className="rounded-xl bg-[#e3f1e9] p-2.5 text-[#348086]"><LockKeyhole size={21} /></span>
          <div>
            <h2 className="font-semibold text-slate-900">Change password</h2>
            <p className="mt-1 text-sm text-slate-600">Use a unique password for this account.</p>
          </div>
        </div>
        <form onSubmit={changePassword} className="space-y-4">
          {([
            ['Current password', currentPassword, setCurrentPassword],
            ['New password', newPassword, setNewPassword],
            ['Confirm new password', confirmPassword, setConfirmPassword],
          ] as const).map(([label, value, setter]) => (
            <label key={label} className="block text-sm font-medium text-slate-700">
              {label}
              <input type="password" required value={value} onChange={event => setter(event.target.value)}
                autoComplete={label === 'Current password' ? 'current-password' : 'new-password'}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-[#348086] focus:ring-2 focus:ring-[#348086]/15" />
            </label>
          ))}
          {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
          {message ? <p role="status" className="text-sm text-[#28676d]">{message}</p> : null}
          <button type="submit" disabled={busy} className="min-h-11 rounded-xl bg-[#348086] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#28676d] disabled:opacity-60">
            {busy ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </section>
    </div>
  );
}
