import Scheduler from "@/components/elements/Scheduler";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";

export default function SchedulePage() {
    return(
        <Layout>
            <div className="flex flex-col w-full">
                <Link to={"/calendar"}>
                    Calendar
                </Link>
                <div></div>
                    Schedule
                <div>
                    <Scheduler />
                </div>

            </div>
        </Layout>
    );
}