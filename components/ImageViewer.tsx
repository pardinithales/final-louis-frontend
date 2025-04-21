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

export default function ImageViewer({ imageUri, title }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cachedUri, setCachedUri] = useState<string>('');
  // Usamos any para compatibilidade com diferentes plataformas
  const imageRef = useRef<any>(null);
  const loadAttempts = useRef(0);
  
  // Otimização: verifica se a imagem já foi carregada antes
  const memoizedUri = useMemo(() => {
    if (!imageUri) return '';
    
    // Verifica se a imagem já está no cache global
    if (imageCache.has(imageUri)) {
      console.log('Usando imagem do cache global:', imageUri);
      return imageCache.get(imageUri) || '';
    }
    
    // Para ambiente web com problemas de cache
    if (Platform.OS === 'web') {
      // Usa um timestamp apenas se for a primeira vez carregando esta imagem
      const cachedUri = `${imageUri}${imageUri.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      imageCache.set(imageUri, cachedUri);
      return cachedUri;
    }
    
    // Em dispositivos nativos ou quando já temos a imagem em cache
    imageCache.set(imageUri, imageUri);
    return imageUri;
  }, [imageUri]);
  
  // Atualiza a URI em cache apenas quando a memoizedUri muda
  useEffect(() => {
    if (memoizedUri && memoizedUri !== cachedUri) {
      setLoading(true);
      setError(false);
      setCachedUri(memoizedUri);
    }
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
    setLoading(true);
    setError(false);
    loadAttempts.current = 0;
  };

  const handleLoadSuccess = () => {
    setLoading(false);
    // Registra que a imagem foi carregada com sucesso
    if (imageUri) {
      imageCache.set(imageUri, cachedUri || memoizedUri);
    }
  };

  const handleLoadError = () => {
    // Tenta novamente algumas vezes antes de desistir (máximo 3 tentativas)
    if (loadAttempts.current < 3) {
      loadAttempts.current += 1;
      console.log(`Tentativa ${loadAttempts.current} de carregar a imagem: ${imageUri}`);
      
      // Força uma nova tentativa com um novo timestamp
      if (Platform.OS === 'web' && imageUri) {
        const newUri = `${imageUri}${imageUri.includes('?') ? '&' : '?'}_retry=${Date.now()}`;
        setCachedUri(newUri);
        return;
      }
    }
    
    setLoading(false);
    setError(true);
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
          onLoadStart={handleLoadStart}
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