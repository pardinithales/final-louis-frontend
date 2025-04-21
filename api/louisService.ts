import { Platform } from 'react-native';

// Base URL for the API - use environment variable if available
// Seleciona a URL base considerando HTTPS em produção (sem porta 8000) e HTTP com porta em desenvolvimento/native
const BASE_DOMAIN = 'louis.tpfbrain.com';
const BASE_PATH = '/api/v1';

// Base URL da API
const BASE_URL =
  typeof window !== 'undefined'
    // WEB: usa exatamente o mesmo host + protocolo do frontend
    ? `${window.location.origin}/api/v1`
    // React Native / dev local: ainda aponta para porta 8000 em HTTP
    : 'http://louis.tpfbrain.com:8000/api/v1';



export type SyndromeType = {
  syndrome: string;
  artery: string;
  lesion_site: string;
};

export type QueryResponseType = {
  query: string;
  answer: string;
  image_url?: string; // URL da imagem retornada pela API
  retrieved_chunks: Array<{
    document_id: string;
    chunk_id: string;
    text: string;
    score: number;
    metadata?: {
      filename?: string;
      source?: string;
      [key: string]: any;
    };
  }>;
};

export type ParsedResponseType = {
  query: string;
  syndromes: SyndromeType[];
  notes: string[];
  imageUrl: string;
  retrievedChunks: Array<{
    text: string;
    score: number;
    source: string;
  }>;
};

// Helper function to parse the answer string to extract syndromes and notes
const parseAnswer = (answer: string): { syndromes: SyndromeType[], notes: string[] } => {
  try {
    // Extract the JSON part (syndromes list)
    const syndromeMatch = answer.match(/Lista de síndromes:\s*(\[.*?\])/s);
    if (!syndromeMatch || !syndromeMatch[1]) {
      console.log('No syndromes found in answer:', answer);
      return { syndromes: [], notes: [] };
    }
    
    const syndromes: SyndromeType[] = JSON.parse(syndromeMatch[1].trim());
    
    // Extract notes section
    const notesMatch = answer.match(/Notas:\s*((?:#\d+:[^#]*)+)(?=\[|$)/);
    if (!notesMatch || !notesMatch[1]) {
      return { syndromes, notes: [] };
    }
    
    // Split notes by #number: pattern and clean them up
    const notes = notesMatch[1]
      .split(/#\d+:\s*/)
      .filter(note => note.trim().length > 0)
      .map(note => note.trim());
    
    return { syndromes, notes };
  } catch (error) {
    console.error('Error parsing answer:', error);
    console.log('Raw answer:', answer);
    return { syndromes: [], notes: [] };
  }
};

// Adiciona o domínio base a URLs relativas de imagens
export const ensureFullImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';

  // Se já é uma URL completa (http ou https), retorna como está
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Se começa com /static/images/, mantém como está (já está correto para Nginx)
  if (imageUrl.startsWith('/static/images/')) {
    return imageUrl;
  }

  // Para qualquer caminho relativo (ex: apenas nome), converte para caminho local
  return `/static/images/${imageUrl.replace(/^\/?/, '')}`;
};

// URL padrão para casos de fallback
const getDefaultImageUrl = (): string => {
  return ensureFullImageUrl('/static/images/default_brain.png');
};

/**
 * Send a query to the LouiS API
 */
export const queryLouisAPI = async (query: string, topK = 3): Promise<ParsedResponseType | null> => {
  const queryStartTime = Date.now(); // Início Tempo Total
  try {
    console.log('Sending query to API:', query);
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    console.time('API Call: /query'); // Medir tempo do fetch /query
    const response = await fetch(`${BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        top_k: topK,
      }),
      signal: controller.signal,
    });
    console.timeEnd('API Call: /query'); // Fim tempo do fetch /query

    clearTimeout(timeoutId);

    // First check if the response is ok
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        const textContent = await response.text();
        errorData = { error: textContent };
      }
      throw new Error(`API request failed: ${errorData.error || response.statusText}`);
    }

    // Check content type before attempting to parse JSON
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const textContent = await response.text();
      console.error('Received non-JSON response:', textContent);
      throw new Error(`Received invalid response type: ${contentType}`);
    }

    const data: QueryResponseType = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    // Verificar se a resposta contém image_url
    if (!data.image_url) {
      console.warn('Backend não retornou image_url na resposta');
    } else {
      console.log('Image URL recebida (original):', data.image_url);
      // Converte para URL completa
      data.image_url = ensureFullImageUrl(data.image_url);
      console.log('Image URL com domínio completo:', data.image_url);
    }
    
    // Parse the answer to extract syndromes and notes
    const { syndromes, notes } = parseAnswer(data.answer);
    
    // Usamos a URL da imagem diretamente fornecida pela API ou solicitamos uma imagem baseada na síndrome
    let imageUrl = '';
    
    if (data.image_url) {
      // Se a API já forneceu uma URL, usamos diretamente (já convertida para URL completa)
      imageUrl = data.image_url;
      console.log('Usando image_url da resposta:', imageUrl);
    } else if (syndromes.length > 0) {
      // Se não tiver URL mas tiver síndrome, tentamos obter a imagem com base na localização da lesão
      try {
        console.time('API Call: getImageForLesionSite'); // Medir tempo da função getImageForLesionSite
        const imageUrlFromSyndrome = await getImageForLesionSite(syndromes[0].lesion_site);
        console.timeEnd('API Call: getImageForLesionSite'); // Fim tempo da função getImageForLesionSite
        imageUrl = imageUrlFromSyndrome || getDefaultImageUrl();
        console.log('Obtida URL da imagem via getImageForLesionSite:', imageUrl);
      } catch (error) {
        console.error('Erro ao obter imagem para síndrome:', error);
        imageUrl = getDefaultImageUrl();
      }
    } else {
      // Fallback para imagem padrão
      imageUrl = getDefaultImageUrl();
      console.log('Usando imagem padrão:', imageUrl);
    }
    
    // Format the retrieved chunks
    const retrievedChunks = data.retrieved_chunks.map(chunk => ({
      text: chunk.text,
      score: chunk.score,
      source: chunk.metadata?.source || 'Literatura médica',
    }));
    
    const result = {
      query: data.query,
      syndromes,
      notes,
      imageUrl: imageUrl || '', // Garantir que imageUrl sempre seja uma string, nunca null
      retrievedChunks,
    };
    
    // Log detalhado do resultado final para depuração
    console.log('Resultado final parseado:', JSON.stringify({
      query: result.query,
      syndromes: result.syndromes.length,
      notes: result.notes.length,
      imageUrl: result.imageUrl,
      retrievedChunks: result.retrievedChunks.length
    }, null, 2));
    
    const queryEndTime = Date.now(); // Fim Tempo Total
    console.log(`Tempo total queryLouisAPI: ${queryEndTime - queryStartTime}ms`); // Log tempo total

    console.log('Parsed result:', result);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Request timed out after 30 seconds');
        throw new Error('A solicitação excedeu o tempo limite. Por favor, tente novamente.');
      }
      if (error.message.includes('Failed to fetch')) {
        console.error('Network error:', error);
        throw new Error('Não foi possível conectar ao servidor. Por favor, verifique sua conexão e tente novamente.');
      }
      console.error('Error querying Louis API:', error);
      throw error;
    }
    console.error('Unknown error:', error);
    const queryEndTime = Date.now(); // Fim Tempo Total (em caso de erro)
    console.log(`Tempo total queryLouisAPI (com erro): ${queryEndTime - queryStartTime}ms`); // Log tempo total
    throw new Error('Ocorreu um erro inesperado. Por favor, tente novamente.');
  }
};

/**
 * Solicita uma imagem específica com base no local da lesão
 */
export const getImageForLesionSite = async (lesionSite: string): Promise<string | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos de timeout

    console.time('API Call: /image/select'); // Medir tempo do fetch /image/select
    const response = await fetch(`${BASE_URL}/image/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        lesion_site: lesionSite,
      }),
      signal: controller.signal,
    });
    console.timeEnd('API Call: /image/select'); // Fim tempo do fetch /image/select

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      // Retorna uma imagem padrão em caso de erro
      return getDefaultImageUrl();
    }

    const data = await response.json();
    
    // Verifica se o backend retornou a URL da imagem
    if (data && data.image_url) {
      // Garante que a URL da imagem inclua o domínio completo
      return ensureFullImageUrl(data.image_url);
    } else {
      // Retorna uma imagem padrão se o backend não retornou uma URL
      console.warn('Backend did not return an image URL');
      return getDefaultImageUrl();
    }
  } catch (error) {
    console.error('Error getting image:', error);
    // Retorna uma imagem padrão em caso de erro
    return getDefaultImageUrl();
  }
};