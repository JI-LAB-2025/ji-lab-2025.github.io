import React from 'react';

export function Dashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-2">👋 欢迎回来</h3>
                <p className="text-gray-500 text-sm">请从左侧选择一个冻存盒，或者搜索试剂。</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-2">库存概览</h3>
                <div className="text-3xl font-bold text-brand-500">TODO</div>
                <p className="text-xs text-gray-400 mt-1">总样本数</p>
            </div>
        </div>
    );
}
