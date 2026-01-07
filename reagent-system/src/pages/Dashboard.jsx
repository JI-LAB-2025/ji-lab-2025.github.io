import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Package, Droplet, Percent } from 'lucide-react';

export function Dashboard() {
    const { boxes = [] } = useOutletContext();

    // Calculate Stats
    const totalBoxes = boxes.length;
    const totalCapacity = boxes.reduce((acc, b) => acc + (b.capacity || 0), 0);
    const totalOccupied = boxes.reduce((acc, b) => acc + (b.occupied || 0), 0);
    const usagePercent = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

    // Recent activity simulator (mock)
    const recentActivity = [
        { id: 1, action: '存入', item: 'MDCK Cells', user: 'Admin', time: '10分钟前' },
        { id: 2, action: '取出', item: 'Plasmid p53', user: 'User A', time: '2小时前' },
        { id: 3, action: '新建', item: 'Anti-GFP Box', user: 'Admin', time: '1天前' },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-105">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-lg">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">冻存盒总数</p>
                        <h3 className="text-2xl font-bold text-gray-800">{totalBoxes} <span className="text-xs font-normal text-gray-400">个</span></h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-105">
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-lg">
                        <Droplet size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">总样本数</p>
                        <h3 className="text-2xl font-bold text-gray-800">{totalOccupied} <span className="text-xs font-normal text-gray-400">支</span></h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-105">
                    <div className="p-3 bg-purple-50 text-purple-500 rounded-lg">
                        <Percent size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">空间使用率</p>
                        <h3 className="text-2xl font-bold text-gray-800">{usagePercent}%</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">最近动态</h3>
                    <button className="text-sm text-brand-500 hover:text-brand-600 font-medium">查看全部</button>
                </div>
                <div className="divide-y divide-gray-50">
                    {recentActivity.map(activity => (
                        <div key={activity.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <span className={`px-2.5 py-1 rounded text-xs font-medium ${activity.action === '存入' ? 'bg-green-100 text-green-700' :
                                        activity.action === '取出' ? 'bg-amber-100 text-amber-700' :
                                            'bg-blue-100 text-blue-700'
                                    }`}>
                                    {activity.action}
                                </span>
                                <span className="text-sm text-gray-700 font-medium">{activity.item}</span>
                            </div>
                            <div className="text-xs text-gray-400 flex items-center gap-3">
                                <span>{activity.user}</span>
                                <span>{activity.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
