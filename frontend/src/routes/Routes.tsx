import { Route, Routes } from 'react-router-dom';
import HomeView from '../views/HomeView';
import ScoreView from '../views/ScoreView';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/score" element={<ScoreView />} />
    </Routes>
  );
};

export default AppRoutes;