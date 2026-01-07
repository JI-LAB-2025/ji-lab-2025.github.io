/**
 * Service to handle data operations.
 * Currently simulates API calls with local state.
 * In a real implementation, this would call a Notion API proxy or direct API.
 */

// Mock Data
export const MOCK_BOXES = [
    { id: 'box-1', name: 'Cell Line Box A (MDCK)', type: 'Cells', capacity: 100, occupied: 5 },
    { id: 'box-2', name: 'Plasmid Box 1', type: 'Plasmids', capacity: 81, occupied: 0 },
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
    }
};
