import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('fetchMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fetchMetrics = async (categories: string[]) => {
    const metricsResponse = categories.map(async (category) => {
      const [totalStock, totalValue, averageValue] = await Promise.all([
        axios.get(`http://localhost:9090/api/products/categoryTotalStock/${category}`),
        axios.get(`http://localhost:9090/api/products/categoryTotalValue/${category}`),
        axios.get(`http://localhost:9090/api/products/categoryAverageValue/${category}`)
      ]);

      return {
        id: categories.indexOf(category) + 1,
        category: category,
        totalStock: totalStock.data,
        totalValue: totalValue.data,
        averageValue: averageValue.data
      };
    });

    const metrics = await Promise.all(metricsResponse);
    return metrics;
  };

  it('should fetch metrics for single category', async () => {
    const mockTotalStock = { data: 150 };
    const mockTotalValue = { data: 5000.50 };
    const mockAverageValue = { data: 33.34 };

    (mockedAxios.get as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(mockTotalStock)
      .mockResolvedValueOnce(mockTotalValue)
      .mockResolvedValueOnce(mockAverageValue);

    const result = await fetchMetrics(['Electronics']);

    expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:9090/api/products/categoryTotalStock/Electronics');
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:9090/api/products/categoryTotalValue/Electronics');
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:9090/api/products/categoryAverageValue/Electronics');

    expect(result).toEqual([{
      id: 1,
      category: 'Electronics',
      totalStock: 150,
      totalValue: 5000.50,
      averageValue: 33.34
    }]);
  });

  it('should fetch metrics for multiple categories', async () => {
    const mockResponses = [
      { data: 150 },
      { data: 5000.50 },
      { data: 33.34 },

      { data: 80 },
      { data: 1200.00 },
      { data: 15.00 },

      { data: 200 },
      { data: 8500.75 },
      { data: 42.50 }
    ];

    // Mock all 9 axios calls (3 per category)
    mockResponses.forEach(response => {
      (mockedAxios.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(response);
    });

    const result = await fetchMetrics(['Electronics', 'Books', 'Clothing']);

    expect(mockedAxios.get).toHaveBeenCalledTimes(9);
    
    // Verify URLs for Electronics
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:9090/api/products/categoryTotalStock/Electronics');
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:9090/api/products/categoryTotalValue/Electronics');
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:9090/api/products/categoryAverageValue/Electronics');
    
    // Verify URLs for Books
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:9090/api/products/categoryTotalStock/Books');
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:9090/api/products/categoryTotalValue/Books');
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:9090/api/products/categoryAverageValue/Books');
    
    // Verify URLs for Clothing
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:9090/api/products/categoryTotalStock/Clothing');
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:9090/api/products/categoryTotalValue/Clothing');
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:9090/api/products/categoryAverageValue/Clothing');

    expect(result).toEqual([
      {
        id: 1,
        category: 'Electronics',
        totalStock: 150,
        totalValue: 5000.50,
        averageValue: 33.34
      },
      {
        id: 2,
        category: 'Books',
        totalStock: 80,
        totalValue: 1200.00,
        averageValue: 15.00
      },
      {
        id: 3,
        category: 'Clothing',
        totalStock: 200,
        totalValue: 8500.75,
        averageValue: 42.50
      }
    ]);
  });

});