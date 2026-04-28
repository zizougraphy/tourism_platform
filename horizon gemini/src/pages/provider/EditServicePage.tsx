import { useParams } from 'react-router-dom';
import AddServicePage from './AddServicePage';

const EditServicePage = () => {
  const { id } = useParams();
  // In a real app, we'd fetch the service here
  // For the frontend demo, we'll reuse the AddServicePage UI but with an "Edit" context
  return <AddServicePage />;
};

export default EditServicePage;
