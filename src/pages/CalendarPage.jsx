import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useEffect ,useState } from "react";
import PageHeader from "@/components/elements/PageHeader";
import { Navigation } from "@/components/elements/Calendar";
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
                <PageHeader>Calendar</PageHeader>
                <div className="flex flex-col w-full bg-white px-3 content-center rounded-lg text-nowrap">
                    <div className="flex flex-col pb-4 px-2">
                        <Navigation />
                        <Calendar />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
