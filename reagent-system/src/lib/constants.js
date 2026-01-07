export const SAMPLE_TYPES = [
    { name: '细胞', color: '#a855f7', value: '细胞' }, // Purple-500
    { name: '细菌', color: '#10b981', value: '细菌' }, // Emerald-500
    { name: '质粒/DNA', color: '#3b82f6', value: '质粒/DNA' }, // Blue-500
    { name: 'RNA', color: '#ec4899', value: 'RNA' }, // Pink-500
    { name: '病毒', color: '#f59e0b', value: '病毒' }, // Amber-500
    { name: '组织/血浆', color: '#ef4444', value: '组织/血浆' }, // Red-500
    { name: '其他', color: '#9ca3af', value: '其他' }  // Gray-400
];

export const getSampleColor = (type) => {
    const sampleType = SAMPLE_TYPES.find(t => t.value === type);
    return sampleType ? sampleType.color : '#9ca3af';
};
