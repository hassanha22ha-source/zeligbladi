"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Check, AlertTriangle, Copy, Database, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SetupOrdersPage() {
    const [status, setStatus] = useState<'loading' | 'missing' | 'ready'>('loading');
    const [errorMsg, setErrorMsg] = useState("");

    const REQUIRED_SQL = `-- Create the orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  customer_details JSONB NOT NULL,
  items JSONB NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone (guests included) to create an order
CREATE POLICY "Enable insert for all users" ON orders FOR INSERT WITH CHECK (true);

-- Allow admins (or anyone for now if auth is loose) to read orders
CREATE POLICY "Enable read for all users" ON orders FOR SELECT USING (true);

-- Allow updates to status
CREATE POLICY "Enable update for all users" ON orders FOR UPDATE USING (true);


-- [OPTIONAL] Promote a user to Admin (Replace USER_ID with the one from Authentication tab)
-- INSERT INTO admins (id) VALUES ('USER_ID_GOES_HERE');`;

    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        checkTable();
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserId(user.id);
        }
    };

    const getPromotionSQL = () => {
        if (!userId) return "-- Connectez-vous d'abord sur /login pour voir votre ID";
        return `INSERT INTO admins (id) VALUES ('${userId}');`;
    };

    const copyPromotionSQL = () => {
        navigator.clipboard.writeText(getPromotionSQL());
        alert("Code de promotion copié !");
    };

    const checkTable = async () => {
        setStatus('loading');
        try {
            // Try to select from orders
            const { error } = await supabase.from('orders').select('id').limit(1);

            if (error) {
                // If error is 42P01 (undefined_table) or similar
                if (error.code === '42P01' || error.message.includes('relation "orders" does not exist')) {
                    setStatus('missing');
                } else {
                    // Other error (maybe permission), but implies table likely exists or DB is reachable
                    console.error("Setup check error:", error);
                    setErrorMsg(error.message);
                    // Assume missing if we can't read, to be safe, or just show error
                    setStatus('missing');
                }
            } else {
                setStatus('ready');
            }
        } catch (err: any) {
            console.error("Check failed:", err);
            setStatus('missing');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(REQUIRED_SQL);
        alert("Code SQL copié ! Collez-le dans l'éditeur SQL de Supabase.");
    };

    return (
        <div className="min-h-screen bg-earth-50/20 p-8 md:p-12 grain-effect">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-4 mb-12">
                    <div className="w-16 h-16 bg-white border border-earth-100 rounded-sm flex items-center justify-center shadow-lg">
                        <Database className="text-earth-900" size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif text-earth-900">Configuration des Commandes & Admin</h1>
                        <p className="text-earth-500 font-light">Vérification et initialisation de la base de données</p>
                    </div>
                </div>

                {/* Status Card */}
                <div className="bg-white p-8 rounded-sm shadow-xl border border-earth-100 transition-all">

                    {/* Admin Promotion Section */}
                    <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-400 rounded-sm space-y-4">
                        <h3 className="font-bold text-earth-900 uppercase text-xs tracking-wider flex items-center gap-2">
                            <Database size={16} />
                            <span>Promotion Admin (Urgence)</span>
                        </h3>
                        {userId ? (
                            <div className="space-y-4">
                                <p className="text-earth-600 text-sm">
                                    Vous êtes connecté avec l'ID : <code className="bg-white px-2 py-1 rounded border border-earth-200">{userId}</code>
                                </p>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-earth-400">Exécutez ce SQL pour devenir Admin :</label>
                                        <button
                                            onClick={copyPromotionSQL}
                                            className="text-blue-600 hover:text-blue-700 text-xs font-bold uppercase tracking-wider transition-colors"
                                        >
                                            Copier
                                        </button>
                                    </div>
                                    <pre className="bg-earth-950 text-green-400 p-4 rounded-sm text-xs font-mono overflow-x-auto">
                                        {getPromotionSQL()}
                                    </pre>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-earth-600 text-sm">
                                    Pour devenir admin, connectez-vous d'abord sur la page publique, puis revenez ici.
                                </p>
                                <Link href="/login" className="inline-block text-blue-600 hover:underline text-xs font-bold uppercase tracking-wider">
                                    &rarr; Se connecter (Login public)
                                </Link>
                            </div>
                        )}
                    </div>

                    {status === 'loading' && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-12 h-12 text-gold-600 animate-spin" />
                            <p className="text-earth-400 text-xs font-black uppercase tracking-widest">Vérification en cours...</p>
                        </div>
                    )}

                    {status === 'ready' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12 space-y-6"
                        >
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
                                <Check size={40} strokeWidth={3} />
                            </div>
                            <h2 className="text-2xl font-serif text-earth-900">Tout est prêt !</h2>
                            <p className="text-earth-500 max-w-md mx-auto">
                                La table <code className="bg-earth-100 px-2 py-1 rounded text-earth-800 font-mono text-sm">orders</code> existe et est opérationnelle.
                            </p>
                            <div className="pt-8">
                                <Link
                                    href="/commander"
                                    className="bg-earth-900 text-white px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-gold-600 transition-colors shadow-lg"
                                >
                                    Tester le passage de commande
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {status === 'missing' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex items-start space-x-4 bg-orange-50 p-6 rounded-sm border-l-4 border-orange-400">
                                <AlertTriangle className="text-orange-400 flex-shrink-0" size={24} />
                                <div className="space-y-1">
                                    <h3 className="font-bold text-earth-900 uppercase text-xs tracking-wider">Base de données incomplète</h3>
                                    <p className="text-earth-600 text-sm leading-relaxed">
                                        La table requise pour les commandes n'existe pas encore. Impossible de la créer automatiquement sans clé administrative.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-earth-400">Action Requise : Exécuter ce SQL</label>
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center space-x-2 text-gold-600 hover:text-gold-700 text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        <Copy size={14} />
                                        <span>Copier le Code</span>
                                    </button>
                                </div>

                                <div className="relative group">
                                    <pre className="bg-earth-950 text-earth-50 p-6 rounded-sm text-xs font-mono overflow-x-auto shadow-inner border border-earth-300">
                                        {REQUIRED_SQL}
                                    </pre>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-4">
                                <a
                                    href="https://supabase.com/dashboard/project/_/sql"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-gradient-to-br from-green-600 to-green-700 text-white px-6 py-5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:-translate-y-1 transition-all text-center flex items-center justify-center space-x-2"
                                >
                                    <span>1. Ouvrir Supabase SQL</span>
                                    <ArrowRight size={14} />
                                </a>
                                <button
                                    onClick={checkTable}
                                    className="flex-1 bg-white border border-earth-200 text-earth-900 px-6 py-5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-earth-50 transition-all text-center flex items-center justify-center space-x-2"
                                >
                                    <Loader2 size={14} className={status === 'loading' ? 'animate-spin' : ''} />
                                    <span>2. Vérifier à nouveau</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
