export default function PageHeader({ children }) {
    return (
        <div className="flex w-full bg-white p-3 content-center rounded-lg text-nowrap">
            <p className="text-lg font-medium">{children}</p>
            <div className="w-full" />
        </div>
    )
}