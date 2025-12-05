import toast, { Toaster } from 'react-hot-toast';

// Configuración de estilos personalizados
const toastStyles = {
    success: {
        style: {
            background: '#10b981',
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#10b981'
        }
    },
    error: {
        style: {
            background: '#ef4444',
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#ef4444'
        }
    },
    loading: {
        style: {
            background: '#3b82f6',
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#3b82f6'
        }
    }
};

// Funciones helper para notificaciones
export const notify = {
    success: (message: string) => toast.success(message, toastStyles.success),
    error: (message: string) => toast.error(message, toastStyles.error),
    loading: (message: string) => toast.loading(message, toastStyles.loading),
    promise: (promise: Promise<any>, messages: { loading: string; success: string; error: string }) => {
        return toast.promise(promise, messages, {
            loading: toastStyles.loading,
            success: toastStyles.success,
            error: toastStyles.error
        });
    },
    dismiss: (toastId?: string) => toast.dismiss(toastId)
};

// Componente Toaster para incluir en App
export const ToastContainer = () => (
    <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
            duration: 4000,
            style: {
                background: '#fff',
                color: '#1f2937',
                padding: '16px',
                borderRadius: '12px',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }
        }}
    />
);

export default notify;
