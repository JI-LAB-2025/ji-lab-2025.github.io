export const SAMPLE_TYPES = [
    { name: '细胞', color: 'bg-purple-500', value: '细胞' },
    { name: '细菌', color: 'bg-emerald-500', value: '细菌' },
    { name: '质粒/DNA', color: 'bg-blue-500', value: '质粒/DNA' },
    { name: 'RNA', color: 'bg-pink-500', value: 'RNA' },
    { name: '病毒', color: 'bg-amber-500', value: '病毒' },
    { name: '组织/血浆', color: 'bg-red-500', value: '组织/血浆' },
    { name: '其他', color: 'bg-gray-400', value: '其他' }
];

export const getSampleColor = (type) => {
    const sampleType = SAMPLE_TYPES.find(t => t.value === type);
    return sampleType ? sampleType.color : 'bg-gray-400';
};
