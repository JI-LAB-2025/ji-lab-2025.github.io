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

        // Reset selection (keep empty cell selected)
        setSelectedCell({
            ...selectedCell,
            isOccupied: false,
            label: null,
            id: null,
            type: null,
            color: null,
            date: null,
            note: null
        });
    };

    const handleCopySample = async () => {
        if (!selectedCell || !selectedCell.id) {
            alert('请先选择一个已有的样品');
            return;
        }

        // Strategy: Find first empty cell
        // 1. Create a set of occupied keys
        const occupied = new Set(samples.map(s => `${s.row}-${s.col}`));

        // 2. Scan 10x10 grid
        let targetRow = -1;
        let targetCol = -1;

        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                if (!occupied.has(`${r}-${c}`)) {
                    targetRow = r;
                    targetCol = c;
                    break;
                }
            }
            if (targetRow !== -1) break;
        }

        if (targetRow === -1) {
            alert('盒子已满，无法复制');
            return;
        }

        // 3. Create duplicate
        const newSample = {
            ...selectedCell,
            id: undefined, // Let backend/logic generate new ID
            row: targetRow,
            col: targetCol,
            name: `${selectedCell.label} (Copy)`
        };

        const saved = await api.saveSample(newSample);
        setSamples(prev => [...prev, saved]);

        // Optional: Move selection to new copy? Or stay? Let's stay for now or notify.
        alert(`已复制到格子 ${targetRow * 10 + targetCol + 1}`);
    };

    const handleBatchDelete = async () => {
        if (!selectedBox) return;
        if (!window.confirm(`确定要清空盒子 "${selectedBox.name}" 中的所有样品吗？此操作不可恢复。`)) return;

        // In a real app, API would support batch delete. Here we iterate (slow but works for mock)
        // or assumption: API has clearBox
        // For Mock, let's just clear local state and assume API call

        setSamples([]);
        setSelectedCell(null);
    };

    const [boxModal, setBoxModal] = useState({ isOpen: false, mode: 'create', name: '' });

    const handleCreateBox = () => {
        setBoxModal({ isOpen: true, mode: 'create', name: '' });
    };

    const handleEditBox = () => {
        if (!selectedBox) return;
        setBoxModal({ isOpen: true, mode: 'edit', name: selectedBox.name });
    };

    const handleBoxModalSave = async () => {
        if (!boxModal.name.trim()) return;

        if (boxModal.mode === 'create') {
            const newBox = {
                name: boxModal.name,
                type: 'General',
                capacity: 100,
                occupied: 0
            };
            const saved = await api.saveBox(newBox);
            setBoxes(prev => [...prev, saved]);
            setSelectedBox(saved);
        } else {
            const updatedBox = { ...selectedBox, name: boxModal.name };
            const saved = await api.saveBox(updatedBox);
            setBoxes(prev => prev.map(b => b.id === saved.id ? saved : b));
            setSelectedBox(saved);
        }
        setBoxModal({ isOpen: false, mode: 'create', name: '' });
    };

    const handleDeleteBox = async () => {
        if (!selectedBox) return;
        if (!window.confirm(`确定要删除冻存盒 "${selectedBox.name}" 吗？所有格子数据也将被删除！`)) return;

        await api.deleteBox(selectedBox.id);

        const remaining = boxes.filter(b => b.id !== selectedBox.id);
        setBoxes(remaining);
        setSelectedBox(remaining.length > 0 ? remaining[0] : null);
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    const Modal = () => {
        if (!boxModal.isOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">
                            {boxModal.mode === 'create' ? '新建冻存盒' : '编辑冻存盒'}
                        </h3>
                    </div>
                    <div className="p-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
                        <input
                            autoFocus
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="请输入冻存盒名称"
                            value={boxModal.name}
                            onChange={(e) => setBoxModal(prev => ({ ...prev, name: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleBoxModalSave()}
                        />
                    </div>
                    <div className="px-5 py-3 bg-gray-50 flex justify-end gap-2 border-t border-gray-100">
                        <button
                            onClick={() => setBoxModal(prev => ({ ...prev, isOpen: false }))}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleBoxModalSave}
                            className="px-3 py-1.5 text-sm bg-brand-500 text-white rounded hover:bg-brand-600 font-medium"
                        >
                            确定
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen w-full bg-gray-50 text-slate-900 font-sans relative">
            <Modal />
            {/* Sidebar: Box Management */}
            <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white shadow-sm z-10 flex flex-col">
                <Sidebar
                    boxes={boxes}
                    selectedBox={selectedBox || {}}
                    onSelectBox={setSelectedBox}
                    onCreateBox={handleCreateBox}
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
                                onEditBox={handleEditBox}
                                onDeleteBox={handleDeleteBox}
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
                    onCopy={handleCopySample}
                    onBatchDelete={handleBatchDelete}
                />
            </div>
        </div>
    );
}

export default App;
