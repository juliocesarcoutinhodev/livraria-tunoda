/**
 * Dashboard Types - Tipos relacionados a métricas do dashboard
 *
 * @module types/dashboard
 */

export interface DashboardKpis {
  totalOrders: number;
  ordersMonthly: number;
  ordersDaily: number;
}

export interface OrdersByDayPoint {
  date: string;
  count: number;
}

export interface TopSoldItem {
  bookId: string;
  title: string;
  totalSold: number;
}

export interface DashboardMetricItem {
  bookId: string;
  title: string;
  total: number;
}

export interface DashboardMetrics {
  kpis: DashboardKpis;
  ordersByDay: OrdersByDayPoint[];
  topSold: TopSoldItem[];
  mostViewed: DashboardMetricItem[];
  mostClicked: DashboardMetricItem[];
}
