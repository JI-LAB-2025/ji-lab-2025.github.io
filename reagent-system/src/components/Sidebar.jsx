import React from 'react';
import { Package, Plus } from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar({ boxes, selectedBox, onSelectBox, onCreateBox }) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Package size={20} className="text-brand-500" />
                    冻存盒管理
                </h2>
            </div>

            <div className="p-3">
                <button
                    onClick={onCreateBox}
                    className="w-full py-2 px-3 bg-white border border-gray-200 shadow-sm rounded-md text-sm font-medium text-gray-600 hover:text-brand-500 hover:border-brand-500 flex items-center justify-center gap-2 transition-all">
                    <Plus size={16} /> 新建冻存盒
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">
                    所有位置
                </div>
                {boxes.map((box) => (
                    <button
                        key={box.id}
                        onClick={() => onSelectBox(box)}
                        className={clsx(
                            "w-full text-left px-3 py-3 rounded-md text-sm transition-colors",
                            selectedBox.id === box.id
                                ? "bg-brand-50 text-brand-700 font-medium border-l-4 border-brand-500"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span>{box.name}</span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                                className="bg-brand-500 h-1.5 rounded-full"
                                style={{ width: `${(box.occupied / box.capacity) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>{box.type || '未分类'}</span>
                            <span>{box.occupied}/{box.capacity}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
