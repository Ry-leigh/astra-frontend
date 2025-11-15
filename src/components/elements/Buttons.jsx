import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';

export function PrimaryButton ({ children }) {
    return (
        <button className="flex w-fit h-fit px-4 py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-sm font-medium hover:bg-blue-500">
            {children}
        </button>
    )
}

export function PrimaryButtonOutlined ({ children }) {
    return (
        <button className="flex h-fit w-fit px-4 py-2 border rounded-md gap-2 items-center border-blue-400 text-blue-400 text-sm font-medium hover:bg-blue-50">
            {children}
        </button>
    )
}

export function SecondaryButton ({ children }) {
    return (
        <button className="flex h-fit w-fit px-4 py-2 rounded-md gap-2 items-center bg-violet-700 text-white text-sm font-medium hover:bg-violet-800">
            {children}
        </button>
    )
}

export function SecondaryButtonOutlined ({ children }) {
    return (
        <button className="flex h-fit w-fit px-4 py-2 border rounded-md gap-2 items-center border-violet-700 text-violet-700 text-sm font-medium hover:bg-violet-50">
            {children}
        </button>
    )
}

export function EditButton ({ size = 'inherit' }) {
    return (
        <button className="inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-gray-200 transition">
            <EditOutlinedIcon fontSize={size}/>
        </button>
    )
}

export function DeleteButton ({ size = 'inherit' }) {
    return (
        <button className="inline-flex items-center justify-center rounded-md p-2 text-red-600 hover:bg-red-100 transition">
            <IndeterminateCheckBoxOutlinedIcon fontSize={size}/>
        </button>
    )
}