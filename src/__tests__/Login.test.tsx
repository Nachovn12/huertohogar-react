// src/__tests__/Login.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from '../components/Login';
import { AuthContext } from '../context/AuthContext';
import '../__tests__/test-utils'; // Carga los matchers y mocks de Jasmine

// Declaramos las variables globales que creamos en test-utils.js
declare var fn: (name: string) => jasmine.Spy; 

describe('Login Component - State and Events (Test 7/10) - JASMINE', () => {

    const mockLogin = fn('login'); 
    const mockLogout = fn('logout'); 

    const renderWithProviders = (loginImpl = mockLogin) => {
        // Creamos un componente simple para verificar la navegación
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

    beforeEach(() => {
        // Limpiamos los espías de Jasmine antes de cada 'it' (test)
        mockLogin.calls.reset();
        mockLogin.and.returnValue({ success: false, message: 'Credenciales incorrectas' });
    });


    // --- PRUEBA 1: Renderizado y Estado Inicial ---
    it('should render all form elements and be initialized to "Administrador"', () => {
        renderWithProviders();

        expect(screen.getByRole('heading', { name: /Bienvenido/i })).toBeInTheDocument();

        // Buscamos por el label del campo de texto (que es único)
        expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();

        // CORREGIDO: Buscamos el input por su ID para evitar ambigüedad
        const passwordInput = document.getElementById('password');
        expect(passwordInput).toBeInTheDocument();

        // Buscamos por el rol del botón
        expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();

        // Verificamos el rol inicial
        expect(screen.getByDisplayValue('Administrador')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Regístrate aquí/i })).toBeInTheDocument();
    });

    // --- PRUEBA 2: Actualización de Estado (Hooks y toHaveValue) ---
    it('should update state when user types into username and password fields', () => {
        renderWithProviders();

        // Buscamos por placeholder para el input de usuario
        const usernameInput = screen.getByPlaceholderText('Ingresa tu usuario');
        // Buscamos por placeholder para el input de contraseña
        const passwordInput = screen.getByPlaceholderText('Ingresa tu contraseña');

        fireEvent.change(usernameInput, { target: { value: 'nachovn12' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // toHaveValue ahora funciona gracias al matcher que agregamos a test-utils.js
        expect(usernameInput).toHaveValue('nachovn12');
        expect(passwordInput).toHaveValue('password123');
    });

    // --- PRUEBA 3: Evento Submit (Llamada a la función de login y manejo de error) ---
    it('should display error message on failed login attempt', () => {
        // Configuramos el espía para que devuelva el resultado de falla
        mockLogin.and.returnValue({ success: false, message: 'Credenciales incorrectas' });

        renderWithProviders(mockLogin);

        const loginButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

        // Llenar campos (requerido para pasar la validación 'required')
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu usuario'), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), { target: { value: 'wrongpass' } });

        fireEvent.click(loginButton);

        // Verifica que se intentó hacer login
        expect(mockLogin).toHaveBeenCalledTimes(1);

        // Verifica que el mensaje de error se muestra
        expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
    });

    // --- PRUEBA 4: Renderizado Condicional (Credenciales de Administrador) ---
    it('should show test credentials when role is "Administrador" and hide when "Cliente"', () => {
        renderWithProviders();

        expect(screen.getByText('Credenciales de prueba:')).toBeInTheDocument();

        const roleSelect = screen.getByLabelText(/Tipo de Acceso/i);
        fireEvent.change(roleSelect, { target: { value: 'Cliente' } });

        // queryByText busca un elemento que puede no estar presente
        expect(screen.queryByText('Credenciales de prueba:')).not.toBeInTheDocument();
    });

    // --- PRUEBA 5: Navegación exitosa ---
    it('should navigate to admin dashboard on successful admin login', async () => {
        // Configuramos el espía para que sea exitoso y redirija
        mockLogin.and.returnValue({ success: true, redirectTo: '/admin/dashboard' });

        renderWithProviders(mockLogin);

        const loginButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

        fireEvent.change(screen.getByPlaceholderText('Ingresa tu usuario'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), { target: { value: 'admin' } });

        fireEvent.click(loginButton);

        // Esperamos a que la navegación ocurra y verificamos que estamos en el dashboard
        await waitFor(() => {
            expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
        });
    });

});