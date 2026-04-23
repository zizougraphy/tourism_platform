import { useParams } from 'react-router-dom';

export default function ServiceDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1>Service Detail</h1>
      <p>Viewing service #{id} — coming soon</p>
    </div>
  );
}
