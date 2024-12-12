import React from 'react';
import { IconButton } from '@deque/cauldron-react'


const IconBar: React.FC = () => {
  return (
    <div className="icon-bar">
      <ul>
        <li>
          <IconButton icon="link" label={"link 1"} />
        </li>
        <li>
          <IconButton icon="link" label={"link 2"}  />
        </li>
        <li>
          <IconButton icon="link" label={"link 3"}  />
        </li>
        <li>
          <IconButton icon="link" label={"link 4"}  />
        </li>
      </ul>
    </div>
  );
};

export default IconBar;