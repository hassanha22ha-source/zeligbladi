export default function ProfilePage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <div className="bg-white shadow-xl rounded-sm border border-earth-100 p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-earth-100 rounded-full mx-auto flex items-center justify-center text-earth-400 font-serif text-3xl">
                    JD
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-serif text-earth-900">Mon Compte</h1>
                    <p className="text-earth-600">Bienvenue dans votre espace personnel Zelige Bladi.</p>
                </div>

                <div className="pt-8 border-t border-earth-50 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="p-6 bg-earth-50 rounded-sm space-y-2">
                        <h3 className="font-bold text-earth-900 uppercase tracking-widest text-xs">Commandes récentes</h3>
                        <p className="text-sm text-earth-500 italic">Vous n'avez pas encore passé de commande.</p>
                    </div>
                    <div className="p-6 bg-earth-50 rounded-sm space-y-2">
                        <h3 className="font-bold text-earth-900 uppercase tracking-widest text-xs">Mes Informations</h3>
                        <p className="text-sm text-earth-600">Jane Doe</p>
                        <p className="text-sm text-earth-600">jane.doe@example.com</p>
                        <button className="text-xs text-secondary font-bold hover:underline">Modifier mon profil</button>
                    </div>
                </div>

                <div className="pt-12">
                    <button className="text-earth-400 hover:text-earth-900 transition-colors text-sm font-medium">
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    );
}
