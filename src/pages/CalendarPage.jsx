import Layout from "@/components/layout/Layout";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect ,useState } from "react";
import Calendar from "@/components/elements/Calendar";

export default function CalendarPage() {
    const [role, setRole] = useState();
    const { user } = useAuth();

    useEffect(() => {
        setRole(user.roles[0].name);
    },[])

    return (
        <Layout>
            <div className="flex flex-col w-full gap-6">
                <div className="flex w-full bg-white p-3 content-center rounded-lg text-nowrap">
                    <p className="text-lg font-medium">Calendar</p>
                    <div className="w-full" />
                </div>
                <div className="flex flex-col w-full bg-white pt-3 px-3 content-center rounded-lg text-nowrap">
                    
                    <Calendar />
                </div>
            </div>
        </Layout>
    );
}
