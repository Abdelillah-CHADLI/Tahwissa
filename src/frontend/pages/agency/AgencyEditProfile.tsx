import { useEffect, useState, type ChangeEvent } from 'react';
import { AlertCircle, Loader2, Save, Upload } from 'lucide-react';
import api, { getApiErrorMessage, profileService } from '../../services/api';
import { getCurrentAgencyUuid, getCurrentProfileType } from '../../utils/session';

type ProfileForm = { name: string; phone: string; email: string; location: string; description: string };
const emptyForm: ProfileForm = { name: '', phone: '', email: '', location: '', description: '' };

export function AgencyEditProfile() {
  const profileId = getCurrentAgencyUuid();
  const profileType = getCurrentProfileType();
  const isAgency = profileType === 'agency';
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!profileId || !profileType) {
        setError('Please sign in to edit your profile.');
        setLoading(false);
        return;
      }
      try {
        const result = await profileService.getProfile(profileId, profileType);
        const profile = result.data || result.profile;
        if (!active) return;
        setForm({
          name: profile.agency_name || profile.guide_name || '',
          phone: profile.phone_number || '',
          email: profile.support_email || '',
          location: profile.main_office_location || profile.main_location || '',
          description: profile.agency_description || profile.guide_description || '',
        });
        setLogo(profile.agency_logo || null);
      } catch (err) {
        if (active) setError(getApiErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [profileId, profileType]);

  function change(field: keyof ProfileForm, value: string) {
    setForm(previous => ({ ...previous, [field]: value }));
  }

  function chooseLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogo(URL.createObjectURL(file));
  }

  async function save() {
    if (!profileId || !profileType) return;
    if (!form.name.trim()) {
      setError('A profile name is required.');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const data = isAgency ? {
        agency_name: form.name.trim(), phone_number: form.phone.trim(),
        support_email: form.email.trim(), main_office_location: form.location.trim(),
        agency_description: form.description.trim(),
      } : {
        guide_name: form.name.trim(), phone_number: form.phone.trim(),
        support_email: form.email.trim(), main_location: form.location.trim(),
        guide_description: form.description.trim(),
      };
      await profileService.updateProfile(profileId, data, profileType);
      if (isAgency && logoFile) {
        const body = new FormData();
        body.append('logo', logoFile);
        const response = await api.post(`/profile1/agency/${profileId}/logo`, body);
        setLogo(response.data?.data?.agency_logo || logo);
        setLogoFile(null);
      }
      setSuccess(true);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex min-h-64 items-center justify-center text-teal-800"><Loader2 className="mr-2 animate-spin" /> Loading profile...</div>;

  const fields: { key: keyof ProfileForm; label: string; type?: string; required?: boolean }[] = [
    { key: 'name', label: isAgency ? 'Agency name' : 'Guide name', required: true },
    { key: 'phone', label: 'Phone number', type: 'tel' },
    { key: 'email', label: 'Support email', type: 'email' },
    { key: 'location', label: isAgency ? 'Main office location' : 'Main location' },
  ];

  return (
    <main className="min-h-screen bg-[#f5f8f7] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#173f3d] sm:text-3xl">Edit {isAgency ? 'agency' : 'guide'} profile</h1>
          <p className="mt-1 text-sm text-slate-600">Keep the details travelers see on your profile up to date.</p>
        </div>
        {error && <p role="alert" className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle size={18} />{error}</p>}
        {success && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">Profile updated successfully.</p>}
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          {isAgency && <div className="flex flex-wrap items-center gap-4">
            {logo ? <img src={logo} alt="Agency logo" className="h-20 w-20 rounded-full object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-700 text-2xl font-bold text-white">{form.name.slice(0, 2).toUpperCase() || 'AG'}</div>}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-teal-200 px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-50">
              <Upload size={16} /> Choose logo
              <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseLogo} />
            </label>
          </div>}
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map(field => <label key={field.key} className="block text-sm font-medium text-slate-700">
              {field.label}
              <input type={field.type || 'text'} required={field.required} value={form[field.key]} onChange={event => change(field.key, event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
            </label>)}
          </div>
          <label className="block text-sm font-medium text-slate-700">
            About {isAgency ? 'the agency' : 'you'}
            <textarea rows={6} value={form.description} onChange={event => change('description', event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
          </label>
          <div className="flex justify-end">
            <button onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 font-medium text-white hover:bg-teal-800 disabled:opacity-60">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}{saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
