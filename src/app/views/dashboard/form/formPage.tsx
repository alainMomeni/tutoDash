import { useParams } from 'react-router-dom';
import DashboardForm from '@/components/form/dashboardForm';
import { generateFormSchema } from '@/utils/schemaGenerators';
import { FormPageProps } from '@/types/form/formTypes';

const FormPage = ({ type }: FormPageProps) => {
  const { id } = useParams();
  const schema = generateFormSchema(type);
  const title = schema.titles.page[id ? 'edit' : 'create'];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h2>
      </div>
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <DashboardForm id={id} type={type} />
      </div>
    </div>
  );
};

export default FormPage;