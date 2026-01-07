import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { api } from '../lib/notion';
import { Login } from '../components/Login';

const [isAuthenticated, setIsAuthenticated] = useState(false);
const [structure, setStructure] = useState({ rooms: [], units: [], shelves: [], boxes: [] });
// Legacy support & Sidebar state
const [selectedBox, setSelectedBox] = useState(null);
const [boxModal, setBoxModal] = useState({ isOpen: false, mode: 'create', name: '' });
const navigate = useNavigate();

// Load initial boxes only if authenticated
useEffect(() => {
    if (isAuthenticated) {
        api.getStructure().then(data => {
            setStructure(data);
            setBoxes(data.boxes); // Keep legacy boxes support for now
        });
    }
}, [isAuthenticated]);

const handleLogout = () => {
    localStorage.removeItem('reagent_auth');
    setIsAuthenticated(false);
};

const handleCreateBox = () => {
    setBoxModal({ isOpen: true, mode: 'create', name: '' });
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
        // Navigate to the new box
        navigate(`/box/${saved.id}`);
    } else {
        // Edit mode would need logic to update specific box in list
        // For sidebar list update only:
        setBoxes(prev => prev.map(b => b.name === boxModal.oldName ? { ...b, name: boxModal.name } : b));
        // Note: Simplification here, real app needs ID.
    }
    setBoxModal({ isOpen: false, mode: 'create', name: '' });
};

const handleSelectBox = (box) => {
    setSelectedBox(box);
    navigate(`/box/${box.id}`);
};

if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
}

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
                structure={structure}
                boxes={structure.boxes} // Legacy fallback
                selectedBox={selectedBox || {}}
                onSelectBox={handleSelectBox}
                onCreateBox={handleCreateBox}
            />
            <div className="border-t p-4 mt-auto">
                <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-700">退出登录</button>
            </div>
        </div>

        {/* Main Content: Grid */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/50">
            <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 justify-between shadow-sm z-10">
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">冻存盒管理系统 v2.0</h1>
                <div className="flex space-x-2">
                    <span className="text-xs text-gray-400 self-center mr-2">Using Notion Mock API</span>
                </div>
            </header>
            <main className="flex-1 overflow-auto p-6 flex justify-center">
                <div className="w-full max-w-6xl">
                    <Outlet context={{ boxes, setBoxes }} />
                </div>
            </main>
        </div>
    </div>
);
}
