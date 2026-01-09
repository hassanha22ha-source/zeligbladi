"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Copy, Database, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function GetAdminSQLPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserId(user.id);
            setUserEmail(user.email || null);
        }
        setLoading(false);
    };

    const getPromotionSQL = () => {
        if (!userId || !userEmail) return "-- Connectez-vous d'abord pour voir votre ID";
        return `INSERT INTO admins (id, email) VALUES ('${userId}', '${userEmail}');`;
    };

    const copySQL = () => {
        navigator.clipboard.writeText(getPromotionSQL());
        alert("✅ Code SQL copié dans le presse-papiers !");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-earth-50 to-earth-100 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center shadow-2xl">
                        <Database className="text-white" size={40} />
                    </div>
                    <h1 className="text-4xl font-serif text-earth-900">Promotion Admin</h1>
                    <p className="text-earth-600 font-light">Obtenez le code SQL pour devenir administrateur</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-lg shadow-2xl border border-earth-200 overflow-hidden">

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                            <p className="mt-4 text-earth-500">Vérification...</p>
                        </div>
                    ) : userId ? (
                        <div className="p-8 space-y-6">
                            {/* Success State */}
                            <div className="flex items-start gap-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="font-bold text-green-900">Connecté avec succès</h3>
                                    <p className="text-sm text-green-700 mt-1">Email : <code className="bg-white px-2 py-0.5 rounded">{userEmail}</code></p>
                                    <p className="text-sm text-green-700 mt-1">User ID : <code className="bg-white px-2 py-0.5 rounded font-mono text-xs">{userId}</code></p>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-serif text-earth-900">📋 Instructions</h2>
                                <ol className="space-y-3 text-earth-700">
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                        <span>Copiez le code SQL ci-dessous</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                        <span>Ouvrez <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Supabase Dashboard</a> → SQL Editor</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                        <span>Collez et exécutez le code SQL</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                        <span>Connectez-vous sur <Link href="/admin-login" className="text-blue-600 underline font-medium">/admin-login</Link></span>
                                    </li>
                                </ol>
                            </div>

                            {/* SQL Code */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold uppercase tracking-wider text-earth-500">Code SQL à exécuter</label>
                                    <button
                                        onClick={copySQL}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                        <Copy size={16} />
                                        Copier
                                    </button>
                                </div>
                                <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto font-mono text-sm border-2 border-gray-700">
                                    {getPromotionSQL()}
                                </pre>
                            </div>

                            {/* Warning */}
                            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                <p className="text-sm text-yellow-800">
                                    ⚠️ <strong>Important :</strong> Après avoir exécuté ce SQL, vous aurez un accès administrateur complet à l'application.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 space-y-6">
                            {/* Not Logged In */}
                            <div className="flex items-start gap-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                                <AlertCircle className="text-orange-600 flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="font-bold text-orange-900">Non connecté</h3>
                                    <p className="text-sm text-orange-700 mt-1">Vous devez d'abord vous connecter pour obtenir votre User ID.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xl font-serif text-earth-900">Que faire ?</h2>
                                <ol className="space-y-3 text-earth-700">
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                        <span>Si vous n'avez pas de compte : <Link href="/register" className="text-blue-600 underline font-medium">Créer un compte</Link></span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                        <span>Si vous avez un compte : <Link href="/login" className="text-blue-600 underline font-medium">Se connecter</Link></span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                        <span>Revenez sur cette page après connexion</span>
                                    </li>
                                </ol>
                            </div>

                            <div className="flex gap-4">
                                <Link
                                    href="/login"
                                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                                >
                                    Se connecter
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex-1 bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center font-medium"
                                >
                                    Créer un compte
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center">
                    <Link href="/" className="text-sm text-earth-500 hover:text-earth-700 underline">
                        ← Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
