import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage/HomePage";
import { AuthProvider } from "./hooks/useAuth";
import { Layout } from "./components/Layout/Layout";
import { PrivateRouterLoginAndRegister } from "./components/PrivateRoute/RedirectLogin";
import { LoginPage } from "./pages/AuthPage/LoginPage";
import { RegisterPage } from "./pages/AuthPage/RegisterPage";
import ProtectedRoute from "./components/PrivateRoute/AccessRouteConnected";
import { DashboardPage } from "./pages/DashboardPage/DashboardPage";
import VerifyMailPage from "./pages/VerfiyMailPage/VerfiyMailPage";
import AccessAdmin from "./components/PrivateRoute/AccessAdmin";
import { CreateCategoryPage } from "./pages/AdminPage/CreateCategoryPage";
import { CreateDocumentPage } from "./pages/AdminPage/CreateDocumentPage";
import { CategorySlugPage } from "./pages/CategoryPage/CategorySlugPage";
import { DocumentPage } from "./pages/DocumentPage/DocumentPage";
import { ModalProvider } from "./hooks/useModal";
import { MenuProvider } from "./hooks/useMenu";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPassword/ResetPasswordPage";
import { ProgressionProvider } from "./hooks/useProgression";
import { ToastContainer } from "react-toastify";
import { AllCategoryPage } from "./pages/CategoryPage/AllCategoryPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

const client = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={client}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />

      <BrowserRouter>
        <AuthProvider>
          <ProgressionProvider>
            <MenuProvider>
              <ModalProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route
                      path="login"
                      element={
                        <PrivateRouterLoginAndRegister>
                          <LoginPage />
                        </PrivateRouterLoginAndRegister>
                      }
                    />
                    <Route
                      path="register"
                      element={
                        <PrivateRouterLoginAndRegister>
                          <RegisterPage />
                        </PrivateRouterLoginAndRegister>
                      }
                    />
                    <Route
                      path="forgot-password"
                      element={
                        <PrivateRouterLoginAndRegister>
                          <ForgotPasswordPage />
                        </PrivateRouterLoginAndRegister>
                      }
                    />
                    <Route
                      path="reset-password"
                      element={<ResetPasswordPage />}
                    />
                    <Route
                      path="dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="verify-email" element={<VerifyMailPage />} />
                    <Route
                      path="admin/create-category"
                      element={
                        <ProtectedRoute>
                          <AccessAdmin>
                            <CreateCategoryPage />
                          </AccessAdmin>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="admin/create-document"
                      element={
                        <ProtectedRoute>
                          <AccessAdmin>
                            <CreateDocumentPage />
                          </AccessAdmin>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="category/:slug"
                      element={<CategorySlugPage />}
                    />
                    <Route
                      path="category/:slugCategory/:slugDocument"
                      element={<DocumentPage />}
                    />
                    <Route path="category" element={<AllCategoryPage />} />
                  </Route>
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </ModalProvider>
            </MenuProvider>
          </ProgressionProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
