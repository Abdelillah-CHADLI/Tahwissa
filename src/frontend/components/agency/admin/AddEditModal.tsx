import { useId, useState, type FormEvent } from 'react';
import type { Employee } from '../../../types/employee';
import { Button, Dialog, Notice } from '../../ui';

export function AddEditModal({ employee, isOpen, onClose, onSave, busy = false, error }: {
  employee?: Employee | null; isOpen: boolean; onClose: () => void;
  onSave: (employee: Omit<Employee, 'employee_id'>) => void; busy?: boolean; error?: string | null;
}) {
  const id = useId();
  const list = (value: string | string[] | null | undefined) => Array.isArray(value) ? value.join(', ') : value || '';
  const [form, setForm] = useState({ full_name: employee?.full_name || '', email: employee?.users.email || '', phone: employee?.phone || '', role: employee?.role || '', location: employee?.location || '', experience: employee?.experience || '', languages: list(employee?.languages), specialization: list(employee?.specialization), status: employee?.status || 'active' });
  function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    onSave({ ...form, languages: form.languages.split(',').map(s => s.trim()).filter(Boolean), specialization: form.specialization.split(',').map(s => s.trim()).filter(Boolean), users: { email: form.email, role: form.role } });
  }
  const fields = [
    ['full_name', 'Full name', 'text', true], ['email', 'Email address', 'email', true],
    ['phone', 'Phone number', 'tel', true], ['role', 'Role', 'text', false],
    ['location', 'Location', 'text', true], ['experience', 'Experience', 'text', true],
    ['languages', 'Languages', 'text', false], ['specialization', 'Specializations', 'text', false],
  ] as const;
  return <Dialog open={isOpen} onClose={onClose} busy={busy} wide title={employee ? 'Edit team member' : 'Add a team member'} description="Keep your team’s contact details and expertise together.">
    <form onSubmit={submit} className="space-y-5">
      {error && <Notice tone="error">{error}</Notice>}
      <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
        {fields.map(([key, label, type, required]) => <div key={key}><label className="field-label mb-1.5" htmlFor={`${id}-${key}`}>{label}{required && <span className="text-brand"> *</span>}</label><input id={`${id}-${key}`} className="field" type={type} required={required} readOnly={key === 'email' && !!employee} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />{['languages', 'specialization'].includes(key) && <p className="field-hint">Separate entries with commas.</p>}{key === 'email' && employee && <p className="field-hint">The sign-in email cannot be changed here.</p>}</div>)}
        <div><label className="field-label mb-1.5" htmlFor={`${id}-status`}>Status</label><select id={`${id}-status`} className="field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
      </fieldset>
      <div className="flex justify-end gap-2 border-t border-line pt-4"><Button variant="secondary" disabled={busy} onClick={onClose}>Cancel</Button><Button type="submit" busy={busy}>{employee ? 'Save changes' : 'Add team member'}</Button></div>
    </form>
  </Dialog>;
}
