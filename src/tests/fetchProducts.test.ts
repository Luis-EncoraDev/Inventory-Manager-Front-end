import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('fetchProducts with vi.mock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fetchProducts = async (paginationModel: any, filterName: string = '', filterCategory: string = '', filterAvailability = 'All') => {
    const params = new URLSearchParams();
    params.append("page", paginationModel.page.toString());
    params.append("size", paginationModel.pageSize.toString());

    if (filterName) params.append("name", filterName);
    if (filterCategory) params.append("category", filterCategory);

    if (filterAvailability !== "All") {
      params.append("inStock", (filterAvailability === "In stock").toString());
    }

    const response = await axios.get(
      `http://localhost:9090/api/products?${params.toString()}`
    );

    return response.data;
  };

  it('should make GET request with correct URL and parameters', async () => {
    const mockResponse = {
      data: {
        content: [
          { id: 1, name: 'Test Product', category: 'Electronics' }
        ],
        totalElements: 1,
        totalPages: 1
      }
    };

    (mockedAxios.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    const result = await fetchProducts(
      { page: 0, pageSize: 10 },
      'test',
      'Electronics',
      'In stock'
    );

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse.data);
  });
});