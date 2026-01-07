import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { CryoboxGrid } from './components/CryoboxGrid';
import { SampleForm } from './components/SampleForm';
import { Login } from './components/Login';
import { api } from './lib/notion';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [boxes, setBoxes] = useState([]);
    const [selectedBox, setSelectedBox] = useState(null);
    const [samples, setSamples] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check auth on mount
    useEffect(() => {
        const auth = localStorage.getItem('reagent_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // Load initial boxes only if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            api.getBoxes().then(data => {
                setBoxes(data);
                if (data.length > 0) setSelectedBox(data[0]);
                setLoading(false);
            });
        }
    }, [isAuthenticated]);

    // Load samples when box changes
    useEffect(() => {
        if (selectedBox) {
            api.getSamples(selectedBox.id).then(data => {
                setSamples(data);
                setSelectedCell(null); // Reset selection
            });
        }
    }, [selectedBox]);

    const handleSaveSample = async (sampleData) => {
        // Optimistic update or wait for API
        const newSample = {
            ...sampleData,
            boxId: selectedBox.id,
            row: selectedCell.row,
            col: selectedCell.col
        };

        const saved = await api.saveSample(newSample);
        setSamples(prev => [...prev.filter(s => s.row !== saved.row || s.col !== saved.col), saved]);

        // Update grid selection to reflect new data
        setSelectedCell(prev => ({ ...prev, ...saved, isOccupied: true, label: saved.name }));
    };

    const handleCellSelect = (cell) => {
        // Find if there is a sample at this position
        const sample = samples.find(s => s.row === cell.row && s.col === cell.col);
        setSelectedCell({ ...cell, ...sample });
    };

    const handleLogout = () => {
        localStorage.removeItem('reagent_auth');
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <Login onLogin={() => setIsAuthenticated(true)} />;
    }

    const handleDeleteSample = async () => {
        if (!selectedCell || !selectedCell.id) return;

        // Optimistic update
        await api.deleteSample(selectedCell.id);

        setSamples(prev => prev.filter(s => s.id !== selectedCell.id));

        // Reset selection to empty state
        setSelectedCell({
            ...selectedCell,
            isOccupied: false,
            label: null,
            id: null,
            type: null,
            date: null,
            note: null
        });
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    return (
        <div className="flex h-screen w-full bg-gray-50 text-slate-900 font-sans">
            {/* Sidebar: Box Management */}
            <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white shadow-sm z-10 flex flex-col">
                <Sidebar
                    boxes={boxes}
                    selectedBox={selectedBox || {}}
                    onSelectBox={setSelectedBox}
                />
                <div className="border-t p-4 mt-auto">
                    <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-700">退出登录</button>
                </div>
            </div>

            {/* Main Content: Grid */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/50">
                <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 justify-between shadow-sm z-10">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">冻存盒管理系统</h1>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-brand-500 text-white rounded shadow-sm hover:bg-brand-600 transition-colors text-sm font-medium">
                            Sync to Notion
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-6 flex justify-center">
                    <div className="w-full max-w-4xl bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-8 border border-gray-100">
                        {selectedBox && (
                            <CryoboxGrid
                                box={selectedBox}
                                samples={samples}
                                selectedCell={selectedCell}
                                onSelectCell={handleCellSelect}
                            />
                        )}
                    </div>
                </main>
            </div>

            {/* Right Sidebar: Sample Details */}
            <div className="w-80 flex-shrink-0 border-l border-gray-200 bg-white p-6 overflow-y-auto shadow-sm z-10">
                <SampleForm
                    selectedCell={selectedCell}
                    boxId={selectedBox?.id}
                    onSave={handleSaveSample}
                    onDelete={handleDeleteSample}
                />
            </div>
        </div>
    );
}

export default App;
