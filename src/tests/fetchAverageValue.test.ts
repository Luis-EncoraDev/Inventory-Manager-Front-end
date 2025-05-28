import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('averageValueOverall', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fetchAverageValueOverall = async () => {
    let averageValueOverall: any = await axios.get("http://localhost:9090/api/products/averageValue");
    return averageValueOverall.data;
  };

  it('should make GET request and receive correct response', async () => {
    const mockResponse = {
      data: 125.75
    };

    (mockedAxios.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    const result = await fetchAverageValueOverall();

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:9090/api/products/averageValue');
    expect(result).toEqual(mockResponse.data);
  });
});