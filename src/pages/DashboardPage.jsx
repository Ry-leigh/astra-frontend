import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/elements/PageHeader";

export default function DashboardPage() {
  return (
    <Layout>
      <div className="flex flex-col w-full">
      <PageHeader>Dashboard</PageHeader>
      </div>
    </Layout>
  );
}