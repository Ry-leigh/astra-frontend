import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";

export default function SchedulePage() {
    return(
        <Layout>
            <Link to={"/calendar"}>
                Calendar
            </Link>
            <div></div>
                Schedule
        </Layout>
    );
}