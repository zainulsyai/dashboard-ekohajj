import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { DataEntryPortal } from './pages/DataEntryPortal';
import { Reports } from './pages/Reports';
import { Visualization } from './pages/Visualization';
import { SpiceForm } from './pages/forms/SpiceForm';
import { RTEForm } from './pages/forms/RTEForm';
import { TenantForm } from './pages/forms/TenantForm';
import { ExpeditionForm } from './pages/forms/ExpeditionForm';
import { TelecomForm } from './pages/forms/TelecomForm';
import { RiceForm } from './pages/forms/RiceForm';
import { Settings } from './pages/Settings';
import { Page, Status } from './types';
import { DataProvider } from './contexts/DataContext';
import { UserProvider } from './contexts/UserContext';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LOGIN);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Status>(Status.ALL);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage(Page.DASHBOARD);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage(Page.LOGIN);
  };

  const navigateToPortal = () => setCurrentPage(Page.DATA_ENTRY_PORTAL);

  const renderContent = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />;
      case Page.DATA_ENTRY_PORTAL:
        return <DataEntryPortal onNavigate={setCurrentPage} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />;
      case Page.REPORTS:
        return <Reports />;
      case Page.VISUALIZATION:
        return <Visualization />;
      case Page.FORM_BUMBU:
        return <SpiceForm onBack={navigateToPortal} />;
      case Page.FORM_RICE:
        return <RiceForm onBack={navigateToPortal} />;
      case Page.FORM_RTE:
        return <RTEForm onBack={navigateToPortal} />;
      case Page.FORM_TENANT:
        return <TenantForm onBack={navigateToPortal} />;
      case Page.FORM_EXPEDITION:
        return <ExpeditionForm onBack={navigateToPortal} />;
      case Page.FORM_TELECOM:
        return <TelecomForm onBack={navigateToPortal} />;
      case Page.SETTINGS:
        return <Settings onNavigate={setCurrentPage} onLogout={handleLogout} />;
      default:
        return <Dashboard statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />;
    }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </DataProvider>
  );
};

export default App;