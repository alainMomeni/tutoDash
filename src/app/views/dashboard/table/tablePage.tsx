import DashboardTable from "@components/table/dashboradTable";
import { generateTableSchema } from '@/utils/schemaGenerators';
import { TablePageProps } from '@/types/table/tableType';

const TablePage = ({ type }: TablePageProps) => {
  const config = generateTableSchema(type);

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {config.pageTitle}
          </h2>
        </div>
      </div>
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <DashboardTable type={type} />
      </div>
    </div>
  );
};

export default TablePage;