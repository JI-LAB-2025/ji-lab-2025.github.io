import React, { useState } from 'react';
import { Package, Plus, ChevronRight, ChevronDown, Warehouse, Refrigerator, Archive } from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

export function Sidebar({ structure, selectedBox, onSelectBox, onCreateBox }) {
    const { rooms = [], units = [], shelves = [], boxes = [] } = structure;
    const [expanded, setExpanded] = useState({});

    const toggle = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const isExpanded = (id) => !!expanded[id];

    // Helper to get children
    const getUnitsForRoom = (roomId) => units.filter(u => u.roomId === roomId);
    const getShelvesForUnit = (unitId) => shelves.filter(s => s.unitId === unitId);
    const getBoxesForShelf = (shelfId) => boxes.filter(b => b.shelfId === shelfId);

    // Render Box Item
    const BoxItem = ({ box }) => (
        <button
            onClick={() => onSelectBox(box)}
            className={clsx(
                "w-full text-left pl-8 pr-2 py-1.5 text-sm transition-colors flex items-center gap-2",
                selectedBox.id === box.id
                    ? "text-brand-600 bg-brand-50 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
        >
            <Package size={14} className={selectedBox.id === box.id ? "text-brand-500" : "text-gray-400"} />
            <span className="truncate">{box.name}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Warehouse size={20} className="text-brand-500" />
                    实验室空间
                </h2>
            </div>

            <div className="p-3">
                <button
                    onClick={onCreateBox}
                    className="w-full py-1.5 px-3 bg-white border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:text-brand-500 hover:border-brand-500 flex items-center justify-center gap-1 transition-all">
                    <Plus size={12} /> 快速新建冻存盒
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                {rooms.map(room => (
                    <div key={room.id} className="mb-2">
                        <div
                            className="flex items-center gap-2 px-2 py-1 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 rounded"
                            onClick={() => toggle(room.id)}
                        >
                            {isExpanded(room.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            {room.name}
                        </div>

                        {isExpanded(room.id) && (
                            <div className="ml-2 border-l border-gray-200 pl-1 mt-1 space-y-1">
                                {getUnitsForRoom(room.id).map(unit => (
                                    <div key={unit.id}>
                                        <div
                                            className="flex items-center gap-2 px-2 py-1 text-sm text-gray-600 cursor-pointer hover:bg-gray-50 rounded"
                                            onClick={() => toggle(unit.id)}
                                        >
                                            <Refrigerator size={14} className="text-blue-400" />
                                            {unit.name}
                                        </div>

                                        {isExpanded(unit.id) && (
                                            <div className="ml-4 border-l border-gray-100 pl-1 mt-1 space-y-0.5">
                                                {getShelvesForUnit(unit.id).map(shelf => (
                                                    <div key={shelf.id}>
                                                        <div
                                                            className="flex items-center gap-2 px-2 py-1 text-xs text-gray-500 cursor-pointer hover:bg-gray-50 rounded"
                                                            onClick={() => toggle(shelf.id)}
                                                        >
                                                            <Archive size={12} />
                                                            {shelf.name}
                                                        </div>

                                                        {isExpanded(shelf.id) && (
                                                            <div className="ml-2 mt-0.5">
                                                                {getBoxesForShelf(shelf.id).map(box => (
                                                                    <BoxItem key={box.id} box={box} />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Fallback for unassigned boxes */}
                {boxes.filter(b => !b.shelfId).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="px-2 pb-2 text-xs font-semibold text-gray-400">未分类 / 暂存</div>
                        {boxes.filter(b => !b.shelfId).map(box => (
                            <BoxItem key={box.id} box={box} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
