type PageHeaderProps = {
    title: string;
    description: string;
}

function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

export default PageHeader;