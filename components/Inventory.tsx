import React, { useEffect, useRef, useState } from 'react';
import { supabaseService } from '../services/supabaseService';
import { WatchInterest } from '../types';
import { Plus, Search, Tag, Upload, X, Trash2, AlertTriangle } from 'lucide-react';

const Inventory: React.FC = () => {
    const [inventory, setInventory] = useState<WatchInterest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<WatchInterest | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        size: '',
        year: '',
        price: '',
        precoCusto: '',
        imageUrl: '',
    });

    // Delete state
    const [itemToDelete, setItemToDelete] = useState<WatchInterest | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchInventory = async () => {
        const data = await supabaseService.getInventory();
        setInventory(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchInventory();

        return supabaseService.subscribeToInventory((updatedInventory) => {
            setInventory(updatedInventory);
        });
    }, []);

    const handleOpenModal = (item?: WatchInterest) => {
        setSaveError(null);
        setImageFile(null);
        if (item) {
            setEditingItem(item);
            setImagePreview(item.image && !item.image.includes('placehold.co') ? item.image : null);
            setFormData({
                brand: item.brand,
                model: item.model,
                size: item.size || '',
                year: item.year || '',
                price: item.price.toString(),
                precoCusto: item.precoCusto != null ? item.precoCusto.toString() : '',
                imageUrl: item.image && !item.image.includes('placehold.co') ? item.image : '',
            });
        } else {
            setEditingItem(null);
            setImagePreview(null);
            setFormData({ brand: '', model: '', size: '', year: '', price: '', precoCusto: '', imageUrl: '' });
        }
        setIsModalOpen(true);
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setFormData(prev => ({ ...prev, imageUrl: '' }));
    };

    const handleImageUrlChange = (url: string) => {
        setFormData(prev => ({ ...prev, imageUrl: url }));
        if (url) {
            setImageFile(null);
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    };

    const handleSave = async () => {
        if (!formData.brand || !formData.model || !formData.size || !formData.year || !formData.price || !formData.precoCusto) {
            setSaveError('Todos os campos são obrigatórios.');
            return;
        }
        setSaving(true);
        setSaveError(null);

        try {
            const priceValue = parseFloat(formData.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
            const precoCustoValue = formData.precoCusto
                ? parseFloat(formData.precoCusto.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
                : undefined;

            let finalImageUrl = formData.imageUrl || undefined;
            if (imageFile) {
                finalImageUrl = await supabaseService.uploadWatchImage(imageFile);
            }

            if (editingItem) {
                await supabaseService.updateInventoryItem(editingItem.id, {
                    brand: formData.brand,
                    model: formData.model,
                    size: formData.size,
                    year: formData.year,
                    price: priceValue,
                    precoCusto: precoCustoValue,
                    image: finalImageUrl,
                });
            } else {
                await supabaseService.addInventoryItem({
                    brand: formData.brand,
                    model: formData.model,
                    size: formData.size,
                    year: formData.year,
                    price: priceValue,
                    precoCusto: precoCustoValue,
                    image: finalImageUrl,
                });
            }

            await fetchInventory();
            setIsModalOpen(false);
        } catch (error: any) {
            setSaveError(error?.message || 'Erro ao salvar. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteRequest = (item: WatchInterest, e: React.MouseEvent) => {
        e.stopPropagation();
        setItemToDelete(item);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setDeleting(true);
        try {
            await supabaseService.deleteInventoryItem(itemToDelete.id);
            await fetchInventory();
            setItemToDelete(null);
        } catch (error: any) {
            console.error(error);
        } finally {
            setDeleting(false);
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
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-chronos-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chronos-900"></div>
                    </div>
                ) : (() => {
                    const term = searchTerm.toLowerCase().trim();
                    const filtered = term
                        ? inventory.filter(w =>
                            w.brand.toLowerCase().includes(term) ||
                            w.model.toLowerCase().includes(term) ||
                            (w.reference && w.reference.toLowerCase().includes(term))
                        )
                        : inventory;
                    return filtered.length > 0 ? filtered.map((watch, idx) => (
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
                                <div>
                                    <span className="text-lg font-bold text-chronos-700">R$ {watch.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Custo: {watch.precoCusto != null ? `R$ ${watch.precoCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="text-xs font-semibold text-gray-900 hover:text-chronos-600">Editar</button>
                                    <button
                                        onClick={(e) => handleDeleteRequest(watch, e)}
                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Excluir Relógio"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        <div className="bg-gray-50 rounded-2xl p-10 border border-dashed border-gray-200 inline-block">
                            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">{term ? 'Nenhum resultado encontrado' : 'Estoque Vazio'}</h3>
                            <p className="text-gray-500 mt-1">{term ? 'Tente buscar com outros termos.' : 'Nenhum item registrado no momento.'}</p>
                        </div>
                    </div>
                );
                })()}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
                      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">{editingItem ? 'Editar Relógio' : 'Adicionar Novo Relógio'}</h2>

                        <div className="space-y-4">
                            {/* Preview da foto */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-36 h-36 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-gray-300 text-xs text-center px-2">Sem foto</span>
                                    )}
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageFileChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Upload size={14} /> Escolher Foto
                                </button>

                                <div className="w-full">
                                    <label className="block text-xs text-gray-400 mb-1">Ou cole a URL da imagem</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={formData.imageUrl}
                                        onChange={e => handleImageUrlChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                                    />
                                </div>
                            </div>

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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Marca <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={formData.brand}
                                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={formData.model}
                                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho (Ex: 41mm) <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.size}
                                        onChange={e => setFormData({ ...formData, size: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ano <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$) <span className="text-red-400">*</span></label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Custo (R$) <span className="text-red-400">*</span></label>
                                <input
                                    type="number"
                                    value={formData.precoCusto}
                                    onChange={e => setFormData({ ...formData, precoCusto: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-chronos-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {saveError && (
                            <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                <X size={16} className="mt-0.5 shrink-0" />
                                {saveError}
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 mt-8">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                disabled={saving}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-chronos-900 text-white rounded-lg hover:bg-chronos-800 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-60 flex items-center gap-2"
                            >
                                {saving && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
                                {editingItem ? 'Salvar Alterações' : 'Adicionar Relógio'}
                            </button>
                        </div>
                      </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {itemToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-fade-in px-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-50 rounded-full text-red-500">
                                    <AlertTriangle size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Excluir Relógio</h3>
                            </div>
                            <button onClick={() => setItemToDelete(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Tem certeza que deseja excluir o relógio{' '}
                            <span className="font-bold text-gray-900">{itemToDelete.brand} {itemToDelete.model}</span>?
                            <br />Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setItemToDelete(null)}
                                disabled={deleting}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all flex items-center gap-2 disabled:opacity-60"
                            >
                                {deleting && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
                                <Trash2 size={18} /> Confirmar Exclusão
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
