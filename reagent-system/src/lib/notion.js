/**
 * Service to handle data operations.
 * Currently simulates API calls with local state.
 * In a real implementation, this would call a Notion API proxy or direct API.
 */

// Mock Data
export const MOCK_ROOMS = [
    { id: 'room-1', name: 'Room 304 (Main Lab)' },
    { id: 'room-2', name: 'Cell Culture Room' }
];

export const MOCK_UNITS = [
    { id: 'unit-1', roomId: 'room-1', name: '-80°C Freezer A', type: 'Freezer' },
    { id: 'unit-2', roomId: 'room-1', name: 'Reagent Cabinet #1', type: 'Cabinet' },
    { id: 'unit-3', roomId: 'room-2', name: 'Liquid Nitrogen Tank', type: 'Tank' }
];

export const MOCK_SHELVES = [
    { id: 'shelf-1', unitId: 'unit-1', name: 'Shelf 1 (Top)' },
    { id: 'shelf-2', unitId: 'unit-1', name: 'Shelf 2' },
    { id: 'shelf-3', unitId: 'unit-2', name: 'Drawer A' },
    { id: 'shelf-4', unitId: 'unit-3', name: 'Rack 1' }
];

export const MOCK_BOXES = [
    { id: 'box-1', shelfId: 'shelf-1', name: 'Cell Line Box A (MDCK)', type: 'Cells', capacity: 100, occupied: 5 },
    { id: 'box-2', shelfId: 'shelf-1', name: 'Plasmid Box 1', type: 'Plasmids', capacity: 81, occupied: 0 },
    { id: 'box-3', shelfId: 'shelf-3', name: 'Antibodies 2024', type: 'Reagent', capacity: 0, occupied: 0 }, // Capacity 0 implies list view
];

export const MOCK_SAMPLES = {
    'box-1': [
        { id: 's1', boxId: 'box-1', row: 0, col: 0, name: 'MDCK', type: 'Cells', date: '2025-01-01' },
        { id: 's2', boxId: 'box-1', row: 0, col: 1, name: 'MDCK', type: 'Cells', date: '2025-01-01' },
        { id: 's3', boxId: 'box-1', row: 0, col: 2, name: 'MDCK', type: 'Cells', date: '2025-01-01' },
        { id: 's4', boxId: 'box-1', row: 0, col: 3, name: 'MDCK', type: 'Cells', date: '2025-01-01' },
        { id: 's5', boxId: 'box-1', row: 0, col: 4, name: 'MDCK', type: 'Cells', date: '2025-01-01' },
    ]
};

export const api = {
    async getBoxes() {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...MOCK_BOXES];
    },

    async getStructure() {
        await new Promise(resolve => setTimeout(resolve, 400));
        return {
            rooms: MOCK_ROOMS,
            units: MOCK_UNITS,
            shelves: MOCK_SHELVES,
            boxes: MOCK_BOXES
        };
    },

    async getSamples(boxId) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return MOCK_SAMPLES[boxId] || [];
    },

    async saveSample(sample) {
        console.log("Saving sample to Notion (Mock):", sample);
        // Here we would call Notion API
        return { ...sample, id: sample.id || Math.random().toString(36) };
    },

    async deleteSample(sampleId) {
        console.log("Deleting sample:", sampleId);
    },

    async saveBox(box) {
        console.log("Saving box to Notion (Mock):", box);
        return { ...box, id: box.id || Math.random().toString(36), capacity: box.capacity || 100, occupied: box.occupied || 0 };
    },

    async deleteBox(boxId) {
        console.log("Deleting box:", boxId);
    }
};
