import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import * as dashboardApi from '../../api/dashboard';

vi.mock('../../api/dashboard', () => ({
  getDashboardSummary: vi.fn(),
}));

vi.mock('../../component/Navbar', () => ({
  default: () => <div>Navbar</div>,
}));

vi.mock('../../component/Dashboard/Chart/BarChart', () => ({
  default: () => <div>Chart</div>,
}));

vi.mock('../../component/Dashboard/ListCard/ListCard', () => ({
  default: ({ title, data, renderItem }) => (
    <div>
      <h3>{title}</h3>
      {data?.length > 0 ? data.map((item, index) => <div key={index}>{renderItem(item)}</div>) : <p>No data</p>}
    </div>
  ),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.mocked(dashboardApi.getDashboardSummary).mockReset();
  });

  it('renders KPI cards and recent trips from the dashboard summary', async () => {
    vi.mocked(dashboardApi.getDashboardSummary).mockResolvedValue({
      totalTrips: 3,
      totalAmount: 12000,
      totalSharedTrips: 1,
      monthlyTrips: [],
      recentTrips: [
        {
          tripName: 'Weekend Goa',
          destination: 'Goa',
          persons: 4,
          totalCost: 8000,
        },
      ],
      expensiveTrips: [],
      cheapTrips: [],
    });

    render(<Dashboard />);

    expect(await screen.findByText('Total Trips')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Weekend Goa')).toBeInTheDocument();
  });
});
