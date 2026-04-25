import { createSignal, createEffect, onMount } from 'solid-js';
import { loadDashboards } from '../store/dashboardStore';
import { useTranslate } from '../utils/useTranslate';
import './App.css';
import DashboardTabBar from './components/DashboardTabBar';
import DashboardView from './components/DashboardView';

function App() {
  const t = useTranslate();
  const [appTitle, setAppTitle] = createSignal('');

  // Load translation for app title
  createEffect(async () => {
    const title = await t('APP.TITLE');
    setAppTitle(title);
  });

  // Load dashboards on mount
  onMount(() => {
    loadDashboards();
  });

  return (
    <div class="app">
      <header class="app-header">
        <h1>{appTitle()}</h1>
      </header>
      <main class="app-main">
        <DashboardTabBar />
        <DashboardView />
      </main>
    </div>
  );
}

export default App;
