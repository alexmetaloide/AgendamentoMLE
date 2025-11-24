import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { Mail, Lock, AlertCircle, Loader, CheckCircle } from 'lucide-react';

interface SignupFormProps {
    onSwitchToLogin: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    const passwordStrength = (pwd: string) => {
        if (pwd.length < 6) return { strength: 'Muito fraca', color: 'red' };
        if (pwd.length < 8) return { strength: 'Fraca', color: 'yellow' };
        if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd))
            return { strength: 'Forte', color: 'green' };
        return { strength: 'Média', color: 'blue' };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            await signup(email, password);
        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    };

    const pwdStrength = password ? passwordStrength(password) : null;

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Criar Conta
                    </h1>
                    <p className="text-slate-400">Cadastre-se para usar o sistema</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
                                <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-red-200">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                            {pwdStrength && (
                                <p className={`text-xs mt-1.5 text-${pwdStrength.color}-400`}>
                                    Força: {pwdStrength.strength}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Confirmar Senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {password && confirmPassword && password === confirmPassword ? (
                                        <CheckCircle size={18} className="text-green-500" />
                                    ) : (
                                        <Lock size={18} className="text-slate-500" />
                                    )}
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="w-full justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader size={18} className="animate-spin mr-2" />
                                    Criando conta...
                                </>
                            ) : (
                                'Criar Conta'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-400">
                            Já tem uma conta?{' '}
                            <button
                                onClick={onSwitchToLogin}
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                Fazer login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
