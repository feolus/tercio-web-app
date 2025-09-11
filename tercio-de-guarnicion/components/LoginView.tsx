import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginView: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const { signup, login, loginWithGoogle } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isRegistering) {
                await signup(email, password);
            } else {
                await login(email, password);
            }
        } catch (err: any) {
            setError(getFirebaseErrorMessage(err.code));
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        try {
            await loginWithGoogle();
        } catch (err: any) {
             setError(getFirebaseErrorMessage(err.code));
        }
    };

    const getFirebaseErrorMessage = (errorCode: string) => {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'El formato del correo electrónico no es válido.';
            case 'auth/user-not-found':
                return 'No se encontró ningún usuario con este correo electrónico.';
            case 'auth/wrong-password':
                return 'La contraseña es incorrecta.';
            case 'auth/email-already-in-use':
                return 'Este correo electrónico ya está registrado.';
             case 'auth/weak-password':
                return 'La contraseña debe tener al menos 6 caracteres.';
            default:
                return 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                 <img src="https://picsum.photos/seed/conqueror/150/150" alt="Logo" className="mx-auto mb-6 rounded-full border-4 border-slate-300 shadow-lg"/>
                <h1 className="text-4xl font-bold mb-2 text-amber-600 tracking-wider text-center">Tercio de Guarnicion</h1>
                <p className="text-slate-500 mb-8 text-center">{isRegistering ? 'Crea una cuenta para unirte' : 'Inicia sesión para continuar'}</p>
                
                <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Correo Electrónico</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-slate-700">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                               {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">O continúa con</span>
                            </div>
                        </div>

                        <div className="mt-6">
                           <button onClick={handleGoogleLogin} className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                                <span className="sr-only">Iniciar sesión con Google</span>
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.577.688.482A10.001 10.001 0 0020 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                                </svg>
                           </button>
                        </div>
                    </div>
                </div>

                 <p className="mt-8 text-center text-sm text-slate-600">
                    {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
                    <button onClick={() => setIsRegistering(!isRegistering)} className="font-medium text-amber-600 hover:text-amber-500 ml-1">
                       {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginView;
