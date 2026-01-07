```javascript
import React, { useState, useEffect } from 'react';

// Assume SampleForm is a functional component that takes props
export function SampleForm({ selectedCell, boxId, onSave, onDelete }) {

const handleDelete = () => {
    if (onDelete && window.confirm('确定要删除这个样品吗？')) {
        onDelete();
    }
};

if (!selectedCell) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <p>请选择一个格子</p>
        </div>
    );
}

// ... existing render code up to buttons ...

return (
    <div className="flex flex-col h-full bg-white">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">样品管理</h3>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
                格子 {selectedCell.number}
            </span>
        </div>

        <div className="space-y-4">
            {/* ... inputs ... */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">样品名称 *</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="例如: MDCK"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">样品类型 *</label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none bg-white"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                >
                    <option>细胞</option>
                    <option>细菌</option>
                    <option>病毒</option>
                    <option>RNA</option>
                    <option>DNA</option>
                    <option>其他</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">存入日期</label>
                <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">备注</label>
                <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none h-24 resize-none"
                    placeholder="添加备注信息..."
                    value={formData.note}
                    onChange={(e) => handleChange('note', e.target.value)}
                />
            </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
            <button
                onClick={handleSave}
                className="bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition-colors shadow-sm font-medium text-sm">
                保存样品
            </button>
            <button
                onClick={() => alert('复制功能开发中')}
                className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors shadow-sm font-medium text-sm">
                复制样品
            </button>
            <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors shadow-sm font-medium text-sm">
                删除样品
            </button>
            <button className="bg-gray-100 text-gray-600 border border-gray-200 py-2 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm">
                批量删除
            </button>
        </div>
    </div>
);
}
