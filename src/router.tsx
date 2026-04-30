import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from './layout'
import { HabitsPage } from '@/modules/habits/presentation/pages/habits.page'
import { TodayPage } from '@/modules/tracking/presentation/pages/today.page'
import { StatsPage } from '@/modules/stats/presentation/pages/stats.page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/today" replace /> },
      { path: 'today', element: <TodayPage /> },
      { path: 'habits', element: <HabitsPage /> },
      { path: 'stats', element: <StatsPage /> },
    ],
  },
])
