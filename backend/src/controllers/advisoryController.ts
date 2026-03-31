import { Request, Response } from 'express';

export const getWeather = (_req: Request, res: Response): void => {
  res.json({
    success: true,
    data: {
      location: 'Nashik, Maharashtra',
      temperature: 28,
      humidity: 65,
      forecast: 'Sunny with light rain expected in the evening',
      alerts: [
        {
          type: 'rain',
          message: 'Light rain expected tomorrow. Consider harvesting before 2 PM.',
          severity: 'medium',
        },
      ],
    },
  });
};

export const getPestAlerts = (_req: Request, res: Response): void => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        crop: 'Tomato',
        pest: 'Tomato Leaf Miner',
        risk: 'high',
        message: 'High risk in your area. Consider applying neem oil as a preventive measure.',
        recommendation: 'Apply neem oil spray every 7 days',
      },
      {
        id: '2',
        crop: 'Rice',
        pest: 'Rice Blast',
        risk: 'medium',
        message: 'Moderate risk detected. Monitor your crop closely.',
        recommendation: 'Use fungicide if symptoms appear',
      },
      {
        id: '3',
        crop: 'Wheat',
        pest: 'Aphids',
        risk: 'low',
        message: 'Low risk in your area. No immediate action required.',
        recommendation: 'Monitor weekly',
      },
    ],
  });
};

export const getInsights = (_req: Request, res: Response): void => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        type: 'price',
        title: 'Tomato Prices Rising',
        message: 'Tomato prices have increased by 15% in your region. Consider timing your next harvest for maximum profit.',
        action: 'Schedule harvest for next week',
      },
      {
        id: '2',
        type: 'demand',
        title: 'New Buyers in Your Area',
        message: '3 new buyers are looking for organic tomatoes in your region. Update your listings to attract them.',
        action: 'Update product listings',
      },
      {
        id: '3',
        type: 'trend',
        title: 'Market Trend Analysis',
        message: 'Rice demand is expected to increase by 20% next month due to festival season.',
        action: 'Plan for increased production',
      },
    ],
  });
};
