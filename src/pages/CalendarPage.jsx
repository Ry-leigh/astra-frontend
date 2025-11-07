import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";

export default function CalendarPage() {
    return (
        <Layout>
            Calendar
            <div></div>
            <Link to={"/schedule"}>
                Schedule
            </Link>
        </Layout>
    );
}