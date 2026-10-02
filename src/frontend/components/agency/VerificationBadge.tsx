import { CheckCircle } from "lucide-react";

interface VerificationBadgeProps {
    verified: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function VerificationBadge({ verified, size = 'md' }: VerificationBadgeProps) {
    if (!verified) return null;

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
        lg: 'text-base px-3 py-1.5'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    return (
        <div className={`inline-flex items-center gap-1.5 bg-brand-soft text-brand-dark rounded-full font-medium ${sizeClasses[size]}`}>
            <CheckCircle className={`${iconSizes[size]} fill-blue-700 text-white`} />
            <span>Verified</span>
        </div>
    );
}
