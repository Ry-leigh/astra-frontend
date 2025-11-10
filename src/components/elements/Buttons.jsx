export function PrimaryButton ({ children }) {
    return (
        <button className="flex h-fit w-fit px-4 py-2 rounded-md bg-blue-400 text-white text-sm font-medium hover:bg-blue-500">
            {children}
        </button>
    )
}

export function PrimaryButtonOutlined ({ children }) {
    return (
        <button className="flex h-fit w-fit px-4 py-2 border rounded-md border-blue-400 text-blue-400 text-sm font-medium hover:bg-blue-50">
            {children}
        </button>
    )
}

export function SecondaryButton ({ children }) {
    return (
        <button className="flex h-fit w-fit px-4 py-2 rounded-md bg-violet-700 text-white text-sm font-medium hover:bg-violet-800">
            {children}
        </button>
    )
}

export function SecondaryButtonOutlined ({ children }) {
    return (
        <button className="flex h-fit w-fit px-4 py-2 border rounded-md border-violet-700 text-violet-700 text-sm font-medium hover:bg-violet-50">
            {children}
        </button>
    )
}