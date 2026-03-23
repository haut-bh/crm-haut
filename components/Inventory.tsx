import React, { useEffect, useState } from 'react';
import { supabaseService } from '../services/supabaseService';
import { WatchInterest } from '../types';
import { Plus, Search, Tag } from 'lucide-react';

const Inventory: React.FC = () => {
    const [inventory, setInventory] = useState<WatchInterest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<WatchInterest | null>(null);
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        size: '',
        year: '',
        price: ''
    });

    useEffect(() => {
        const fetchInventory = async () => {
            const data = await supabaseService.getInventory();
            setInventory(data);
            setLoading(false);
        };
        fetchInventory();

        return supabaseService.subscribeToInventory((updatedInventory) => {
            setInventory(updatedInventory);
        });
    }, []);

    const handleOpenModal = (item?: WatchInterest) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                brand: item.brand,
                model: item.model,
                size: item.size || '',
                year: item.year || '',
                price: item.price.toString()
            });
        } else {
            setEditingItem(null);
            setFormData({ brand: '', model: '', size: '', year: '', price: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        const priceValue = parseFloat(formData.price.replace(/[^\d.,]/g, '').replace(',', '.')); // Simple parsing for input

        try {
            if (editingItem) {
                await supabaseService.updateInventoryItem(editingItem.id, {
                    ...formData,
                    price: priceValue
                });
            } else {
                await supabaseService.addInventoryItem({
                    ...formData,
                    price: priceValue
                });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving item", error);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Estoque</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center space-x-2 px-4 py-2 bg-chronos-900 text-white rounded-lg text-sm hover:bg-chronos-800 transition-colors">
                    <Plus size={16} /> <span>Adicionar Relógio</span>
                </button>
            </div>

            <div className="flex space-x-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por marca, modelo ou referência..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-chronos-500"
                    />
                </div>
                {/* Filters */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chronos-900"></div>
                    </div>
                ) : inventory.length > 0 ? inventory.map((watch, idx) => (
                    <div key={idx} onClick={() => handleOpenModal(watch)} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer relative">
                        <div className="h-48 bg-gray-50 flex items-center justify-center p-4 relative">
                            <img src={watch.image} alt={watch.model} className="h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-900 shadow-sm">
                                Em Estoque
                            </span>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{watch.brand}</p>
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{watch.model}</h3>
                                    {watch.reference && (
                                        <span className="text-xs font-mono text-gray-400">{watch.reference}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mb-4 space-x-3">
                                {watch.size && <span className="bg-gray-100 px-2 py-1 rounded">{watch.size}</span>}
                                {watch.year && <span className="bg-gray-100 px-2 py-1 rounded">{watch.year}</span>}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className="text-lg font-bold text-chronos-700">R$ {watch.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                <button className="text-xs font-semibold text-gray-900 hover:text-chronos-600">Editar</button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        {/* Empty State */}
                        <div className="bg-gray-50 rounded-2xl p-10 border border-dashed border-gray-200 inline-block">
                            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Estoque Vazio</h3>
                            <p className="text-gray-500 mt-1">Nenhum item registrado no momento.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl transform transition-all scale-100">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">{editingItem ? 'Editar Relógio' : 'Adicionar Novo Relógio'}</h2>

                        <div className="space-y-4">
                            {editingItem && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Referência</label>
                                    <input
                                        type="text"
                                        value={editingItem.reference}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-100 bg-gray-50 rounded-lg text-gray-500 font-mono text-sm cursor-not-allowed"
                                    />
                                </div>
                            )}
                            {!editingItem && (
                                <p className="text-xs text-gray-400">A referência será gerada automaticamente ao salvar.</p>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                                <input
                                    type="text"
                                    value={formData.brand}
                                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                                <input
                                    type="text"
                                    value={formData.model}
                                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho (Ex: 41mm)</label>
                                    <input
                                        type="text"
                                        value={formData.size}
                                        onChange={e => setFormData({ ...formData, size: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                                    <input
                                        type="text"
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-8">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-chronos-900 text-white rounded-lg hover:bg-chronos-800 transition-colors font-medium shadow-md hover:shadow-lg"
                            >
                                {editingItem ? 'Salvar Alterações' : 'Adicionar Relógio'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;