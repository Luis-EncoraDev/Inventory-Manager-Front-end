import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('Product API Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setProductOutOfStock = async (id: number) => {
    await axios.post(`http://localhost:9090/api/products/${id}/outofstock`);
  };

  const setProductInStock = async (id: number, quantity: number) => {
    await axios.put(`http://localhost:9090/api/products/${id}/instock?quantity=${quantity}`);
  };

  const deleteProduct = async (id: number) => {
    await axios.delete(`http://localhost:9090/api/products/${id}`);
  };

  const createProduct = async (product: any) => {
    await axios.post("http://localhost:9090/api/products", product);
  };

  const updateProduct = async (updatedProduct: any) => {
    await axios.put(`http://localhost:9090/api/products/${updatedProduct.id}`, updatedProduct);
  };

  it('should set product out of stock', async () => {
    const mockResponse = { data: { success: true } };
    (mockedAxios.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    await setProductOutOfStock(123);

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:9090/api/products/123/outofstock');
  });

  it('should set product in stock with quantity', async () => {
    const mockResponse = { data: { success: true } };
    (mockedAxios.put as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    await setProductInStock(456, 50);

    expect(mockedAxios.put).toHaveBeenCalledTimes(1);
    expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:9090/api/products/456/instock?quantity=50');
  });

  it('should delete product', async () => {
    const mockResponse = { data: { success: true } };
    (mockedAxios.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    await deleteProduct(789);

    expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
    expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:9090/api/products/789');
  });

  it('should create new product', async () => {
    const newProduct = {
      name: 'New Product',
      category: 'Electronics',
      price: 99.99,
      quantity: 10
    };
    const mockResponse = { data: { id: 1, ...newProduct } };
    (mockedAxios.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    await createProduct(newProduct);

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:9090/api/products', newProduct);
  });

  it('should update existing product', async () => {
    const updatedProduct = {
      id: 100,
      name: 'Updated Product',
      category: 'Books',
      price: 29.99,
      quantity: 5
    };
    const mockResponse = { data: updatedProduct };
    (mockedAxios.put as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    await updateProduct(updatedProduct);

    expect(mockedAxios.put).toHaveBeenCalledTimes(1);
    expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:9090/api/products/100', updatedProduct);
  });
});