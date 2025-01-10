import { RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import appRouters from '@/app/views/router/router';
import { LoadingOverlay } from '@/components/common';
import { RootState } from '@/store/store';
import './App.css';

function App() {
  const { loading } = useSelector((state: RootState) => state.auth);

  return (
    <>
      {loading && <LoadingOverlay />}
      <RouterProvider router={appRouters} />
    </>
  );
}

export default App;