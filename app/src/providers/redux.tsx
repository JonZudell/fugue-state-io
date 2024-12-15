import React from 'react';
import { Provider } from 'react-redux';
import store from '../store'; // Adjust the import path as necessary

interface ReduxProviderProps {
  children: React.ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;