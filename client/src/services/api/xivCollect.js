import axios, { HttpStatusCode } from 'axios';

const API_URL = 'https://ffxivcollect.com/api/';

// Configuration de base pour axios
const api = axios.create({
    method: 'get',
    maxBodyLength: Infinity,
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Recherche des personnages par nom et serveur optionnel
 */
export const searchMounts = async () => {
    try {
        const response = await api.get('/mounts');

        if (response.status === HttpStatusCode.Ok) {

            const filteredMounts = response.data.results.filter((mount) => {
                return (mount.sources[0].type !== 'Limited' && mount.sources[0].type !== 'Premium' && mount.sources[0].type !== 'Event')
            })

            const sortedMounts = filteredMounts.sort((a, b) => a.id - b.id);

            console.log(sortedMounts);

            return sortedMounts
        } else {
            throw new Error('Erreur lors de la recherche des montures');
        }
    } catch (error) {
        console.error('Erreur API searchMounts:', error);
        throw error;
    }
};

export default api;