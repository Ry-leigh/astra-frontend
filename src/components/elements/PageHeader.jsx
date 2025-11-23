export default function PageHeader({ title, children }) {
    return (
        <div className="flex w-full bg-white p-3 justify-between items-center rounded-lg text-nowrap">
            <p className="text-lg font-medium">{title}</p>
            {children}
        </div>
    )
}