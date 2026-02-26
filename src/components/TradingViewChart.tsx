import { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import type { AnalysisResult } from '../types';

interface TradingViewChartProps {
  analysis: AnalysisResult | null;
  historicalData?: {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
}

export default function TradingViewChart({ analysis, historicalData }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const candlestickSeriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1f2937' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#374151',
      },
      timeScale: {
        borderColor: '#374151',
        timeVisible: true,
      },
      height: 400,
    });

    // Candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Sample/demo data if no historical data
    if (!historicalData || historicalData.length === 0) {
      const demoData = generateDemoData();
      candlestickSeries.setData(demoData);
    } else {
      const formattedData = historicalData.map(d => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));
      candlestickSeries.setData(formattedData);
    }

    // Add markers for signals
    if (analysis && analysis.signal.type !== 'NEUTRAL') {
      const markers = [
        {
          time: Date.now() / 1000,
          position: analysis.signal.type === 'LONG' ? 'belowBar' : 'aboveBar',
          color: analysis.signal.type === 'LONG' ? '#22c55e' : '#ef4444',
          shape: analysis.signal.type === 'LONG' ? 'arrowUp' : 'arrowDown',
          text: `${analysis.signal.type} Entry`,
          size: 2,
        },
      ];
      candlestickSeries.setMarkers(markers);
    }

    // Add support/resistance lines
    if (analysis) {
      // Current price line
      const priceLine = candlestickSeries.createPriceLine({
        price: analysis.currentPrice,
        color: '#3b82f6',
        lineWidth: 2,
        lineStyle: 2,
        title: 'Current Price',
      });

      // Support levels
      analysis.supportResistance.support.forEach((level, i) => {
        candlestickSeries.createPriceLine({
          price: level,
          color: '#22c55e',
          lineWidth: 1,
          lineStyle: 3,
          title: i === 0 ? 'Support' : '',
        });
      });

      // Resistance levels
      analysis.supportResistance.resistance.forEach((level, i) => {
        candlestickSeries.createPriceLine({
          price: level,
          color: '#ef4444',
          lineWidth: 1,
          lineStyle: 3,
          title: i === 0 ? 'Resistance' : '',
        });
      });
    }

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [analysis, historicalData]);

  // Generate demo candlestick data
  function generateDemoData() {
    const data = [];
    const now = Date.now();
    let basePrice = 68000;
    
    for (let i = 100; i >= 0; i--) {
      const time = Math.floor((now - i * 4 * 60 * 60 * 1000) / 1000); // 4h candles
      const volatility = basePrice * 0.02;
      const open = basePrice + (Math.random() - 0.5) * volatility;
      const close = open + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      
      data.push({
        time,
        open: Math.round(open),
        high: Math.round(high),
        low: Math.round(low),
        close: Math.round(close),
      });
      
      basePrice = close;
    }
    
    return data;
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        BTC/USD Chart (4H)
        {analysis && (
          <span className="text-xs text-gray-400">| Current: ${analysis.currentPrice.toLocaleString()}</span>
        )}
      </h3>
      <div ref={chartContainerRef} className="w-full" style={{ height: '400px' }} />
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-green-500"></span>
          <span className="text-gray-400">Support</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-red-500"></span>
          <span className="text-gray-400">Resistance</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-blue-500 border-dashed"></span>
          <span className="text-gray-400">Current Price</span>
        </div>
        {analysis?.signal.type !== 'NEUTRAL' && (
          <div className="flex items-center gap-1">
            <span className={analysis?.signal.type === 'LONG' ? 'text-green-400' : 'text-red-400'}>
              {analysis?.signal.type === 'LONG' ? '↑' : '↓'}
            </span>
            <span className="text-gray-400">
              Signal: {analysis?.signal.type} ({analysis?.signal.confidence.toFixed(0)}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
