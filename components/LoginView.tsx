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
                           <button onClick={handleGoogleLogin} className="w-full inline-flex justify-center items-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                                <span className="sr-only">Iniciar sesión con Google</span>
                                <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 48 48">
                                    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                                </svg>
                                Google
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