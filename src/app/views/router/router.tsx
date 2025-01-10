import { Route, Navigate, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import AuthGuard from '@/components/auth/authGuard';
import LoginPage from '@/app/views/dashboard/login/loginPage';
import LoginForm from '@/components/form/loginForm';
import Dashboard from '@/app/views/dashboard/dashboard';
import TablePage from '../dashboard/table/tablePage';
import FormPage from '../dashboard/form/formPage';
import ProfilePage from '../dashboard/profile/profilePage';

const appRouters = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Login routes */}
      <Route path="/" element={<LoginPage />}>
        <Route index element={<LoginForm />} />
        <Route path="login" element={<LoginForm />} />
      </Route>
      
      {/* Dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        }
      >        
        {/* Product routes */}
        <Route path="product" element={<TablePage type="product" />} />
        <Route path="product/create" element={<FormPage type="product" />} />
        <Route path="product/edit/:id" element={<FormPage type="product" />} />
        
        {/* Sales routes */}
        <Route path="sales" element={<TablePage type="sales" />} />
        <Route path="sales/create" element={<FormPage type="sales" />} />
        <Route path="sales/edit/:id" element={<FormPage type="sales" />} />

        {/* Profile route */}
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all route for 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);

export default appRouters;