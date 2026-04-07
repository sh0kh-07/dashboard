/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import MainLayout from './layouts/MainLayout';

// Pages
import DashboardPage from './pages/DashboardPage';
import GosBudget from './pages/GosBudget';
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

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/kashkadarya" element={<MainKashkadarya />} />
            <Route path="/kashkadarya/qarshi-detail" element={<MainQarshi />} />
            <Route path="/kashkadarya/qarshi-detail/batosh" element={<MainBatosh />} />
            <Route path="/kashkadarya/qarshi-detail/batosh/contract/:id" element={<MainContract />} />

            <Route path="/budget" element={<GosBudget />} />
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
          </Routes>
        </MainLayout>
      </Router>
    </ChakraProvider>
  );
}
