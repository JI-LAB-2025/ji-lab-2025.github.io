import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { CryoboxGrid } from '../components/CryoboxGrid';
import { SampleForm } from '../components/SampleForm';
import { api } from '../lib/notion';

export function BoxView() {
    const { boxId } = useParams();
    const { boxes, setBoxes } = useOutletContext(); // Access global boxes to find current box details

    const [samples, setSamples] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [loading, setLoading] = useState(true);

    // Derived state
    const currentBox = boxes.find(b => b.id.toString() === boxId) || { name: 'Unknown Box', id: boxId, capacity: 100 };

    useEffect(() => {
        if (boxId) {
            setLoading(true);
            api.getSamples(boxId).then(data => {
                setSamples(data);
                setSelectedCell(null);
                setLoading(false);
            });
        }
    }, [boxId]);

    const handleCellSelect = (cell) => {
        const sample = samples.find(s => s.row === cell.row && s.col === cell.col);
        setSelectedCell({ ...cell, ...sample });
    };

    const handleSaveSample = async (sampleData) => {
        const newSample = {
            ...sampleData,
            boxId: boxId,
            row: selectedCell.row,
            col: selectedCell.col
        };

        const saved = await api.saveSample(newSample);
        setSamples(prev => [...prev.filter(s => s.row !== saved.row || s.col !== saved.col), saved]);
        setSelectedCell(prev => ({ ...prev, ...saved, isOccupied: true, label: saved.name }));
    };

    const handleDeleteSample = async () => {
        if (!selectedCell || !selectedCell.id) return;
        await api.deleteSample(selectedCell.id);
        setSamples(prev => prev.filter(s => s.id !== selectedCell.id));
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

    // Placeholder handlers for Box Edit/Delete (Should be moved to Layout or specific Context)
    const handleEditBox = () => { alert("Edit Box via Sidebar for now"); };
    const handleDeleteBox = () => { alert("Delete Box via Sidebar for now"); };

    if (loading) return <div>Loading box data...</div>;

    return (
        <div className="flex gap-6 h-[calc(100vh-8rem)]">
            <div className="flex-1 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-8 border border-gray-100 overflow-auto flex justify-center">
                <div className="w-full max-w-3xl">
                    <CryoboxGrid
                        box={currentBox}
                        samples={samples}
                        selectedCell={selectedCell}
                        onSelectCell={handleCellSelect}
                        onEditBox={handleEditBox}
                        onDeleteBox={handleDeleteBox}
                    />
                </div>
            </div>

            <div className="w-80 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-700">样品详情</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <SampleForm
                        selectedCell={selectedCell}
                        boxId={boxId}
                        onSave={handleSaveSample}
                        onDelete={handleDeleteSample}
                        onCopy={() => { }} // TODO: implement copy
                        onBatchDelete={() => { }} // TODO: implement batch delete
                    />
                </div>
            </div>
        </div>
    );
}
