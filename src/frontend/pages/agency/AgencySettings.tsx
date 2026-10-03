import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LockKeyhole, UserRound } from 'lucide-react';
import api, { getApiErrorMessage } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Notice, PageHeader } from '../../components/ui';

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
      <PageHeader eyebrow="Your account" title="Settings" description="Manage your public profile and sign-in details." />
      <section className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <UserRound size={21} className="mt-1 shrink-0 text-brand" aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-slate-900">Public profile</h2>
            <p className="mt-1 text-sm text-slate-600">{user?.email || 'Signed in'} · Edit your name, description, and contact details.</p>
          </div>
        </div>
        <Link to="/agency/profile" className="button button-secondary shrink-0">Edit profile</Link>
      </section>
      <section className="panel p-5 sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <LockKeyhole size={21} className="mt-1 shrink-0 text-brand" aria-hidden="true" />
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
            <label key={label} className="field-label">
              {label}
              <input type="password" required value={value} onChange={event => setter(event.target.value)}
                autoComplete={label === 'Current password' ? 'current-password' : 'new-password'}
                className="field mt-2" />
            </label>
          ))}
          {error ? <Notice tone="error">{error}</Notice> : null}
          {message ? <Notice tone="success">{message}</Notice> : null}
          <Button type="submit" busy={busy}>{busy ? 'Updating…' : 'Update password'}</Button>
        </form>
      </section>
    </div>
  );
}
