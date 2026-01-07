import React, { useMemo } from 'react';
import { clsx } from 'clsx';
import { getSampleColor, SAMPLE_TYPES } from '../lib/constants';

// Helper to generate grid data (10x10)
const ROWS = 10;
const COLS = 10;

export function CryoboxGrid({ box, samples = [], selectedCell, onSelectCell }) {

    // Calculate grid cells derived from box size (assuming 10x10 for now)
    const cells = useMemo(() => {
        const grid = [];
        let count = 1;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                // Check if we have a sample at this position
                const sample = samples.find(s => s.row === r && s.col === c);

                grid.push({
                    id: `${r}-${c}`,
                    row: r,
                    col: c,
                    number: count++,
                    isOccupied: !!sample,
                    label: sample ? sample.name : null,
                    // Store the HEX color: custom color OR default for type OR gray
                    color: sample ? (sample.color || getSampleColor(sample.type)) : '#f9fafb' // gray-50
                });
            }
        }
        return grid;
    }, [box.id, samples]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{box.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">10x10</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">液氮</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-sm bg-amber-500 text-white rounded hover:bg-amber-600">编辑冻存盒</button>
                    <button className="px-3 py-1.5 text-sm bg-red-400 text-white rounded hover:bg-red-500">删除</button>
                </div>
            </div>

            {/* The 10x10 Grid */}
            <div
                className="grid gap-1 flex-1 min-h-[500px]"
                style={{
                    gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`
                }}
            >
                {cells.map((cell) => {
                    const isSelected = selectedCell && selectedCell.id === cell.id;
                    return (
                        <div
                            key={cell.id}
                            onClick={() => onSelectCell(cell)}
                            // Use inline style for background color to support arbitrary Hex
                            style={{ backgroundColor: cell.isOccupied ? cell.color : undefined }}
                            className={clsx(
                                "relative border rounded-sm flex items-center justify-center text-xs cursor-pointer transition-all select-none",
                                // Only apply default bg if NOT occupied (since we use inline style for simple colors)
                                !cell.isOccupied && "bg-white hover:bg-blue-50",
                                cell.isOccupied ? "text-white border-transparent" : "text-gray-400 border-gray-200",
                                isSelected && "ring-2 ring-offset-1 ring-blue-500 z-10 scale-105 shadow-md"
                            )}
                        >
                            <span className="font-medium">
                                {cell.label || cell.number}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-6 border-t pt-4 flex gap-4 text-xs text-gray-500 flex-wrap">
                {SAMPLE_TYPES.map(type => (
                    <div key={type.value} className="flex items-center gap-1">
                        <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: type.color }}
                        ></div>
                        {type.name}
                    </div>
                ))}
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-50 rounded-sm border border-gray-200"></div> 空置</div>
            </div>
        </div>
    );
}
