import { useRoutes } from 'react-router-dom'
import routes from './routes'
import './App.less';

function App() {
  const element = useRoutes(routes)
  return (
    <div className="App">
      {element}
    </div>
  );
}

export default App;
