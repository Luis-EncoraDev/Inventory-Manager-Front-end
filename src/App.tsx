import React, { useState, useEffect, useCallback } from 'react';
import DataTable from "./components/DataTable/DataTable.tsx";
import SearchComponent from "./components/SearchComponent/SearchComponent.tsx";
import './App.css';
import axios from 'axios';
import { type GridPaginationModel } from '@mui/x-data-grid';

interface Product {
  id: number;
  name: string;
  category: string;
  unitPrice: number;
  expirationDate?: string;
  stockQuantity: number;
  creationDate: string;
  updateDate: string;
}

interface ProductPageResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);


  const [filterName, setFilterName] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [filterAvailability, setFilterAvailability] = useState<string>('All');

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('page', paginationModel.page.toString());
      params.append('size', paginationModel.pageSize.toString());

      if (filterName) {
        params.append('name', filterName);
      }
      if (filterCategory.length > 0) {
        filterCategory.forEach(category => params.append('category', category));
      }
      if (filterAvailability !== 'All') {
        params.append('inStock', (filterAvailability === 'In stock').toString());
      }

      const response = await axios.get<ProductPageResponse>(
        `http://localhost:9090/api/products?${params.toString()}`
      );

      setProducts(response.data.content);
      setTotalRowCount(response.data.totalElements); // Update total rows for pagination

      const uniqueCategories = new Set<string>();
      response.data.content.forEach(product => uniqueCategories.add(product.category));

      setAvailableCategories(["All", ...Array.from(uniqueCategories)]);

    } catch (err: any) {
      console.error("Error fetching data:", err);
      setProducts([]);
      setTotalRowCount(0);
    } finally {
    }
  }, [filterName, filterCategory, filterAvailability, paginationModel]); // Dependencies for re-fetching

  // Trigger fetch when filter or pagination/sort models change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle filter changes from SearchComponent
  const handleFilterChange = useCallback((
    name: string,
    categories: string[],
    availability: string
  ) => {
    // When filters change, reset to the first page
    setPaginationModel(prev => ({ ...prev, page: 0 }));
    setFilterName(name);
    setFilterCategory(categories);
    setFilterAvailability(availability);
  }, []);

  return (
    <div className="app">
      <SearchComponent
        onFilterChange={handleFilterChange}
        availableCategories={availableCategories} // Pass available categories to SearchComponent
      />
      <DataTable
        products={products}
        totalRowCount={totalRowCount}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
    </div>
  );
}

export default App;