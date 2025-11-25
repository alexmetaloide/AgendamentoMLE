import { Opponent } from '../types';

/**
 * Export opponents data to JSON format
 */
export const exportToJSON = (opponents: Opponent[], filename: string = 'adversarios-mle.json') => {
    const dataStr = JSON.stringify(opponents, null, 2);
    downloadFile(dataStr, filename, 'application/json');
};

/**
 * Export opponents data to CSV format
 */
export const exportToCSV = (opponents: Opponent[], filename: string = 'adversarios-mle.csv') => {
    if (opponents.length === 0) {
        throw new Error('Nenhum adversário para exportar');
    }

    // CSV Headers
    const headers = ['Nome', 'Telefone', 'Clube', 'Observação'];

    // CSV Rows
    const rows = opponents.map(opp => [
        escapeCSV(opp.name),
        escapeCSV(opp.phone),
        escapeCSV(opp.club || ''),
        escapeCSV(opp.observation || '')
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // Add BOM for Excel UTF-8 support
    const BOM = '\uFEFF';
    downloadFile(BOM + csvContent, filename, 'text/csv;charset=utf-8;');
};

/**
 * Escape CSV special characters
 */
const escapeCSV = (value: string): string => {
    if (!value) return '';

    // If value contains comma, quotes, or newline, wrap in quotes and escape quotes
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
};

/**
 * Download file to user's device
 */
const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
};
