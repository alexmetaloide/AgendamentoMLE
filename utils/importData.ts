import Papa from 'papaparse';
import { Opponent } from '../types';

/**
 * Parse and validate JSON file
 */
export const parseJSONFile = (file: File): Promise<Opponent[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                // Validate data structure
                if (!Array.isArray(data)) {
                    throw new Error('Arquivo JSON deve conter um array de adversários');
                }

                const validatedData = data.map((item, index) => {
                    const validated = validateOpponentData(item);
                    if (!validated.valid) {
                        throw new Error(`Erro na linha ${index + 1}: ${validated.error}`);
                    }
                    // Add temporary ID that will be replaced when added to Firebase
                    return { ...validated.opponent!, id: `temp-${Date.now()}-${index}` } as Opponent;
                });

                resolve(validatedData);
            } catch (error) {
                reject(error instanceof Error ? error : new Error('Erro ao processar arquivo JSON'));
            }
        };

        reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
        reader.readAsText(file);
    });
};

/**
 * Parse and validate CSV file
 */
export const parseCSVFile = (file: File): Promise<Opponent[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const opponents: Opponent[] = [];

                    for (let i = 0; i < results.data.length; i++) {
                        const row = results.data[i] as any;

                        // Map CSV columns to Opponent structure
                        const opponent = {
                            name: row.Nome || row.name || '',
                            phone: row.Telefone || row.phone || '',
                            club: row.Clube || row.club || '',
                            observation: row['Observação'] || row.Observacao || row.observation || ''
                        };

                        const validated = validateOpponentData(opponent);
                        if (!validated.valid) {
                            throw new Error(`Erro na linha ${i + 2}: ${validated.error}`);
                        }

                        // Add temporary ID that will be replaced when added to Firebase
                        opponents.push({ ...validated.opponent!, id: `temp-${Date.now()}-${i}` } as Opponent);
                    }

                    if (opponents.length === 0) {
                        throw new Error('Nenhum adversário válido encontrado no arquivo CSV');
                    }

                    resolve(opponents);
                } catch (error) {
                    reject(error instanceof Error ? error : new Error('Erro ao processar arquivo CSV'));
                }
            },
            error: (error) => {
                reject(new Error(`Erro ao ler CSV: ${error.message}`));
            }
        });
    });
};

/**
 * Validate opponent data structure
 */
export const validateOpponentData = (data: any): { valid: boolean; error?: string; opponent?: Omit<Opponent, 'id'> } => {
    // Check required fields
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
        return { valid: false, error: 'Nome é obrigatório' };
    }

    if (!data.phone || typeof data.phone !== 'string' || data.phone.trim() === '') {
        return { valid: false, error: 'Telefone é obrigatório' };
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(data.phone)) {
        return { valid: false, error: 'Formato de telefone inválido' };
    }

    // Return validated opponent
    return {
        valid: true,
        opponent: {
            name: data.name.trim(),
            phone: data.phone.trim(),
            club: data.club ? data.club.trim() : '',
            observation: data.observation ? data.observation.trim() : ''
        }
    };
};

/**
 * Check if file is valid type
 */
export const isValidFileType = (file: File, acceptedTypes: string[]): boolean => {
    return acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
            const baseType = type.split('/')[0];
            return file.type.startsWith(baseType + '/');
        }
        return file.type === type || file.name.endsWith(type.replace('application/', '.').replace('text/', '.'));
    });
};
