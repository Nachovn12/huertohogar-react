import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from '../components/Login';
import { AuthContext } from '../context/AuthContext';
import '../__tests__/test-utils'; // Carga los matchers personalizados para Jasmine

// Declaramos las variables globales de test-utils.js
// fn es equivalente a jest.fn() pero para Jasmine
declare var fn: (name: string) => jasmine.Spy; 

describe('Componente Login - Pruebas de Estado, Eventos y Navegación', () => {

    // Creamos mocks (simuladores) de las funciones del contexto de autenticación
    // Estos mocks nos permiten verificar si las funciones fueron llamadas
    const mockLogin = fn('login'); 
    const mockLogout = fn('logout'); 

    // Función auxiliar que renderiza el componente con todos los providers necesarios
    // loginImpl permite inyectar diferentes implementaciones del mock según la prueba
    const renderizarConProviders = (loginImpl = mockLogin) => {
        // Componente simple para verificar la navegación exitosa
        const AdminDashboard = () => <div>Admin Dashboard</div>;
        
        return render(
            <MemoryRouter initialEntries={['/login']}>
                <AuthContext.Provider value={{
                    login: loginImpl,
                    user: null,
                    isAdmin: false,
                    logout: mockLogout,
                }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Routes>
                </AuthContext.Provider>
            </MemoryRouter>
        );
    };

    // beforeEach se ejecuta ANTES de cada prueba individual
    // Esto asegura que cada test empiece con un estado limpio
    beforeEach(() => {
        // Reseteamos el historial de llamadas del espía
        mockLogin.calls.reset();
        // Por defecto, el login fallará (credenciales incorrectas)
        // Cada test puede sobrescribir este comportamiento si necesita
        mockLogin.and.returnValue({ success: false, message: 'Credenciales incorrectas' });
    });


    // ========== PRUEBA 1: Renderizado y Estado Inicial ==========
    // Verificamos que todos los elementos del formulario se rendericen correctamente
    it('debería renderizar todos los elementos del formulario con rol "Administrador" por defecto', () => {
        renderizarConProviders();

        // Verificamos que el título de bienvenida esté presente
        expect(screen.getByRole('heading', { name: /Bienvenido/i })).toBeInTheDocument();

        // Verificamos que el campo de usuario exista (buscamos por su label)
        expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();

        // IMPORTANTE: Buscamos el input de contraseña por su ID
        // No podemos buscar por texto "Contraseña" porque hay 2 elementos con ese texto:
        // 1) El label del campo, 2) El botón de toggle (mostrar/ocultar)
        const inputContrasena = document.getElementById('password');
        expect(inputContrasena).toBeInTheDocument();

        // Verificamos que el botón de submit exista
        expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();

        // Verificamos que el rol inicial sea "Administrador"
        expect(screen.getByDisplayValue('Administrador')).toBeInTheDocument();
        
        // Verificamos que el link de registro esté presente
        expect(screen.getByRole('link', { name: /Regístrate aquí/i })).toBeInTheDocument();
    });

    // ========== PRUEBA 2: Actualización de Estado ==========
    // Verificamos que los campos actualicen su valor cuando el usuario escribe
    it('debería actualizar el estado cuando el usuario escribe en los campos de usuario y contraseña', () => {
        renderizarConProviders();

        // Obtenemos los inputs usando sus placeholders (son únicos)
        const inputUsuario = screen.getByPlaceholderText('Ingresa tu usuario');
        const inputContrasena = screen.getByPlaceholderText('Ingresa tu contraseña');

        // Simulamos que el usuario escribe en los campos
        fireEvent.change(inputUsuario, { target: { value: 'nachovn12' } });
        fireEvent.change(inputContrasena, { target: { value: 'password123' } });

        // Verificamos que los valores se hayan actualizado correctamente
        // toHaveValue es un matcher personalizado que agregamos en test-utils.js
        expect(inputUsuario).toHaveValue('nachovn12');
        expect(inputContrasena).toHaveValue('password123');
    });

    // ========== PRUEBA 3: Evento Submit con Error ==========
    // Verificamos que se muestre un mensaje de error cuando las credenciales son incorrectas
    it('debería mostrar un mensaje de error cuando el intento de login falla', () => {
        // Configuramos el mock para que retorne un login fallido
        mockLogin.and.returnValue({ success: false, message: 'Credenciales incorrectas' });

        renderizarConProviders(mockLogin);

        const botonLogin = screen.getByRole('button', { name: /Iniciar Sesión/i });

        // Llenamos los campos con datos incorrectos
        // Nota: Es necesario llenar los campos porque tienen el atributo 'required'
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu usuario'), { target: { value: 'usuarioMalo' } });
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), { target: { value: 'passwordMalo' } });

        // Hacemos clic en el botón de login
        fireEvent.click(botonLogin);

        // Verificamos que la función login fue llamada exactamente 1 vez
        expect(mockLogin).toHaveBeenCalledTimes(1);

        // Verificamos que el mensaje de error aparezca en pantalla
        expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
    });

    // ========== PRUEBA 4: Renderizado Condicional ==========
    // Verificamos que las credenciales de prueba se muestren/oculten según el rol seleccionado
    it('debería mostrar las credenciales de prueba cuando el rol es "Administrador" y ocultarlas cuando es "Cliente"', () => {
        renderizarConProviders();

        // Verificamos que las credenciales de prueba estén visibles inicialmente
        expect(screen.getByText('Credenciales de prueba:')).toBeInTheDocument();

        // Cambiamos el rol a "Cliente"
        const selectorRol = screen.getByLabelText(/Tipo de Acceso/i);
        fireEvent.change(selectorRol, { target: { value: 'Cliente' } });

        // Verificamos que las credenciales de prueba YA NO estén en el documento
        // Usamos queryByText (no getByText) porque esperamos que NO exista
        expect(screen.queryByText('Credenciales de prueba:')).not.toBeInTheDocument();
    });

    // ========== PRUEBA 5: Navegación Exitosa ==========
    // Verificamos que después de un login exitoso, el usuario sea redirigido al dashboard
    it('debería navegar al dashboard del administrador cuando el login es exitoso', async () => {
        // Configuramos el mock para que retorne un login exitoso con redirección
        mockLogin.and.returnValue({ success: true, redirectTo: '/admin/dashboard' });

        renderizarConProviders(mockLogin);

        const botonLogin = screen.getByRole('button', { name: /Iniciar Sesión/i });

        // Llenamos los campos con las credenciales correctas
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu usuario'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), { target: { value: 'admin' } });

        // Hacemos clic en el botón de login
        fireEvent.click(botonLogin);

        // IMPORTANTE: Usamos waitFor porque la navegación es asíncrona
        // Esperamos a que aparezca el texto "Admin Dashboard" que confirma la navegación
        await waitFor(() => {
            expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
        });
    });

});