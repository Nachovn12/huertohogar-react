import type { FC, ReactElement, ReactNode } from 'react'; // <--- ARREGLO 1: Importado ReactNode
import React, { useState, useMemo, useContext, createContext, useEffect } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

// --- Iconos de MUI ---
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupsIcon from '@mui/icons-material/Groups';
import PublicIcon from '@mui/icons-material/Public';
import SpaIcon from '@mui/icons-material/Spa';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import VisibilityIcon from '@mui/icons-material/Visibility';

// --- Importaciones del Mapa ---
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { Map as LeafletMap } from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; // Esto funcionará después del Paso 5

// --- ARREGLO 2: Parche para los íconos de Leaflet ---
// Esto soluciona los errores de "marker-icon.png"
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

// Importamos las imágenes directamente desde el paquete
import markerIconPng from "../assets/images/marker-icon.png";
import markerShadowPng from "../assets/images/marker-shadow.png";
import markerIcon2xPng from "../assets/images/marker-icon-2x.png";

// Configuramos las rutas globalmente
L.Icon.Default.mergeOptions({
  iconUrl: markerIconPng,
  iconRetinaUrl: markerIcon2xPng,
  shadowUrl: markerShadowPng,
});
// --- FIN DEL ARREGLO 2 ---


// --- 1. Definición de Tipos (Data) ---

type Tienda = {
  ciudad: string;
  direccion: string;
  lat: number;
  lng: number;
};

type Stat = {
  value: string;
  label: string;
  icon: ReactElement;
};

type Info = {
  title: string;
  description: string;
  icon: ReactElement;
};

// --- 2. Datos Centralizados ---

const tiendas: Tienda[] = [
  { ciudad: 'Santiago', direccion: 'Av. Providencia 1234, Providencia', lat: -33.4169, lng: -70.6091 },
  { ciudad: 'Puerto Montt', direccion: 'Av. Diego Portales 567, Puerto Montt', lat: -41.4698, lng: -72.9396 },
  { ciudad: 'Villarrica', direccion: 'Av. Bernardo O\'Higgins 890, Villarrica', lat: -39.2783, lng: -72.2223 },
  { ciudad: 'Nacimiento', direccion: 'Av. Manuel Rodríguez 234, Nacimiento', lat: -37.5028, lng: -72.6713 },
  { ciudad: 'Viña del Mar', direccion: 'Av. Libertad 456, Viña del Mar', lat: -33.0153, lng: -71.5510 },
  { ciudad: 'Valparaíso', direccion: 'Av. Argentina 789, Valparaíso', lat: -33.0505, lng: -71.6033 },
  { ciudad: 'Concepción', direccion: 'Av. Pedro de Valdivia 321, Concepción', lat: -36.8184, lng: -73.0360 },
  { ciudad: 'La Serena', direccion: 'Av. Francisco de Aguirre 654, La Serena', lat: -29.9056, lng: -71.2589 },
  { ciudad: 'Antofagasta', direccion: 'Av. Argentina 987, Antofagasta', lat: -23.6599, lng: -70.4069 },
];

const stats: Stat[] = [
  { value: '10,000+', label: 'Clientes Satisfechos', icon: <GroupsIcon fontSize="large" /> },
  { value: '9+', label: 'Ciudades con Cobertura', icon: <PublicIcon fontSize="large" /> },
  { value: '6+', label: 'Años de Experiencia', icon: <SpaIcon fontSize="large" /> },
  { value: '100%', label: 'Productos Certificados', icon: <CheckCircleIcon fontSize="large" /> }
];

const infoCards: Info[] = [
  {
    title: 'Nuestra Misión',
    description: 'Proporcionar productos frescos y de calidad directamente desde el campo hasta tu puerta, garantizando frescura y sabor en cada entrega. Fomentamos la conexión entre consumidores y agricultores locales, apoyando prácticas sostenibles y promoviendo una alimentación saludable en todos los hogares chilenos.',
    icon: <RocketLaunchIcon sx={{ fontSize: 44, color: 'white' }} />
  },
  {
    title: 'Nuestra Visión',
    description: 'Ser la tienda online líder en distribución de productos frescos y naturales en Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la sostenibilidad. Aspiramos a expandir nuestra presencia a nivel nacional e internacional, estableciendo un nuevo estándar en la distribución directa del productor al consumidor.',
    icon: <VisibilityIcon sx={{ fontSize: 44, color: 'white' }} />
  }
];

// --- 3. Lógica del Mapa Interactivo ---

type MapContextType = {
  mapInstance: LeafletMap | null;
  setMapInstance: (map: LeafletMap | null) => void;
};

const MapContext = createContext<MapContextType | null>(null);

// --- ARREGLO 3: Corregir el tipo de 'children' ---
type MapProviderProps = {
  children: ReactNode;
};

// Usamos las props definidas
const MapProvider = ({ children }: MapProviderProps) => {
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);

  const value = useMemo(() => ({
    mapInstance,
    setMapInstance
  }), [mapInstance]);

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};
// --- FIN DEL ARREGLO 3 ---

const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext debe ser usado dentro de un MapProvider');
  }
  return context;
};

// --- 4. Componentes Reutilizables ---

// --- StatCard --- (sin cambios)
interface StatCardProps {
  stat: Stat;
}
const StatCard: FC<StatCardProps> = ({ stat }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3, textAlign: 'center', background: 'white', borderRadius: 3,
      border: '2px solid', borderColor: '#e2e8f0',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: '#2E8B57',
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 24px rgba(46, 139, 87, 0.15)'
      }
    }}
  >
    <Box sx={{ mb: 2 }}>
      <Box sx={{
        width: 56, height: 56, borderRadius: '50%', bgcolor: '#2E8B57',
        color: 'white', display: 'flex', alignItems: 'center',
        justifyContent: 'center', mx: 'auto'
      }}>
        {stat.icon}
      </Box>
    </Box>
    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
      {stat.value}
    </Typography>
    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
      {stat.label}
    </Typography>
  </Paper>
);

// --- InfoCard --- (sin cambios)
interface InfoCardProps {
  info: Info;
}
const InfoCard: FC<InfoCardProps> = ({ info }) => (
  <Paper
    elevation={0}
    sx={{
      p: 5, height: '100%',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
      borderRadius: 4, border: '2px solid #bbf7d0',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 32px rgba(46, 139, 87, 0.2)'
      }
    }}
  >
    <Box
      sx={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'linear-gradient(135deg, #2E8B57 0%, #1f6a3f 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        mb: 3, boxShadow: '0 8px 24px rgba(46, 139, 87, 0.3)'
      }}
    >
      {info.icon}
    </Box>
    <Typography
      variant="h4"
      sx={{
        fontWeight: 800, color: '#1e293b', mb: 3,
        fontSize: { xs: '1.5rem', md: '2rem' }
      }}
    >
      {info.title}
    </Typography>
    <Typography sx={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8 }}>
      {info.description}
    </Typography>
  </Paper>
);

// --- StoreCard --- (sin cambios, usa el contexto)
interface StoreCardProps {
  tienda: Tienda;
}
const StoreCard: FC<StoreCardProps> = ({ tienda }) => {
  const { mapInstance } = useMapContext();

  const handleClick = () => {
    if (mapInstance) {
      mapInstance.flyTo([tienda.lat, tienda.lng], 15);
    }
  };

  return (
    <Paper
      elevation={0}
      onClick={handleClick}
      sx={{
        p: 2.5, borderRadius: 3, display: 'flex',
        alignItems: 'flex-start', gap: 2, background: '#f8fafc',
        border: '2px solid #e2e8f0', cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
          borderColor: '#2E8B57',
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(46, 139, 87, 0.15)'
        }
      }}
    >
      <Box
        sx={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2E8B57 0%, #1f6a3f 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <LocationOnIcon sx={{ color: 'white', fontSize: 22 }} />
      </Box>
      <Box>
        <Typography
          sx={{
            fontWeight: 700, color: '#1e293b',
            fontSize: '1.05rem', mb: 0.5
          }}
        >
          {tienda.ciudad}
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
          {tienda.direccion}
        </Typography>
      </Box>
    </Paper>
  );
};

// --- 5. Componentes del Mapa ---

// Componente para controlar y guardar la instancia del mapa
const MapController: FC = () => {
  const map = useMap();
  const { setMapInstance } = useMapContext();

  useEffect(() => {
    if (map) {
      setMapInstance(map);
    }
    return () => {
      setMapInstance(null);
    };
  }, [map, setMapInstance]);

  return null; 
};

// Componente principal del mapa
const InteractiveMap: FC = () => {
  const centerPosition: [number, number] = [-38.4161, -72.3438];

  return (
    <Box
      sx={{
        height: '450px',
        borderRadius: 3, overflow: 'hidden',
        mb: 4, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      <MapContainer
        center={centerPosition}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {tiendas.map((tienda) => (
          <Marker
            key={tienda.ciudad}
            position={[tienda.lat, tienda.lng]}
            // Ya no se necesita 'icon' porque lo arreglamos globalmente
          >
            <Popup>
              <b>{tienda.ciudad}</b><br />
              {tienda.direccion}
            </Popup>
          </Marker>
        ))}

        <MapController />
      </MapContainer>
    </Box>
  );
};


// --- 6. Componente Principal (Nosotros) ---

const Nosotros: FC = () => {
  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2E8B57 0%, #1f6a3f 100%)',
          color: 'white', py: { xs: 6, md: 10 },
          position: 'relative', overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h1"
            sx={{
              textAlign: 'center', fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 3, letterSpacing: '-1px'
            }}
          >
            Conectamos el Campo Chileno Contigo
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center', maxWidth: 900, mx: 'auto',
              lineHeight: 1.8, fontSize: { xs: '1.1rem', md: '1.25rem' },
              opacity: 0.95, fontWeight: 400
            }}
          >
            Desde hace más de 6 años, llevamos la frescura y calidad del campo chileno directamente a tu hogar.
            Con presencia en más de 9 ciudades, conectamos familias con productores locales, promoviendo
            una alimentación saludable y sostenible.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        
        {/* Estadísticas */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 3, mb: 8 }}>
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </Box>

        {/* Misión y Visión */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 8 }}>
          {infoCards.map((info) => (
            <InfoCard key={info.title} info={info} />
          ))}
        </Box>

        {/* --- SECCIÓN DE MAPA Y TIENDAS --- */}
        {/* Envolvemos con el MapProvider */}
        <MapProvider>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 }, borderRadius: 4,
              background: 'white', border: '2px solid #e2e8f0',
              mb: 4, overflow: 'hidden'
            }}
          >
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center', fontWeight: 800, color: '#1e293b',
                mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' }
              }}
            >
              Nuestras Tiendas
            </Typography>
            <Typography
              sx={{
                textAlign: 'center', color: '#64748b',
                mb: 4, fontSize: '1.1rem'
              }}
            >
              Haz clic en cualquier tienda para verla en el mapa
            </Typography>

            <InteractiveMap />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)' }, gap: 2 }}>
              {tiendas.map((tienda) => (
                <StoreCard key={tienda.ciudad} tienda={tienda} />
              ))}
            </Box>
          </Paper>
        </MapProvider>
        {/* --- FIN DE LA SECCIÓN DEL MAPA --- */}

      </Container>
    </Box>
  );
};

export default Nosotros;