import { NavLink } from 'react-router-dom';
import { ArrowLeftRight, BarChart3, Settings, Users } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
  return (
    <div className="bottom-nav">
      <NavLink to="/app/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <div className="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <span>Home</span>
      </NavLink>
      <NavLink to="/app/transactions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <div className="icon-container">
          <ArrowLeftRight size={20} />
        </div>
        <span>List</span>
      </NavLink>
      <NavLink to="/app/split" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <div className="icon-container">
          <Users size={20} />
        </div>
        <span>Split</span>
      </NavLink>
      <NavLink to="/app/report" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <div className="icon-container">
          <BarChart3 size={20} />
        </div>
        <span>Report</span>
      </NavLink>
      <NavLink to="/app/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <div className="icon-container">
          <Settings size={20} />
        </div>
        <span>Settings</span>
      </NavLink>
    </div>
  );
}
