import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Card } from '../ui/card';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Widget {
  id: string;
  title: string;
  component: React.ReactNode;
  defaultSize: { w: number; h: number };
}

interface DashboardProps {
  widgets: Widget[];
}

export const CustomizableDashboard: React.FC<DashboardProps> = ({ widgets }) => {
  const [layouts, setLayouts] = useState({});

  const initialLayout = widgets.map((widget, index) => ({
    i: widget.id,
    x: (index * 4) % 12,
    y: Math.floor(index / 3) * 4,
    w: widget.defaultSize.w,
    h: widget.defaultSize.h,
    minW: 3,
    minH: 2,
  }));

  const onLayoutChange = (layouts: any) => {
    setLayouts(layouts);
  };

  return (
    <div className="p-4">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: initialLayout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        onLayoutChange={onLayoutChange}
        isDraggable={true}
        isResizable={true}
      >
        {widgets.map((widget) => (
          <div key={widget.id}>
            <Card className="h-full overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">{widget.title}</h3>
                <div className="h-full">{widget.component}</div>
              </div>
            </Card>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};
