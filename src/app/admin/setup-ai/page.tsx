"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Database, ShieldCheck, AlertCircle, CheckCircle2, Loader2, HardDrive } from "lucide-react";

export default function AISetupPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");

    const CORE_SQL = `-- 1. Créer les buckets de stockage (Storage)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('room-originals', 'room-originals', true),
  ('room-generated', 'room-generated', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Créer la table pour les rendus IA
CREATE TABLE IF NOT EXISTS room_previews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  original_image_url TEXT NOT NULL,
  generated_image_url TEXT NOT NULL,
  zellige_id UUID REFERENCES products(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Activer RLS sur la table
ALTER TABLE room_previews ENABLE ROW LEVEL SECURITY;

-- 4. Politiques RLS (Lecture/Insertion)
DO $$ BEGIN
    CREATE POLICY "Enable read for all users" ON room_previews FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Enable insert for authenticated users" ON room_previews FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;
`;

    return (
        <div className="min-h-screen bg-earth-50 py-20 px-6 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-serif text-earth-900 tracking-tight">Configuration IA</h1>
                    <p className="text-earth-500 text-lg font-light">Suivez ces étapes pour débloquer l'envoi d'images et la génération IA.</p>
                </div>

                {/* SQL Section */}
                <div className="bg-white rounded-xl shadow-2xl border border-earth-100 overflow-hidden">
                    <div className="p-8 border-b border-earth-50 bg-earth-900 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gold-600 rounded-lg flex items-center justify-center font-bold">1</div>
                            <div>
                                <h2 className="font-serif text-2xl">Core Setup (SQL)</h2>
                                <p className="text-gold-200 text-xs uppercase tracking-widest mt-1">Buckets & Table</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <p className="text-sm text-earth-600 leading-relaxed">
                            Exécutez ce code dans votre <strong>Supabase SQL Editor</strong>.
                            <span className="block mt-2 text-earth-400 italic font-light text-xs">Note: Ce script crée les dossiers et la table nécessaire.</span>
                        </p>
                        <div className="relative group">
                            <pre className="bg-earth-50 text-earth-800 p-6 rounded-xl text-xs overflow-x-auto font-mono border border-earth-100 selection:bg-gold-200">
                                {CORE_SQL}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Storage Policies Section - UI Based */}
                <div className="bg-white rounded-xl shadow-2xl border border-earth-100 overflow-hidden">
                    <div className="p-8 border-b border-earth-50 bg-gold-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-earth-900 rounded-lg flex items-center justify-center font-bold text-white">2</div>
                            <div>
                                <h2 className="font-serif text-2xl">Fixer les permissions (UI)</h2>
                                <p className="text-earth-100 text-xs uppercase tracking-widest mt-1">Éviter l'erreur 42501</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 space-y-8">
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="text-sm text-red-800 font-medium">
                                Si vous avez l'erreur "must be owner of table objects", vous devez configurer les droits via l'interface graphique :
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-earth-900 flex items-center gap-2">
                                    <ShieldCheck className="text-gold-600" size={16} />
                                    Pour Room-Originals
                                </h3>
                                <ul className="space-y-3 text-[13px] text-earth-600 font-light">
                                    <li className="flex gap-2"><span>•</span> <span>Allez dans <strong>Storage</strong> {'>'} <strong>room-originals</strong> {'>'} <strong>Policies</strong></span></li>
                                    <li className="flex gap-2"><span>•</span> <span>Cliquez sur <strong>New Policy</strong> {'>'} <strong>Get started quickly</strong></span></li>
                                    <li className="flex gap-2"><span>•</span> <span>Choisissez <strong>"Give users access to all objects in a bucket"</strong></span></li>
                                    <li className="flex gap-2"><span>•</span> <span>Sélectionnez les opérations : <strong>SELECT</strong> and <strong>INSERT</strong></span></li>
                                    <li className="flex gap-2"><span>•</span> <span>Cliquez sur <strong>Save</strong></span></li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-earth-900 flex items-center gap-2">
                                    <ShieldCheck className="text-gold-600" size={16} />
                                    Pour Room-Generated
                                </h3>
                                <ul className="space-y-3 text-[13px] text-earth-600 font-light">
                                    <li className="flex gap-2"><span>•</span> <span>Répétez exactement la même chose pour <strong>room-generated</strong></span></li>
                                    <li className="flex gap-2"><span>•</span> <span>N'oubliez pas d'inclure <strong>SELECT</strong> et <strong>INSERT</strong></span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-earth-400 font-serif italic text-lg">
                        "Une fois ces deux étapes terminées, le badge <span className="text-green-600 font-bold not-italic">Prêt pour l'IA</span> apparaîtra sur vos photos."
                    </p>
                </div>
            </div>
        </div>
    );
}
