import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { BoxView } from './pages/BoxView';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="box/:boxId" element={<BoxView />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}

export default App;
