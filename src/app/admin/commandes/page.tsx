"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Search, FileDown, Eye, Package, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Order {
    id: string;
    created_at: string;
    customer_details: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        zip: string;
        country: string;
    };
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        format_name?: string;
        image_url?: string;
    }>;
    total_price: number;
    status: string;
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        setUpdatingStatus(orderId);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));

            // Update selected order if it's the one being modified
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Erreur lors de la mise à jour du statut');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const filteredOrders = orders.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        const customerName = `${order.customer_details.firstName} ${order.customer_details.lastName}`.toLowerCase();
        const email = order.customer_details.email.toLowerCase();
        return (
            order.id.toLowerCase().includes(searchLower) ||
            customerName.includes(searchLower) ||
            email.includes(searchLower)
        );
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="text-yellow-500" size={16} />;
            case 'confirmed': return <CheckCircle className="text-blue-500" size={16} />;
            case 'shipped': return <Package className="text-purple-500" size={16} />;
            case 'delivered': return <CheckCircle className="text-green-500" size={16} />;
            case 'cancelled': return <XCircle className="text-red-500" size={16} />;
            default: return <Clock className="text-gray-500" size={16} />;
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: 'En attente',
            confirmed: 'Confirmée',
            shipped: 'Expédiée',
            delivered: 'Livrée',
            cancelled: 'Annulée'
        };
        return labels[status] || status;
    };

    const statusOptions = [
        { value: 'pending', label: 'En attente', color: 'text-yellow-600' },
        { value: 'confirmed', label: 'Confirmée', color: 'text-blue-600' },
        { value: 'shipped', label: 'Expédiée', color: 'text-purple-600' },
        { value: 'delivered', label: 'Livrée', color: 'text-green-600' },
        { value: 'cancelled', label: 'Annulée', color: 'text-red-600' }
    ];

    const exportToCSV = () => {
        const headers = ['ID', 'Date', 'Client', 'Email', 'Téléphone', 'Ville', 'Total', 'Statut'];
        const rows = filteredOrders.map(order => [
            order.id,
            new Date(order.created_at).toLocaleDateString('fr-FR'),
            `${order.customer_details.firstName} ${order.customer_details.lastName}`,
            order.customer_details.email,
            order.customer_details.phone,
            order.customer_details.city,
            `${order.total_price} MAD`,
            getStatusLabel(order.status)
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `commandes_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[var(--admin-text)] tracking-tight">Suivi des Commandes</h1>
                    <p className="text-[var(--admin-text-dim)] text-xs font-black uppercase tracking-[0.3em] mt-2 italic">
                        {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={exportToCSV}
                    disabled={filteredOrders.length === 0}
                    className="border border-gold-600/30 text-gold-500 px-6 py-4 flex items-center space-x-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-gold-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileDown size={16} />
                    <span>Exporter (CSV)</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-text-dim)]" size={16} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filtrer par numéro de commande, client ou email..."
                    className="w-full bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-sm py-4 pl-12 pr-4 text-xs text-[var(--admin-text)] focus:border-gold-500 outline-none transition-all shadow-sm"
                />
            </div>

            {/* Orders Table */}
            <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-sm overflow-hidden shadow-sm">
                {loading ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <div className="text-center space-y-4 opacity-30">
                            <ShoppingBag size={48} className="mx-auto text-gold-500" strokeWidth={1} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text)]">
                                {searchTerm ? 'Aucun résultat' : 'Aucune commande trouvée'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--admin-bg)] border-b border-[var(--admin-border)]">
                                <tr>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Date</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Client</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Contact</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Ville</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Articles</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Total</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Statut</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order, index) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-bg)] transition-colors"
                                    >
                                        <td className="px-6 py-4 text-xs text-[var(--admin-text)]">
                                            {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                            <br />
                                            <span className="text-[10px] text-[var(--admin-text-dim)]">
                                                {new Date(order.created_at).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-medium text-[var(--admin-text)]">
                                                {order.customer_details.firstName} {order.customer_details.lastName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-[var(--admin-text)]">{order.customer_details.email}</div>
                                            <div className="text-[10px] text-[var(--admin-text-dim)]">{order.customer_details.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-[var(--admin-text)]">
                                            {order.customer_details.city}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-[var(--admin-text)]">
                                            {order.items.length} article{order.items.length > 1 ? 's' : ''}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-[var(--admin-text)]">
                                            {order.total_price} MAD
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {updatingStatus === order.id ? (
                                                    <Loader2 className="w-4 h-4 text-gold-500 animate-spin" />
                                                ) : (
                                                    getStatusIcon(order.status)
                                                )}
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    disabled={updatingStatus === order.id}
                                                    className={`bg-transparent text-xs outline-none focus:ring-1 focus:ring-gold-500 rounded px-1 cursor-pointer transition-all ${statusOptions.find(opt => opt.value === order.status)?.color || 'text-[var(--admin-text)]'}`}
                                                >
                                                    {statusOptions.map((option) => (
                                                        <option key={option.value} value={option.value} className="bg-[var(--admin-card)] text-[var(--admin-text)]">
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-gold-500 hover:text-gold-600 transition-colors"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    onClick={() => setSelectedOrder(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white border-b border-earth-200 p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-serif text-earth-900">Détails de la commande</h2>
                                <p className="text-xs text-earth-500 mt-1">ID: {selectedOrder.id.slice(0, 8)}...</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-earth-50 px-3 py-1.5 rounded-full">
                                    {updatingStatus === selectedOrder.id ? (
                                        <Loader2 className="w-4 h-4 text-gold-500 animate-spin" />
                                    ) : (
                                        getStatusIcon(selectedOrder.status)
                                    )}
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                                        disabled={updatingStatus === selectedOrder.id}
                                        className={`bg-transparent text-xs font-bold uppercase tracking-wider outline-none cursor-pointer ${statusOptions.find(opt => opt.value === selectedOrder.status)?.color || 'text-earth-900'}`}
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value} className="bg-white text-earth-900">
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-earth-400 hover:text-earth-900 transition-colors p-2"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-earth-500 mb-3">Informations Client</h3>
                                <div className="bg-earth-50 p-4 rounded-lg space-y-2 text-sm">
                                    <p><strong>Nom :</strong> {selectedOrder.customer_details.firstName} {selectedOrder.customer_details.lastName}</p>
                                    <p><strong>Email :</strong> {selectedOrder.customer_details.email}</p>
                                    <p><strong>Téléphone :</strong> {selectedOrder.customer_details.phone}</p>
                                    <p><strong>Adresse :</strong> {selectedOrder.customer_details.address}</p>
                                    <p><strong>Ville :</strong> {selectedOrder.customer_details.city} {selectedOrder.customer_details.zip}</p>
                                    <p><strong>Pays :</strong> {selectedOrder.customer_details.country}</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-earth-500 mb-3">Articles commandés</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 p-4 bg-earth-50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium text-earth-900">{item.name}</p>
                                                <p className="text-xs text-earth-500">{item.format_name}</p>
                                                <p className="text-xs text-earth-500 mt-1">Quantité: {item.quantity} m²</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-earth-900">{item.price * item.quantity} MAD</p>
                                                <p className="text-xs text-earth-500">{item.price} MAD/m²</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t border-earth-200 pt-4">
                                <div className="flex justify-between items-center text-xl font-serif">
                                    <span className="text-earth-900">Total</span>
                                    <span className="text-earth-900 font-bold">{selectedOrder.total_price} MAD</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
