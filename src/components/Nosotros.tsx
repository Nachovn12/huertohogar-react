import type { FC, ReactElement, ReactNode } from 'react';
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
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// --- Importaciones del Mapa ---
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { Map as LeafletMap } from 'leaflet'; 
import 'leaflet/dist/leaflet.css';

// --- Parche para los íconos de Leaflet ---
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

// --- 1. Definición de Tipos (Data) ---

type Tienda = {
  ciudad: string;
  direccion: string;
  horario: string;
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
  { ciudad: 'Santiago', direccion: 'Av. Providencia 1234, Providencia', horario: 'Lun a Vie: 09:00 - 20:00', lat: -33.4169, lng: -70.6091 },
  { ciudad: 'Puerto Montt', direccion: 'Av. Diego Portales 567, Puerto Montt', horario: 'Lun a Sáb: 10:00 - 19:00', lat: -41.4698, lng: -72.9396 },
  { ciudad: 'Villarrica', direccion: 'Av. Bernardo O\'Higgins 890, Villarrica', horario: 'Lun a Dom: 09:30 - 18:30', lat: -39.2783, lng: -72.2223 },
  { ciudad: 'Nacimiento', direccion: 'Av. Manuel Rodríguez 234, Nacimiento', horario: 'Lun a Vie: 09:00 - 18:00', lat: -37.5028, lng: -72.6713 },
  { ciudad: 'Viña del Mar', direccion: 'Av. Libertad 456, Viña del Mar', horario: 'Lun a Dom: 10:00 - 21:00', lat: -33.0153, lng: -71.5510 },
  { ciudad: 'Valparaíso', direccion: 'Av. Argentina 789, Valparaíso', horario: 'Lun a Sáb: 09:00 - 19:00', lat: -33.0505, lng: -71.6033 },
  { ciudad: 'Concepción', direccion: 'Av. Pedro de Valdivia 321, Concepción', horario: 'Lun a Vie: 08:30 - 20:30', lat: -36.8184, lng: -73.0360 },
  { ciudad: 'La Serena', direccion: 'Av. Francisco de Aguirre 654, La Serena', horario: 'Lun a Sáb: 10:00 - 20:00', lat: -29.9056, lng: -71.2589 },
  { ciudad: 'Antofagasta', direccion: 'Av. Argentina 987, Antofagasta', horario: 'Lun a Vie: 09:00 - 21:00', lat: -23.6599, lng: -70.4069 },
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

type MapProviderProps = {
  children: ReactNode;
};

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

const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext debe ser usado dentro de un MapProvider');
  }
  return context;
};

// --- 4. Componentes Reutilizables ---

// --- StatCard (Rediseñada) ---
interface StatCardProps {
  stat: Stat;
}
const StatCard: FC<StatCardProps> = ({ stat }) => (
  <Paper
    elevation={0}
    sx={{
      p: 4, 
      textAlign: 'center', 
      background: 'rgba(255, 255, 255, 0.95)', 
      borderRadius: 4,
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
      border: '1px solid rgba(46, 139, 87, 0.1)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 20px 40px -10px rgba(46, 139, 87, 0.2)',
        borderColor: '#2E8B57'
      }
    }}
  >
    <Box sx={{ mb: 2, position: 'relative' }}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 60,
        height: 60,
        borderRadius: '50%',
        bgcolor: 'rgba(46, 139, 87, 0.1)',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        color: '#2E8B57',
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {React.cloneElement(stat.icon as React.ReactElement, { fontSize: "large", sx: { fontSize: 40 } })}
      </Box>
    </Box>
    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, fontFamily: 'Montserrat, sans-serif', fontSize: { xs: '2rem', md: '2.5rem' } }}>
      {stat.value}
    </Typography>
    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>
      {stat.label}
    </Typography>
  </Paper>
);

// --- InfoCard ---
interface InfoCardProps {
  info: Info;
}
const InfoCard: FC<InfoCardProps> = ({ info }) => (
  <Paper
    elevation={0}
    sx={{
      p: 5, height: '100%',
      background: 'white',
      borderRadius: 4,
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      position: 'relative', 
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'
      }
    }}
  >
    {/* Decoración de fondo orgánica */}
    <Box sx={{ 
      position: 'absolute', 
      top: -20, 
      right: -20, 
      width: 200, 
      height: 200, 
      borderRadius: '50%', 
      bgcolor: info.title.includes('Misión') ? 'rgba(46, 139, 87, 0.04)' : 'rgba(59, 130, 246, 0.04)', 
      zIndex: 0 
    }} />
    
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Box
        sx={{
          width: 64, height: 64, borderRadius: '20px',
          bgcolor: info.title.includes('Misión') ? '#f0fdf4' : '#eff6ff',
          color: info.title.includes('Misión') ? '#16a34a' : '#2563eb',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mb: 3
        }}
      >
        {React.cloneElement(info.icon as React.ReactElement, { sx: { fontSize: 32 } })}
      </Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800, color: '#1e293b', mb: 2,
          fontSize: { xs: '1.5rem', md: '2rem' },
          fontFamily: 'Playfair Display, serif'
        }}
      >
        {info.title}
      </Typography>
      <Typography sx={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.8 }}>
        {info.description}
      </Typography>
    </Box>
  </Paper>
);

// --- StoreCard (Rediseñada Compacta) ---
interface StoreCardProps {
  tienda: Tienda;
}
const StoreCard: FC<StoreCardProps> = ({ tienda }) => {
  const { mapInstance } = useMapContext();

  const handleClick = () => {
    if (mapInstance) {
      mapInstance.flyTo([tienda.lat, tienda.lng], 15);
      const mapElement = document.getElementById('interactive-map');
      if (mapElement) mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Paper
      elevation={0}
      onClick={handleClick}
      sx={{
        p: 2, // Padding reducido
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: 'white',
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        height: '100%', // Altura consistente
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px -5px rgba(46, 139, 87, 0.15)',
          borderColor: '#4ade80',
          '& .icon-box': {
            transform: 'scale(1.05)',
            bgcolor: '#2E8B57',
          },
           '& .icon-content': {
            color: 'white'
          }
        }
      }}
    >
      <Box
        className="icon-box"
        sx={{
          width: 44, height: 44, borderRadius: '50%', // Icono más pequeño
          bgcolor: '#f0fdf4', color: '#16a34a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mb: 1.5, transition: 'all 0.2s ease'
        }}
      >
        <LocationOnIcon className="icon-content" sx={{ fontSize: 22, transition: 'color 0.2s ease' }} />
      </Box>
      
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5, fontFamily: 'Playfair Display, serif', lineHeight: 1.2 }}>
        {tienda.ciudad}
      </Typography>
      
      <Typography variant="body2" sx={{ color: '#64748b', mb: 1.5, fontSize: '0.8rem', minHeight: '32px' }}>
        {tienda.direccion}
      </Typography>

      <Box sx={{ 
        display: 'flex', alignItems: 'center', gap: 0.5, 
        bgcolor: '#f8fafc', px: 1.5, py: 0.5, borderRadius: 1.5,
        width: '100%', justifyContent: 'center', mt: 'auto'
      }}>
        <AccessTimeIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.7rem' }}>
          {tienda.horario}
        </Typography>
      </Box>
    </Paper>
  );
};

// --- 5. Componentes del Mapa ---

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

const InteractiveMap: FC = () => {
  const centerPosition: [number, number] = [-38.4161, -72.3438];

  return (
    <Box sx={{ height: '100%', width: '100%', minHeight: '400px' }}>
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
          >
            <Popup className="custom-popup">
              <Box>
                {/* Header Premium */}
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #2E8B57 0%, #166534 100%)',
                  p: 2.5,
                  position: 'relative'
                }}>
                  <Typography variant="h6" sx={{ 
                    fontFamily: 'Playfair Display, serif', 
                    fontWeight: 700, 
                    color: 'white',
                    fontSize: '1.25rem',
                    lineHeight: 1.2,
                    pr: 5 // Espacio para el botón de cerrar
                  }}>
                    {tienda.ciudad}
                  </Typography>
                  <Box sx={{ 
                    width: '40px', height: '3px', 
                    bgcolor: '#4ade80', mt: 1, borderRadius: 1,
                    opacity: 0.8
                  }} />
                </Box>

                {/* Body Content */}
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, alignItems: 'flex-start' }}>
                    <Box sx={{ 
                      mt: 0.3, p: 0.5, borderRadius: '50%', 
                      bgcolor: '#f1f5f9', display: 'flex' 
                    }}>
                      <LocationOnIcon sx={{ fontSize: 18, color: '#64748b' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.5, fontSize: '0.9rem' }}>
                      {tienda.direccion}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    bgcolor: '#f0fdf4', 
                    border: '1px dashed #86efac',
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                  }}>
                    <AccessTimeIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" sx={{ 
                        color: '#166534', fontWeight: 800, 
                        display: 'block', lineHeight: 1, 
                        letterSpacing: '0.5px', fontSize: '0.65rem', mb: 0.3,
                        textTransform: 'uppercase'
                      }}>
                        Horario de Atención
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#14532d', fontWeight: 600, fontSize: '0.8rem' }}>
                        {tienda.horario}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
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
    <Box sx={{ bgcolor: '#F9F7F2', minHeight: '100vh' }}>
      {/* Hero Section Premium */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white', 
          pt: { xs: 12, md: 20 },
          pb: { xs: 12, md: 24 }, // Espacio extra abajo para las stats flotantes
          position: 'relative', 
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box sx={{ 
            display: 'inline-block', 
            px: 2, py: 0.5, 
            mb: 3, 
            borderRadius: 20, 
            bgcolor: 'rgba(255,255,255,0.15)', 
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
              Nuestra Historia
            </Typography>
          </Box>
          
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              mb: 3, 
              letterSpacing: '-1px',
              fontFamily: 'Playfair Display, serif',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            Conectamos el Campo<br />
            <span style={{ color: '#4ade80', fontStyle: 'italic' }}>Chileno</span> Contigo
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              maxWidth: 800, 
              mx: 'auto',
              lineHeight: 1.8, 
              fontSize: { xs: '1.1rem', md: '1.35rem' },
              opacity: 0.9, 
              fontWeight: 300,
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            Desde hace más de 6 años, llevamos la frescura y calidad del campo chileno directamente a tu hogar, promoviendo una alimentación saludable y sostenible.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        
        {/* Estadísticas Flotantes */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
          gap: 3, 
          mt: { xs: -6, md: -10 }, // Margen negativo para flotar sobre el hero
          mb: 10,
          position: 'relative',
          zIndex: 2
        }}>
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </Box>

        {/* Misión y Visión */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 12 }}>
          {infoCards.map((info) => (
            <InfoCard key={info.title} info={info} />
          ))}
        </Box>

        {/* --- SECCIÓN DE MAPA Y TIENDAS --- */}
        <Box sx={{ mb: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h2" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
                    Nuestras Tiendas
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}>
                    Encuentra tu punto de venta HuertoHogar más cercano y visítanos.
                </Typography>
            </Box>

            <MapProvider>
              {/* Mapa Grande */}
              <Box id="interactive-map" sx={{ 
                height: '500px', 
                borderRadius: 6, 
                overflow: 'hidden', 
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                border: '4px solid white',
                mb: 6
              }}>
                <InteractiveMap />
              </Box>

              {/* Grid de Tiendas */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, 
                gap: 2 
              }}>
                {tiendas.map((tienda) => (
                  <StoreCard key={tienda.ciudad} tienda={tienda} />
                ))}
              </Box>
            </MapProvider>
        </Box>
        {/* --- FIN DE LA SECCIÓN DEL MAPA --- */}

      </Container>
    </Box>
  );
};

export default Nosotros;