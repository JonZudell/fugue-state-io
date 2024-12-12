import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCat, faDog, faDragon, faGear, faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import './LeftMenu.css';
export default function LeftMenu() {
  const [width, setWidth] = useState(256);
  const [mouseDown, setMouseDown] = useState(false)
  let lastWidth = width;
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDown(true)
    lastWidth = e.clientX;
    const startWidth = width;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - lastWidth);
      setWidth(newWidth > 32 ? newWidth : 0);
    };

    const handleMouseUp = () => {
      setMouseDown(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  return (
    <>
      <div id="menu" className='bg-gray-800 h-screen w-16 float-left flex flex-col justify-between undraggable'>
        <ul className='menu'>
          <li className='button'>
            <FontAwesomeIcon className='w-8 h-8 m-4' icon={faHouse} />
          </li>
          <li className='button'>
            <FontAwesomeIcon className='w-8 h-8 m-4' icon={faCat} />
          </li>
          <li className='button'>
            <FontAwesomeIcon className='w-8 h-8 m-4' icon={faDog} />
          </li>
          <li className='button'>
            <FontAwesomeIcon className='w-8 h-8 m-4' icon={faDragon} />
          </li>
        </ul>
        <ul className='menu-bottom'>
          <li className='button'>
            <FontAwesomeIcon className='w-8 h-8 m-4' icon={faUser} />
          </li>
          <li className='button'>
            <FontAwesomeIcon className='w-8 h-8 m-4' icon={faGear} />
          </li>
        </ul>
      </div>
      <div style={{ width: '2px'}} 
        className={`${width <= 32 && mouseDown ? 'bg-blue-600' : 'bg-gray-600'} h-screen float-left flex flex-col `} 
        onMouseDown={handleMouseDown} />
      <div>
        {width > 32 ? (
        <div style={{ width: `${Math.max(width, 64)}px` }} 
          className='drawer bg-gray-800 h-screen float-left flex flex-col justify-between undraggable'>

        </div>
        ) : null}
        <div style={{ width: width > 32 ? '4px' : '0px', cursor: 'ew-resize'}}
          className={`bg-gray-800 h-screen float-left clickable-area`} 
          onMouseDown={handleMouseDown} />
        <div style={{ width: '2px', cursor: 'ew-resize'}}
          className={`bg-gray-600 h-screen float-left clickable-area ${mouseDown ? 'bg-blue-600' : 'bg-gray-600'}`} 
          onMouseDown={handleMouseDown} />
      </div>
    </>
  )
}