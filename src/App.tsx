/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import theme from './theme';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GosBudget from './pages/GosBudget';
import GosBudget2 from './pages/GosBudget2';
import Found from './pages/Found';
import Loans from './pages/Loans';
import External from './pages/External';
import BudgetDetail from './pages/Budget-Detail';
import BudgetDetailKashkadarya from './pages/Budget-Detail-Kashkadarya';
import KashkadaryaMahalla from './pages/Budget-Detail-Kashkadarya-Mahalla';
import BudgetMahallaDetail from './pages/Budget-Mahalla-Detail';
import ContractDetail from './pages/Budget-Mahalla-contract';
import MainKashkadarya from './pages/MainKashkadarya';
import MainQarshi from './pages/MainQarshi';
import MainBatosh from './pages/MainBatosh';
import MainContract from './pages/MainContract';
import FoundDetail from './pages/FoundDetail';
import FoundDetailKashkadarya from './pages/FoundDetailKashkadarya';
import FoundMahalla from './pages/Found-Mahalla';
import FoundMahallaDetail from './pages/FoundMahallaDetail';
import LoansDetail from './pages/LoansDetail';
import LoansDetailVil from './pages/LoansDetailVil';
import LoansMahalla from './pages/LoansMahalla';
import LoansBatosh from './pages/LoansBatosh';
import ExternalDetail from './pages/ExternalDetail';
import ExternalVil from './pages/ExternalVil';
import ExternalMahalla from './pages/ExternalMahalla';
import ExternalBatosh from './pages/ExternalBatosh';
import PoorLevel from './pages/PoorLevel';
import PoorLevelVil from './pages/PoorLevelVil';
import PoorLevelVilDetail from './pages/PoorLevelVilDetail';
import PoorLevelBatosh from './pages/PoorLevelBatosh';
import PoorFamilies from './pages/Famaly';
import FamalyVil from './pages/FamalyVil';
import FamaliyVilDetail from './pages/FamaliyVilDetail';
import FamaliyBatosh from './pages/FamaliyBatosh';
import Dwork from './pages/Dwork';
import DWorkVil from './pages/DWorkVil';
import DWorkVilDetail from './pages/DWorkVilDetail';
import DWorkBatosh from './pages/DWorkBatosh';
import Work from './pages/Work';
import WorkVil from './pages/WorkVil';
import WorkVilDetail from './pages/WorkVilDetail';
import WorkBatosh from './pages/WorkBatosh';
import Regions from './pages/Regions';
import Mahalla from './pages/Mahalla';
import Reports from './pages/Resports';

import JobPlacement from './pages/JobPlacement';
import JobPlacementVil from './pages/JobPlacementVil';
import JobPlacementVilDetail from './pages/JobPlacementVilDetail';
import JobPlacementBatosh from './pages/JobPlacementBatosh';

import PoorServices from './pages/PoorServices';
import PoorServicesVil from './pages/PoorServicesVil';
import PoorServicesVilDetail from './pages/PoorServicesVilDetail';
import PoorServicesBatosh from './pages/PoorServicesBatosh';
import RedFlag from './pages/RedFlag';

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout><Outlet /></MainLayout>}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/kashkadarya" element={<MainKashkadarya />} />
              <Route path="/kashkadarya/qarshi-detail" element={<MainQarshi />} />
              <Route path="/kashkadarya/qarshi-detail/batosh" element={<MainBatosh />} />
              <Route path="/kashkadarya/qarshi-detail/batosh/contract/:id" element={<MainContract />} />

              <Route path="/budget" element={<GosBudget />} />
              <Route path="/budget2" element={<GosBudget2 />} />
              <Route path="/budget-detail" element={<BudgetDetail />} />
              <Route path="/budget-detail/kashkadarya" element={<BudgetDetailKashkadarya />} />
              <Route path="/budget-detail/kashkadarya/mahallalar" element={<KashkadaryaMahalla />} />
              <Route path="/kashkadarya/mahalla/batosh" element={<BudgetMahallaDetail />} />
              <Route path="/kashkadarya/mahalla/batosh/contract/:id" element={<ContractDetail />} />

              <Route path="/fund" element={<Found />} />
              <Route path="/fund-detail" element={<FoundDetail />} />
              <Route path="/fund-detail/kashkadarya" element={<FoundDetailKashkadarya />} />
              <Route path="/fund-detail/kashkadarya/mahallalar" element={<FoundMahalla />} />
              <Route path="/fund-detail/kashkadarya/mahallalar/batosh" element={<FoundMahallaDetail />} />
              <Route path="/red-flag" element={<RedFlag />} />

              <Route path="/loans" element={<Loans />} />
              <Route path="/loans-detail" element={<LoansDetail />} />
              <Route path="/loans-detail/kashkadarya" element={<LoansDetailVil />} />
              <Route path="/loans-detail/kashkadarya/mahallalar" element={<LoansMahalla />} />
              <Route path="/loans-detail/kashkadarya/mahallalar/batosh" element={<LoansBatosh />} />

              <Route path="/external" element={<External />} />
              <Route path="/external-detail" element={<ExternalDetail />} />
              <Route path="/external-detail/kashkadarya" element={<ExternalVil />} />
              <Route path="/external-detail/kashkadarya/mahallalar" element={<ExternalMahalla />} />
              <Route path="/external-detail/kashkadarya/mahallalar/batosh" element={<ExternalBatosh />} />

              <Route path="/poor-level" element={<PoorLevel />} />
              <Route path="/poor-level/vil" element={<PoorLevelVil />} />
              <Route path="/poor-level/vil/qarshi" element={<PoorLevelVilDetail />} />
              <Route path="/poor-level/vil/qarshi/batosh" element={<PoorLevelBatosh />} />

              <Route path="/family" element={<PoorFamilies />} />
              <Route path="/family/vil" element={<FamalyVil />} />
              <Route path="/family/vil/qarshi" element={<FamaliyVilDetail />} />
              <Route path="/family/vil/qarshi/batosh" element={<FamaliyBatosh />} />

              <Route path="/work" element={<Dwork />} />
              <Route path="/work/vil" element={<DWorkVil />} />
              <Route path="/work/vil/qarshi" element={<DWorkVilDetail />} />
              <Route path="/work/vil/qarshi/batosh" element={<DWorkBatosh />} />

              <Route path="/swork" element={<Work />} />
              <Route path="/swork/vil" element={<WorkVil />} />
              <Route path="/swork/vil/qarshi" element={<WorkVilDetail />} />
              <Route path="/swork/vil/qarshi/batosh" element={<WorkBatosh />} />

              <Route path="/regions" element={<Regions />} />
              <Route path="/mahalla" element={<Mahalla />} />
              <Route path="/reports" element={<Reports />} />
              
              <Route path="/job-placement" element={<JobPlacement />} />
              <Route path="/job-placement/vil" element={<JobPlacementVil />} />
              <Route path="/job-placement/vil/qarshi" element={<JobPlacementVilDetail />} />
              <Route path="/job-placement/vil/qarshi/batosh" element={<JobPlacementBatosh />} />
              
              <Route path="/poor-services" element={<PoorServices />} />
              <Route path="/poor-services/vil" element={<PoorServicesVil />} />
              <Route path="/poor-services/vil/qarshi" element={<PoorServicesVilDetail />} />
              <Route path="/poor-services/vil/qarshi/batosh" element={<PoorServicesBatosh />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}
