import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Sparkles, Loader2, Download, LayoutGrid, List } from 'lucide-react';

interface Asset {
    id: string;
    type: 'image' | 'video';
    prompt: string;
    url: string;
    status: 'ready' | 'generating' | 'failed';
    createdAt: string;
}

export const AssetStudio: React.FC = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [theme, setTheme] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const generateAsset = async () => {
        if (!theme) return;
        setIsGenerating(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 3000));

            const newAsset: Asset = {
                id: Math.random().toString(36).substr(2, 9),
                type: 'image',
                prompt: theme,
                url: `https://picsum.photos/seed/${Math.random()}/1920/1080`,
                status: 'ready',
                createdAt: new Date().toISOString(),
            };

            setAssets([newAsset, ...assets]);
            setTheme('');
        } catch (error) {
            console.error('Failed to generate asset:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="asset-studio-container glass-box" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            padding: '24px',
        }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        padding: '10px',
                        background: 'linear-gradient(135deg, #bf00ff, #00deff)',
                        borderRadius: '10px'
                    }}>
                        <ImageIcon size={20} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#00deff' }}>Asset Studio</h2>
                </div>

                <div style={{ display: 'flex', background: 'rgba(5, 5, 16, 0.5)', padding: '4px', borderRadius: '8px' }}>
                    <button
                        onClick={() => setViewMode('grid')}
                        style={{
                            padding: '6px',
                            borderRadius: '6px',
                            background: viewMode === 'grid' ? 'rgba(0, 222, 255, 0.2)' : 'transparent',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <LayoutGrid size={18} color={viewMode === 'grid' ? '#00deff' : '#82a8b0'} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        style={{
                            padding: '6px',
                            borderRadius: '6px',
                            background: viewMode === 'list' ? 'rgba(0, 222, 255, 0.2)' : 'transparent',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <List size={18} color={viewMode === 'list' ? '#00deff' : '#82a8b0'} />
                    </button>
                </div>
            </header>

            <section style={{ display: 'flex', gap: '12px' }}>
                <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="Describe the visual theme (e.g., Cyberpunk Tokyo Pulse)..."
                    style={{
                        flex: 1,
                        background: 'rgba(5, 5, 16, 0.5)',
                        border: '1px solid rgba(0, 222, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        color: 'white',
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateAsset}
                    disabled={isGenerating || !theme}
                    style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #bf00ff, #ff00cc)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: isGenerating || !theme ? 0.6 : 1
                    }}
                >
                    {isGenerating ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <Sparkles size={18} />
                    )}
                    {isGenerating ? 'Generating...' : 'Invoke AI'}
                </motion.button>
            </section>

            <section className="assets-display">
                {assets.length === 0 ? (
                    <div style={{
                        padding: '48px',
                        textAlign: 'center',
                        border: '2px dashed rgba(0, 222, 255, 0.1)',
                        borderRadius: '16px',
                        color: '#82a8b0'
                    }}>
                        <ImageIcon size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                        <p>No assets generated yet.</p>
                        <p style={{ fontSize: '0.875rem' }}>Describe a theme above and invoke the AI to start your collection.</p>
                    </div>
                ) : (
                    <div style={{
                        display: viewMode === 'grid' ? 'grid' : 'flex',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        <AnimatePresence>
                            {assets.map((asset) => (
                                <motion.div
                                    key={asset.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    style={{
                                        background: 'rgba(5, 5, 16, 0.3)',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                                        <img
                                            src={asset.url}
                                            alt={asset.prompt}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            display: 'flex',
                                            gap: '8px'
                                        }}>
                                            <button style={{
                                                padding: '8px',
                                                background: 'rgba(0, 0, 0, 0.6)',
                                                border: 'none',
                                                borderRadius: '50%',
                                                color: 'white',
                                                cursor: 'pointer'
                                            }}>
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                color: asset.type === 'image' ? '#00deff' : '#ff00cc'
                                            }}>
                                                {asset.type}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: '#82a8b0' }}>
                                                {new Date(asset.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p style={{
                                            fontSize: '0.875rem',
                                            color: 'white',
                                            lineHeight: '1.4',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {asset.prompt}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>
        </div>
    );
};
