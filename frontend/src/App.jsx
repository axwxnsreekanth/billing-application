import '../src/custom.css';
import SideBar from '../src/components/SideBar';
import { ToastProvider } from './components';

export default function App() {
  return (
    <>
      <ToastProvider>
        <SideBar />
      </ToastProvider>
    </>
  );
}