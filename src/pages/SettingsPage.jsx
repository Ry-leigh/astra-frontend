import PageHeader from "@/components/elements/PageHeader";
import Layout from "@/components/layout/Layout";

export default function SettingsPage() {
  return (
    <Layout>
      <div className="flex flex-col w-full">
        <PageHeader title="Settings"/>
      </div>
    </Layout>
  );
}