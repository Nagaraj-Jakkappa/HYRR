import React, { useState } from 'react';
import { magicRewriteAPI } from '../../services/api';

interface MagicRewriteButtonProps {
    currentText: string;
    jobTitle?: string;
    onRewrite: (newText: string) => void;
}

const MagicRewriteButton: React.FC<MagicRewriteButtonProps> = ({ currentText, jobTitle, onRewrite }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRewrite = async () => {
        if (!currentText.trim()) {
            setError('Please type something first!');
            setTimeout(() => setError(null), 3000);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await magicRewriteAPI(currentText, jobTitle);
            if (data.success) {
                // Strip out bullet points if the AI accidentally added them
                const cleanedText = data.improved.replace(/^[-•*]\s*/, '');
                onRewrite(cleanedText);
            }
        } catch (err) {
            setError('Failed to rewrite. Try again.');
            setTimeout(() => setError(null), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={handleRewrite}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-purple-600 bg-purple-50 rounded-md border border-purple-200 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
            >
                {isLoading ? (
                    <span className="animate-spin text-lg">⏳</span>
                ) : (
                    <span className="text-lg">✨</span>
                )}
                {isLoading ? 'Rewriting...' : 'Magic Rewrite'}
            </button>

            {error && (
                <span className="absolute -top-8 left-0 w-max bg-red-100 text-red-600 text-xs px-2 py-1 rounded shadow-sm animate-fade-in">
                    {error}
                </span>
            )}
        </div>
    );
};

export default MagicRewriteButton;