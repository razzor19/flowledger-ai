import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { Friend } from '../mockData';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AVATAR_COLORS = [
  '#F472B6', '#60A5FA', '#34D399', '#FBBF24', 
  '#A78BFA', '#F87171', '#38BDF8', '#4ADE80'
];

export default function AddFriendModal({ isOpen, onClose }: Props) {
  const { addFriend } = useAppContext();
  
  const [name, setName] = useState('');
  const [color, setColor] = useState(AVATAR_COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newFriend: Friend = {
      id: `f-${Date.now()}`,
      name: name.trim(),
      avatar: name.trim().charAt(0).toUpperCase(),
      color
    };

    addFriend(newFriend);
    
    // Reset
    setName('');
    setColor(AVATAR_COLORS[0]);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
         <div className="flex-row justify-between align-center" style={{ marginBottom: 20 }}>
          <h2 className="h3 flex-row align-center gap-sm">
             <UserPlus size={20} color="var(--accent-primary)" /> Add Friend
          </h2>
          <button onClick={onClose} className="icon-btn-circle" style={{ background: 'var(--bg-secondary)' }}>
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-lg">
           
           <div className="flex-col gap-sm">
             <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Friend's Name</label>
             <input 
                type="text" placeholder="e.g. John Doe"
                value={name} onChange={e => setName(e.target.value)}
                className="custom-input" 
                autoFocus
              />
           </div>

           <div className="flex-col gap-sm">
             <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Avatar Color</label>
             <div className="flex-row gap-sm" style={{ flexWrap: 'wrap' }}>
               {AVATAR_COLORS.map(c => (
                 <button
                    key={c} type="button"
                    onClick={() => setColor(c)}
                    style={{
                      width: 44, height: 44, borderRadius: '50%',
                      backgroundColor: c, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: color === c ? '3px solid var(--text-primary)' : '3px solid transparent',
                      cursor: 'pointer', outline: color === c ? '2px solid white' : 'none', outlineOffset: -2
                    }}
                 />
               ))}
             </div>
           </div>

           <button 
              type="submit" 
              className="btn-primary" 
              style={{ marginTop: 8 }}
              disabled={!name.trim()}
            >
              Add Friend
           </button>
        </form>
      </div>
    </div>
  );
}
