import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text, 
  TouchableOpacity, 
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ZoomIn, ZoomOut } from 'lucide-react-native';

type ImageViewerProps = {
  imageUri: string;
  title?: string;
};

// Map global para cache de imagens entre componentes
const imageCache = new Map<string, string>();

// Define o componente funcional
function ImageViewerComponent({ imageUri, title }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cachedUri, setCachedUri] = useState<string>('');
  // Usamos any para compatibilidade com diferentes plataformas
  const imageRef = useRef<any>(null);
  const loadAttempts = useRef(0);
  const imageLoadTimer = useRef<number | null>(null); // Ref para guardar o tempo
  
  // Otimização: verifica se a imagem já foi carregada antes
  const memoizedUri = useMemo(() => {
    console.log('[ImageViewer] imageUri recebida:', imageUri);
    
    if (!imageUri) {
      console.log('[ImageViewer] imageUri vazia ou inválida');
      return '';
    }
    
    // A URL já vem processada do louisService, não fazemos outro processamento
    // A URL já deve ser absoluta com domínio completo (http://... ou https://...)
    console.log('[ImageViewer] Usando URL já processada:', imageUri);
    
    // Verifica se a imagem já está no cache global em memória (menos útil para web)
    // if (imageCache.has(imageUri)) {
    //   console.log('Usando imagem do cache global:', imageUri);
    //   return imageCache.get(imageUri) || '';
    // }

    // Deixa o navegador/plataforma gerenciar o cache HTTP padrão.
    // Não adiciona timestamp _t automaticamente.
    // imageCache.set(imageUri, imageUri); // Cache em memória pode não ser necessário aqui
    return imageUri;
  }, [imageUri]);
  
  // Atualiza a URI em cache apenas quando a memoizedUri realmente muda
  useEffect(() => {
    console.log('[ImageViewer] useEffect - memoizedUri:', memoizedUri);
    console.log('[ImageViewer] useEffect - cachedUri atual:', cachedUri);
    
    // Verifica se a URI processada (memoizedUri) é diferente da URI atualmente no estado (cachedUri)
    // e se memoizedUri não está vazia.
    if (memoizedUri && memoizedUri !== cachedUri) {
      console.log('[ImageViewer] Atualizando cachedUri para:', memoizedUri);
      setLoading(true); // Reinicia o loading para a nova imagem
      setError(false);
      setCachedUri(memoizedUri); // Atualiza o estado que vai para a <Image>
      loadAttempts.current = 0; // Reseta tentativas para a nova imagem
      console.log('[ImageViewer] Estado atualizado: loading=true, error=false, tentativas=0');
    } else {
      console.log('[ImageViewer] URI não alterada ou vazia, mantendo estado atual');
    }
    // A dependência em cachedUri aqui garante que o efeito rode se cachedUri for alterado externamente,
    // mas a condição if previne loops se memoizedUri não mudou.
  }, [memoizedUri, cachedUri]);
  
  const windowWidth = Dimensions.get('window').width;
  const imageWidth = Math.min(windowWidth - (Layout.spacing.m * 2), 500);
  
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };
  
  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleLoadStart = () => {
    // Removido para evitar múltiplos ciclos de renderização no web. O estado loading já é
    // controlado quando a URI muda (useEffect) e quando onLoad/onError são disparados.
  };

  const handleLoadSuccess = () => {
    console.log('[ImageViewer] Imagem carregada com sucesso:', cachedUri || memoizedUri);
    setLoading(false);
    if (imageLoadTimer.current) {
      const loadTime = Date.now() - imageLoadTimer.current;
      console.log(`[ImageViewer] Tempo de carregamento: ${loadTime}ms`);
      imageLoadTimer.current = null; // Limpa o timer
    }
    // Registra que a imagem foi carregada com sucesso
    if (imageUri) {
      imageCache.set(imageUri, cachedUri || memoizedUri);
      console.log('[ImageViewer] Imagem adicionada ao cache com chave:', imageUri);
    }
  };

  const handleLoadError = (errorEvent: any) => { // Adiciona parâmetro de erro
    const nativeEvent = errorEvent?.nativeEvent || {}; // Acessa nativeEvent se existir
    console.log('[ImageViewer] Erro ao carregar imagem:', cachedUri || memoizedUri);
    console.log('[ImageViewer] Detalhes do erro:', nativeEvent);
    
    if (imageLoadTimer.current) {
      const loadTime = Date.now() - imageLoadTimer.current;
      console.log(`[ImageViewer] Tempo até erro: ${loadTime}ms`);
      imageLoadTimer.current = null; // Limpa o timer
    }
    
    // Tenta novamente algumas vezes antes de desistir (máximo 3 tentativas)
    if (loadAttempts.current < 3) {
      loadAttempts.current += 1;
      console.log(`[ImageViewer] Tentativa ${loadAttempts.current}/3 para carregar a imagem`);
      
      // Força uma nova tentativa com um novo timestamp (APENAS no erro)
      if (Platform.OS === 'web' && memoizedUri) { // Usa memoizedUri como base
        // Gera uma URI única para tentar furar o cache APENAS na tentativa de erro
        const retryUri = `${memoizedUri}${memoizedUri.includes('?') ? '&' : '?'}retry=${Date.now()}`;
        console.log('[ImageViewer] Nova tentativa com URI única:', retryUri);
        setCachedUri(retryUri); // Atualiza o estado para disparar a nova tentativa
        // Não retorna aqui, permite que setLoading(false) e setError(true) sejam definidos abaixo
        // A nova atualização de cachedUri acionará o useEffect e resetará loading/error.
        // No entanto, precisamos garantir que loading seja true para a tentativa.
        setLoading(true); // Garante que o loading seja exibido durante a nova tentativa
        setError(false); // Limpa o erro para a nova tentativa
        return; // Retorna para evitar setar error=true imediatamente
      }
    } else {
      console.log('[ImageViewer] Excedido número máximo de tentativas, desistindo');
    }
    
    setLoading(false);
    setError(true);
    console.log('[ImageViewer] Estado final após erro: loading=false, error=true');
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={[styles.imageContainer, { width: imageWidth }]}>
        {loading && (
          <View style={[styles.loadingContainer, { width: imageWidth, height: imageWidth }]}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Carregando imagem...</Text>
          </View>
        )}
        
        {error && (
          <View style={[styles.errorContainer, { width: imageWidth, height: imageWidth }]}>
            <Text style={styles.errorText}>Erro ao carregar imagem</Text>
          </View>
        )}
        
        {/* Imagem de baixa resolução/placeholder enquanto a imagem real carrega */}
        {loading && imageUri && (
          <View style={[styles.placeholderContainer, { width: imageWidth, height: imageWidth }]}>
            <Text style={styles.placeholderText}>Carregando ilustração...</Text>
          </View>
        )}
        
        <Image
          ref={imageRef}
          source={{ uri: cachedUri || memoizedUri }}
          style={[
            styles.image, 
            { 
              width: imageWidth, 
              height: imageWidth,
              transform: [{ scale: zoom }],
              opacity: loading || error ? 0 : 1,
            }
          ]}
          resizeMode="contain"
          onLoadStart={() => {
            console.log('[ImageViewer] Iniciando carregamento da imagem:', cachedUri || memoizedUri);
            imageLoadTimer.current = Date.now(); // Inicia timer
          }}
          onLoad={handleLoadSuccess}
          onError={handleLoadError}
          // Otimizações de desempenho - apenas propriedades compatíveis
          fadeDuration={0}
        />
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={zoomOut}
          disabled={zoom <= 0.5}
        >
          <ZoomOut size={20} color={zoom <= 0.5 ? Colors.textTertiary : Colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={zoomIn}
          disabled={zoom >= 3}
        >
          <ZoomIn size={20} color={zoom >= 3 ? Colors.textTertiary : Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Exporta a versão memoizada do componente
export default React.memo(ImageViewerComponent);

const styles = StyleSheet.create({
  container: {
    padding: Layout.spacing.m,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: Layout.spacing.m,
    textAlign: 'center',
  },
  imageContainer: {
    borderRadius: Layout.borderRadius.m,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    flexDirection: 'column',
    gap: Layout.spacing.s,
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.s,
  },
  placeholderContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    opacity: 0.7,
  },
  placeholderText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  errorContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.error,
  },
  image: {
    // Removido resizeMode do estilo para usar como prop diretamente
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Layout.spacing.m,
  },
  controlButton: {
    padding: Layout.spacing.s,
    backgroundColor: Colors.lightGray,
    borderRadius: Layout.borderRadius.round,
    marginHorizontal: Layout.spacing.s,
  },
  zoomText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    width: 60,
    textAlign: 'center',
  },
});