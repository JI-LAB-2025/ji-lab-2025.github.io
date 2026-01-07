import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Hardcoded credentials as discussed
        if (username === 'admin' && password === 'jilab2025') {
            localStorage.setItem('reagent_auth', 'true');
            onLogin();
        } else {
            setError('用户名或密码错误');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-brand-100 rounded-full">
                        <Lock className="text-brand-500 w-8 h-8" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">系统登录</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="请输入用户名"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="请输入密码"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 py-1 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-brand-500 text-white py-2 rounded-md hover:bg-brand-600 transition-colors font-medium shadow-sm"
                    >
                        进入系统
                    </button>
                </form>
                <p className="mt-4 text-xs text-center text-gray-400">
                    默认账号: admin / jilab2025
                </p>
            </div>
        </div>
    );
}
