import { ToastrProvider } from './ToastrContext';

export default function ToastrWrapper({ children }) {
  return <ToastrProvider>{children}</ToastrProvider>;
} 