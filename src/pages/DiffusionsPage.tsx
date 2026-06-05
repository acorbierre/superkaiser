import DiffusionsSearch from "@/components/qualipo/diffusions-search";

export default function DiffusionsPage() {
  return (
    <div className="flex-1 flex flex-col items-center pt-8 gap-3">
      <div style={{ width: 1100, background: "#E9ECEF" }} className="px-6 py-3 rounded-lg text-[1rem] text-gray-500">
        SuperKaiser &rsaquo; Diffusions
      </div>
      <DiffusionsSearch />
    </div>
  );
}
