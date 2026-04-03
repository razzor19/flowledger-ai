import React, { useState } from 'react';
import { X, Users, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { SplitGroup } from '../mockData';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const EMOJIS = ['🏠', '✈️', '🍽️', '🎉', '🚗', '🐶', '🎁', '🛒', '💡', '🎾', '🏕️', '🥂'];

export default function CreateGroupModal({ isOpen, onClose }: Props) {
  const { friends, createGroup } = useAppContext();
  
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('👥');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleFriend = (id: string) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(prev => prev.filter(fId => fId !== id));
    } else {
      setSelectedFriends(prev => [...prev, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedFriends.length === 0) return;

    const newGroup: SplitGroup = {
      id: `g-${Date.now()}`,
      name: name.trim(),
      emoji,
      members: selectedFriends,
      createdAt: new Date().toISOString()
    };

    createGroup(newGroup);
    
    // Reset
    setName('');
    setEmoji('👥');
    setSelectedFriends([]);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ maxHeight: '88vh', overflow: 'auto' }}>
         <div className="flex-row justify-between align-center" style={{ marginBottom: 20 }}>
          <h2 className="h3 flex-row align-center gap-sm">
            <Users size={20} color="var(--accent-primary)" /> Create Group
          </h2>
          <button onClick={onClose} className="icon-btn-circle" style={{ background: 'var(--bg-secondary)' }}>
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-lg">
          {/* Header area - Icon + Name */}
           <div className="flex-row gap-sm align-center">
             <div style={{ 
               width: 56, height: 56, borderRadius: 16, backgroundColor: 'var(--bg-secondary)', 
               display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
               border: '1px solid var(--border-color)', flexShrink: 0
             }}>
               {emoji}
             </div>
             <input 
                type="text" placeholder="Group name (e.g. Apartment, Trip)"
                value={name} onChange={e => setName(e.target.value)}
                className="custom-input" 
                style={{ flex: 1, fontSize: 16, fontWeight: 500 }}
                autoFocus
              />
           </div>

           {/* Emoji Picker */}
           <div className="flex-col gap-xs">
             <span className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Choose Icon</span>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
               {EMOJIS.map(em => (
                 <button
                    key={em} type="button"
                    onClick={() => setEmoji(em)}
                    style={{
                      aspectRatio: '1', borderRadius: 8, fontSize: 24,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: emoji === em ? 'var(--accent-secondary)' : 'var(--bg-secondary)',
                      border: `1px solid ${emoji === em ? 'var(--accent-primary)' : 'transparent'}`,
                      cursor: 'pointer'
                    }}
                 >{em}</button>
               ))}
             </div>
           </div>

           {/* Friend Selector */}
           <div className="flex-col gap-sm">
             <div className="flex-row justify-between align-center">
                <span className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Group Members</span>
                <span className="body-tiny" style={{ color: 'var(--text-secondary)' }}>{selectedFriends.length + 1} Selected</span>
             </div>
             
             <div className="flex-col gap-sm">
                {/* Me (Always included implicitly, but good to show) */}
                <div className="card flex-row justify-between align-center" style={{ padding: '10px 14px', opacity: 0.7 }}>
                  <div className="flex-row align-center gap-md">
                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>
                      Me
                    </div>
                    <span className="body" style={{ fontWeight: 500 }}>You (Creator)</span>
                  </div>
                  <Check size={18} color="var(--accent-primary)" />
                </div>

                {friends.length === 0 ? (
                  <p className="body-small" style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '12px 0' }}>
                    Add some friends first!
                  </p>
                ) : (
                  friends.map(f => (
                    <div 
                      key={f.id} 
                      className="card flex-row justify-between align-center" 
                      style={{ padding: '10px 14px', cursor: 'pointer' }}
                      onClick={() => toggleFriend(f.id)}
                    >
                      <div className="flex-row align-center gap-md">
                        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>
                          {f.avatar}
                        </div>
                        <span className="body" style={{ fontWeight: 500 }}>{f.name}</span>
                      </div>
                      <div style={{ 
                        width: 24, height: 24, borderRadius: 6,
                        border: `2px solid ${selectedFriends.includes(f.id) ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                        backgroundColor: selectedFriends.includes(f.id) ? 'var(--accent-primary)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {selectedFriends.includes(f.id) && <Check size={14} color="white" />}
                      </div>
                    </div>
                  ))
                )}
             </div>
           </div>

           <button 
              type="submit" 
              className="btn-primary" 
              style={{ marginTop: 8 }}
              disabled={!name.trim() || selectedFriends.length === 0}
            >
              Start Group
           </button>
        </form>
      </div>
    </div>
  );
}
