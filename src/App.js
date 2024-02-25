import './App.css';
import { Toaster } from 'react-hot-toast';
import TableTop from './pages/TableTop';

function App() {
  return (
    <div className="App">
      <TableTop />
      <Toaster />
    </div>
  );
}

export default App;
