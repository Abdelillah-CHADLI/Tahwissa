interface EmptyStateProps {
    message?: string;
}

export function EmptyState({ message = "No bookings found" }: EmptyStateProps) {
    return (
        <tr>
            <td colSpan={8} className="text-center p-8 text-gray-500">
                {message}
            </td>
        </tr>
    );
}