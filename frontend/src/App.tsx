import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import MyPage from './pages/MyPage';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/activity/:activityId" element={<ActivityDetailPage />} />
          <Route path="/me" element={<MyPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
