import React, { useState, useEffect } from 'react';
import { SAMPLE_TYPES, getSampleColor } from '../lib/constants';

export function SampleForm({ selectedCell, boxId, onSave, onDelete, onCopy, onBatchDelete }) {
    // Local state for form inputs
    const [formData, setFormData] = useState({
        name: '',
        type: SAMPLE_TYPES[0].value,
        color: SAMPLE_TYPES[0].color,
        date: '2025-11-04',
        note: ''
    });

    // Update form when selected cell changes
    useEffect(() => {
        if (selectedCell) {
            setFormData({
                name: selectedCell.label || '',
                type: selectedCell.type || SAMPLE_TYPES[0].value,
                // Use stored color OR default color for this type
                color: selectedCell.color || getSampleColor(selectedCell.type || SAMPLE_TYPES[0].value),
                date: selectedCell.date || new Date().toISOString().split('T')[0],
                note: selectedCell.note || ''
            });
        }
    }, [selectedCell]);

    const handleChange = (field, value) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // If Type changes, auto-update Color to default (unless user manually changes color later? 
            // For simplicity, always sync color on type change for now, user can override after)
            if (field === 'type') {
                newData.color = getSampleColor(value);
            }

            return newData;
        });
    };

    const handleSave = () => {
        if (onSave) {
            onSave(formData);
        }
    };

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

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">样品管理</h3>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
                    格子 {selectedCell.number}
                </span>
            </div>

            <div className="space-y-4">
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

                <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">样品类型 *</label>
                        <input
                            list="sample-type-options"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                            value={formData.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                            placeholder="选择或输入类型"
                        />
                        <datalist id="sample-type-options">
                            {SAMPLE_TYPES.map(type => (
                                <option key={type.value} value={type.value} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">颜色</label>
                        <div className="relative">
                            <input
                                type="color"
                                value={formData.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                                className="w-full h-[42px] p-1 border border-gray-300 rounded-md cursor-pointer bg-white"
                            />
                        </div>
                    </div>
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
                    onClick={onCopy}
                    className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors shadow-sm font-medium text-sm">
                    复制样品
                </button>
                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors shadow-sm font-medium text-sm">
                    删除样品
                </button>
                <button
                    onClick={onBatchDelete}
                    className="bg-gray-100 text-gray-600 border border-gray-200 py-2 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm">
                    批量删除
                </button>
            </div>
        </div>
    );
}
