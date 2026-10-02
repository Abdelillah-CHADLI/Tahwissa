import { PageHeader as SharedPageHeader } from '../../ui';
export default function PageHeader(props: { title: string; description: string }) { return <div className="mb-6"><SharedPageHeader {...props} /></div>; }
