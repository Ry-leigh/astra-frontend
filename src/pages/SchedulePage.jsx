import Scheduler from "@/components/elements/Scheduler";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/elements/PageHeader";
import { Navigation } from "@/components/elements/Calendar";

export default function SchedulePage() {
    return(
        <Layout>
            <div className="flex flex-col gap-6 w-full">
                <PageHeader>Schedule</PageHeader>
                <div className="flex flex-col w-full bg-white px-3 content-center rounded-lg text-nowrap">
                    <div className="flex flex-col pb-4 px-2">
                        <Navigation />
                        <Scheduler />
                    </div>
                </div>
            </div>
        </Layout>
    );
}