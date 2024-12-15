"use client";
import React from 'react';
import './AssetManager.tsx'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
interface AssetManagerProps {
  children?: React.ReactNode;
  title: string;
}

const AssetManager: React.FC<AssetManagerProps> = ({ children = null, title = 'Untitled'}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <div>
        <label onClick={() => {setOpen(!open)}}><FontAwesomeIcon icon={open ? faChevronDown : faChevronRight} className='w-4 h-4 mx-2'/>{title}</label>
        {open ? children : null}
      </div>
    </div>
  );
}

export default AssetManager;