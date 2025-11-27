type SortSelectProps = {
    value: string;
    onChange: (value: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
        >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
        </select>
    );
}