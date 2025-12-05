import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAvailableCategories } from '../hooks/useApi';
import '../styles/Chatbot.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
  productLinks?: { text: string; url: string }[];
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Cargar categorías desde la API
  const { categories } = useAvailableCategories();
  
  // Crear mapa de categorías: nombre → ID
  const categoryMap = React.useMemo(() => {
    const map: { [key: string]: number } = {};
    categories.forEach(cat => {
      map[cat.nombre.toLowerCase()] = cat.id;
    });
    return map;
  }, [categories]);

  // Mensaje de bienvenida
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(
          '¡Hola! 👋 Soy el asistente virtual de HuertoHogar. ¿En qué puedo ayudarte hoy?',
          [
            'Ver productos frescos',
            'Ofertas del día',
            'Rastrear mi pedido',
            'Hablar con soporte'
          ]
        );
      }, 500);
    }
  }, [isOpen]);

  // Auto scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Bloquear scroll y ocultar banner en móvil cuando el chat está abierto
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      
      if (isOpen && isMobile) {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('chatbot-open-mobile');
      } else {
        document.body.style.overflow = 'unset';
        document.body.classList.remove('chatbot-open-mobile');
      }
    };

    // Ejecutar al abrir/cerrar
    handleResize();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Limpieza al desmontar
      document.body.style.overflow = 'unset';
      document.body.classList.remove('chatbot-open-mobile');
    };
  }, [isOpen]);

  const addBotMessage = (text: string, suggestions?: string[], productLinks?: { text: string; url: string }[]) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      suggestions,
      productLinks
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getBotResponse = (userMessage: string): { text: string; suggestions?: string[]; productLinks?: { text: string; url: string }[] } => {
    const msg = userMessage.toLowerCase();

    // UBICACIONES Y SUCURSALES
    if (msg.includes('ubicad') || msg.includes('ubicacion') || msg.includes('dirección') || msg.includes('direccion') || msg.includes('donde esta') || msg.includes('dónde está') || msg.includes('sucursal')) {
      // Detectar ciudad específica
      if (msg.includes('santiago')) {
        return {
          text: '📍 **Sucursal Santiago**\n\n🏢 Dirección: Av. Providencia 1234, Providencia\n📞 Teléfono: +56 2 2345 6789\n🕐 Horario: Lun-Sáb 8:00-20:00\n🚇 Metro: Línea 1, Estación Pedro de Valdivia\n\n¿Necesitas indicaciones?',
          suggestions: ['Ver productos', 'Horarios', 'Otras sucursales']
        };
      }
      
      if (msg.includes('concepción') || msg.includes('concepcion')) {
        return {
          text: '📍 **Sucursal Concepción**\n\n🏢 Dirección: Av. O\'Higgins 567, Centro\n📞 Teléfono: +56 41 234 5678\n🕐 Horario: Lun-Sáb 8:00-20:00\n🚌 Locomoción: Cerca de Plaza Independencia\n\n¿Necesitas más información?',
          suggestions: ['Ver productos', 'Horarios', 'Otras sucursales']
        };
      }
      
      if (msg.includes('valparaíso') || msg.includes('valparaiso')) {
        return {
          text: '📍 **Sucursal Valparaíso**\n\n🏢 Dirección: Av. Brasil 890, Valparaíso\n📞 Teléfono: +56 32 234 5678\n🕐 Horario: Lun-Sáb 9:00-19:00\n🚌 Cerca del Puerto\n\n¿Te gustaría saber más?',
          suggestions: ['Ver productos', 'Horarios', 'Otras sucursales']
        };
      }
      
      // Respuesta general de ubicaciones
      return {
        text: '📍 **Nuestras Sucursales**\n\nContamos con tiendas en:\n\n🏢 Santiago - Av. Providencia 1234\n🏢 Concepción - Av. O\'Higgins 567\n🏢 Valparaíso - Av. Brasil 890\n\n¿Sobre qué sucursal necesitas información?',
        suggestions: ['Santiago', 'Concepción', 'Valparaíso', 'Ver productos']
      };
    }

    // HORARIOS ESPECÍFICOS POR SUCURSAL
    if ((msg.includes('horario') || msg.includes('hora')) && (msg.includes('santiago') || msg.includes('concepción') || msg.includes('concepcion') || msg.includes('valparaíso') || msg.includes('valparaiso'))) {
      if (msg.includes('santiago')) {
        return {
          text: '🕐 **Horario Sucursal Santiago**\n\n📅 Lunes a Viernes: 8:00 - 20:00\n📅 Sábado: 9:00 - 19:00\n📅 Domingo: Cerrado\n\n📍 Av. Providencia 1234, Providencia',
          suggestions: ['Ver ubicación', 'Ver productos', 'Otras sucursales']
        };
      }
      
      if (msg.includes('concepción') || msg.includes('concepcion')) {
        return {
          text: '🕐 **Horario Sucursal Concepción**\n\n📅 Lunes a Viernes: 8:00 - 20:00\n📅 Sábado: 9:00 - 18:00\n📅 Domingo: Cerrado\n\n📍 Av. O\'Higgins 567, Centro',
          suggestions: ['Ver ubicación', 'Ver productos', 'Otras sucursales']
        };
      }
      
      if (msg.includes('valparaíso') || msg.includes('valparaiso')) {
        return {
          text: '🕐 **Horario Sucursal Valparaíso**\n\n📅 Lunes a Viernes: 9:00 - 19:00\n📅 Sábado: 10:00 - 18:00\n📅 Domingo: Cerrado\n\n📍 Av. Brasil 890, Valparaíso',
          suggestions: ['Ver ubicación', 'Ver productos', 'Otras sucursales']
        };
      }
    }

    // OFERTAS - Detección específica
    if (msg.includes('qué productos están en oferta') || msg.includes('que productos estan en oferta') || msg.includes('cuáles están en oferta') || msg.includes('cuales estan en oferta')) {
      return {
        text: '🔥 Actualmente tenemos ofertas en:\n\n🥕 Verduras frescas - Hasta 25% OFF\n🍎 Frutas de temporada - Hasta 30% OFF\n🌿 Productos orgánicos - Hasta 20% OFF\n\n¡Aprovecha estos descuentos por tiempo limitado!',
        productLinks: [
          { text: '🎉 Ver Todas las Ofertas', url: '/ofertas' }
        ],
        suggestions: ['Ver verduras', 'Ver frutas', 'Ver productos']
      };
    }

    if (msg.includes('oferta') || msg.includes('descuento') || msg.includes('promocion') || msg.includes('promoción')) {
      return {
        text: '🔥 ¡Tenemos ofertas increíbles! Hasta 30% OFF en productos seleccionados.\n\nDescubre nuestras mejores promociones en frutas, verduras y productos orgánicos.',
        productLinks: [
          { text: '🎉 Ver Ofertas', url: '/ofertas' }
        ],
        suggestions: ['¿Qué productos están en oferta?', 'Ver productos frescos', 'Hablar con soporte']
      };
    }

    // PRODUCTOS GENERALES
    if (msg.includes('producto') || msg.includes('comprar') || msg.includes('frescos') || msg.includes('ver todo')) {
      return {
        text: '🌱 Tenemos productos frescos y orgánicos directo del campo.\n\n¿Qué categoría te interesa?',
        productLinks: [
          { text: '🥬 Ver Todos los Productos', url: '/productos' }
        ],
        suggestions: ['Verduras', 'Frutas', 'Hierbas', 'Ofertas del día']
      };
    }

    // VERDURAS
    if (msg.includes('verdura') || msg.includes('vegetal')) {
      const catId = categoryMap['verduras'];
      return {
        text: '🥬 Tenemos una gran variedad de verduras frescas:\n\n• Tomates cherry orgánicos\n• Zanahorias del campo\n• Lechugas hidropónicas\n• Y mucho más...\n\n¡Todas cosechadas recientemente!',
        productLinks: catId ? [
          { text: '🥕 Ver Verduras', url: `/productos?categoria=${catId}` }
        ] : [
          { text: '🥕 Ver Verduras', url: '/productos' }
        ],
        suggestions: ['Ver frutas', 'Ofertas del día', 'Ver todo']
      };
    }

    // FRUTAS
    if (msg.includes('fruta')) {
      const catId = categoryMap['frutas'];
      return {
        text: '🍎 Frutas frescas y de temporada:\n\n• Fresas orgánicas\n• Manzanas premium\n• Naranjas jugosas\n• Plátanos maduros\n\n¡Directo del campo a tu hogar!',
        productLinks: catId ? [
          { text: '🍓 Ver Frutas', url: `/productos?categoria=${catId}` }
        ] : [
          { text: '🍓 Ver Frutas', url: '/productos' }
        ],
        suggestions: ['Ver verduras', 'Ofertas del día', 'Ver todo']
      };
    }

    // HIERBAS
    if (msg.includes('hierba') || msg.includes('especia')) {
      const catId = categoryMap['hierbas'];
      return {
        text: '🌿 Hierbas frescas y aromáticas:\n\n• Albahaca fresca\n• Cilantro orgánico\n• Perejil del campo\n• Romero aromático\n\n¡Perfectas para tus recetas!',
        productLinks: catId ? [
          { text: '🌿 Ver Hierbas', url: `/productos?categoria=${catId}` }
        ] : [
          { text: '🌿 Ver Hierbas', url: '/productos' }
        ],
        suggestions: ['Ver verduras', 'Ver frutas', 'Ofertas del día']
      };
    }

    // LEGUMBRES
    if (msg.includes('legumbre')) {
      const catId = categoryMap['legumbres'];
      return {
        text: '🫘 Legumbres frescas y nutritivas:\n\n• Porotos verdes\n• Lentejas orgánicas\n• Garbanzos frescos\n\n¡Fuente natural de proteínas!',
        productLinks: catId ? [
          { text: '🫘 Ver Legumbres', url: `/productos?categoria=${catId}` }
        ] : [
          { text: '🫘 Ver Legumbres', url: '/productos' }
        ],
        suggestions: ['Ver verduras', 'Ofertas del día', 'Ver todo']
      };
    }

    // PEDIDOS Y RASTREO
    if (msg.includes('pedido') || msg.includes('orden') || msg.includes('rastrear') || msg.includes('seguimiento') || msg.includes('tracking')) {
      return {
        text: '📦 Para rastrear tu pedido:\n\n1️⃣ Inicia sesión en tu cuenta\n2️⃣ Ve a "Mis Pedidos"\n3️⃣ Selecciona el pedido que deseas rastrear\n\n¿Necesitas ayuda para iniciar sesión?',
        suggestions: ['Iniciar sesión', 'Hablar con soporte', 'Ver productos']
      };
    }

    // SOPORTE Y CONTACTO
    if (msg.includes('soporte') || msg.includes('ayuda') || msg.includes('contacto') || msg.includes('hablar')) {
      return {
        text: '💬 **Contacto y Soporte**\n\n📧 Email: contacto@huertohogar.cl\n📞 Teléfono: +56 9 1234 5678\n🕐 Horario: Lun-Sáb 8:00-20:00\n\n¿En qué más puedo ayudarte?',
        suggestions: ['Ver productos', 'Ofertas del día', 'Horarios']
      };
    }

    // HORARIOS GENERALES
    if (msg.includes('horario') || msg.includes('hora') || msg.includes('abierto') || msg.includes('cerrado')) {
      return {
        text: '🕐 **Horarios de Atención**\n\n📅 Lunes a Sábado: 8:00 - 20:00\n📅 Domingo: Cerrado\n\n💡 Los horarios pueden variar según la sucursal.\n\n¡Te esperamos!',
        suggestions: ['Ver sucursales', 'Hablar con soporte', 'Ver productos']
      };
    }

    // ENVÍO Y DELIVERY
    if (msg.includes('envio') || msg.includes('envío') || msg.includes('delivery') || msg.includes('entrega')) {
      return {
        text: '🚚 **Información de Envío**\n\n✅ Envío GRATIS en compras sobre $30.000\n📍 Cobertura: Región Metropolitana\n⏱️ Tiempo de entrega: 24-48 horas\n📦 Empaque ecológico incluido\n\n¿Quieres ver nuestros productos?',
        suggestions: ['Ver productos', 'Ofertas del día', 'Hablar con soporte']
      };
    }

    // ORGÁNICOS
    if (msg.includes('organico') || msg.includes('orgánico') || msg.includes('certificado') || msg.includes('natural')) {
      return {
        text: '🌿 **Productos Orgánicos Certificados**\n\n✅ 100% naturales\n✅ Sin pesticidas\n✅ Certificación orgánica\n✅ Cultivo sustentable\n\n¡Cuida tu salud y el planeta!',
        productLinks: [
          { text: '🌱 Ver Productos Orgánicos', url: '/productos' }
        ],
        suggestions: ['Ver verduras', 'Ver frutas', 'Ofertas del día']
      };
    }

    // PRECIO O COSTO
    if (msg.includes('precio') || msg.includes('costo') || msg.includes('cuánto') || msg.includes('cuanto') || msg.includes('valor')) {
      return {
        text: '💰 Nuestros precios varían según el producto:\n\n🥬 Verduras: Desde $1.000/kg\n🍎 Frutas: Desde $1.500/kg\n🌿 Hierbas: Desde $800/atado\n\n¡Consulta precios específicos en nuestra tienda!',
        productLinks: [
          { text: '🛒 Ver Precios', url: '/productos' }
        ],
        suggestions: ['Ver productos', 'Ofertas del día']
      };
    }

    // RESPUESTA POR DEFECTO
    return {
      text: '🤔 No estoy seguro de entender tu pregunta.\n\n¿Podrías ser más específico? Puedo ayudarte con:\n\n• Información de productos\n• Ofertas y promociones\n• Ubicación de sucursales\n• Rastreo de pedidos\n• Horarios y contacto',
      suggestions: [
        'Ver productos frescos',
        'Ofertas del día',
        'Ver sucursales',
        'Hablar con soporte'
      ]
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Agregar mensaje del usuario
    addUserMessage(inputValue);
    setInputValue('');

    // Simular "escribiendo..."
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const response = getBotResponse(inputValue);
      addBotMessage(response.text, response.suggestions, response.productLinks);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    addUserMessage(suggestion);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = getBotResponse(suggestion);
      addBotMessage(response.text, response.suggestions, response.productLinks);
    }, 1000);
  };

  const handleProductLinkClick = (url: string) => {
    navigate(url);
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante - VERDE */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <>
            <i className="fas fa-comments"></i>
            {!isOpen && <span className="chatbot-badge">1</span>}
          </>
        )}
      </button>

      {/* Ventana del chat */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <img src="/huertohogar-react/img/Logo_HuertoHogar_Web.png" alt="HuertoHogar" />
              </div>
              <div>
                <h3>HuertoHogar Asistente</h3>
                <div className="chatbot-status">
                  <span className="status-dot"></span>
                  En línea
                </div>
              </div>
            </div>
            
            <button 
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Mensajes */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                {message.sender === 'bot' && (
                  <div className="message-avatar">
                    <img src="/huertohogar-react/img/Logo_HuertoHogar_Web.png" alt="HuertoHogar" />
                  </div>
                )}
                <div className="message-content">
                  <div className="message-bubble">
                    {message.text}
                  </div>
                  
                  {/* Links a productos */}
                  {message.productLinks && message.productLinks.length > 0 && (
                    <div className="product-links">
                      {message.productLinks.map((link, idx) => (
                        <button
                          key={idx}
                          className="product-link-btn"
                          onClick={() => handleProductLinkClick(link.url)}
                        >
                          {link.text}
                          <i className="fas fa-arrow-right"></i>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Sugerencias rápidas */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="message-suggestions">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="suggestion-chip"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString('es-CL', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false 
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Indicador de escritura */}
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <img src="/huertohogar-react/img/Logo_HuertoHogar_Web.png" alt="HuertoHogar" />
                </div>
                <div className="message-content">
                  <div className="message-bubble typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="send-button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>

          {/* Footer */}
          <div className="chatbot-footer">
            <small>
              <i className="fas fa-shield-alt"></i>
              Tus datos están protegidos
            </small>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
