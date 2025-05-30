import { useState, useEffect, useCallback } from "react";
import DataTable from "./components/DataTable/DataTable.tsx";
import SearchComponent from "./components/SearchComponent/SearchComponent.tsx";
import ProductEditModal from "./components/EditProductModal/EditProductModal.tsx";
import MetricsTable from "./components/MetricsTable/MetricsTable.tsx";
import CreateProductModal from "./components/CreateProductModal/CreateProductModal.tsx";
import "./App.css";
import axios from "axios";
import { type GridPaginationModel, type GridRowId, type GridSortModel } from "@mui/x-data-grid";

export interface Product {
  id?: number;
  name: string;
  category: string;
  unitPrice: any;
  expirationDate?: Date;
  stockQuantity: number;
  creationDate: Date;
  updateDate: Date;
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
  const [filterName, setFilterName] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [filterAvailability, setFilterAvailability] = useState<string>("All");
  const [uniqueCategories, setUniqueCategories] = useState<string[]>();
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [metrics, setMetrics] = useState<Object[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", paginationModel.page.toString());
      params.append("size", paginationModel.pageSize.toString());

      if (filterName) params.append("name", filterName);

      if (filterCategory.length > 0) {
        filterCategory.forEach((category) =>
          params.append("category", category)
        );
      }

      if (filterAvailability !== "All") {
        params.append("inStock", (filterAvailability === "In stock").toString());
      }

      if (sortModel.length > 0) {
        const sortItem = sortModel[0];
        params.append("sort", `${sortItem.field},${sortItem.sort}`);
      }

      const response = await axios.get<ProductPageResponse>(
        `http://localhost:9090/api/products?${params.toString()}`
      );

      response.data.content.forEach(product => {
        product.unitPrice = "$ " + product.unitPrice;
      })

      setProducts(response.data.content);
      setTotalRowCount(response.data.totalElements);
    
      const uniqueCategories = new Set<string>();
      response.data.content.forEach((product) =>
        uniqueCategories.add(product.category)
      );
      fetchMetrics(Array.from(uniqueCategories));
      setUniqueCategories(Array.from(uniqueCategories));
      setAvailableCategories(["All", ...Array.from(uniqueCategories)]);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setProducts([]);
      setTotalRowCount(0);
      alert("Failed to fetch products. Please try again.");
    }
  }, [filterName, filterCategory, filterAvailability, paginationModel, sortModel]); // Add sortModel to dependencies

  const fetchMetrics = useCallback(async (categories: string[]) => {
    try {
      const metricsResponse = categories.map(async(category) => {
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
                averageValue: averageValue.data.toFixed(2)
            };

      });
      
      const metrics = await Promise.all(metricsResponse);
      
      let totalStockOverall = 0; 
      let totalValueOverall: string | number = 0;

      const overallId = metrics.length + 1;
      metrics.forEach(metric => totalStockOverall += metric.totalStock);
      metrics.forEach(metric => totalValueOverall += metric.totalValue);
      metrics.forEach(metric => metric.totalValue = "$ " + metric.totalValue);
      metrics.forEach(metric => metric.averageValue = "$ " + metric.averageValue);

      let averageValueOverall = await axios.get("http://localhost:9090/api/products/averageValue");

      totalValueOverall = "$ " + totalValueOverall.toFixed(2);
      const averageValueOverallString: string = "$ " + averageValueOverall.data.toFixed(2);

      metrics.push({
        id: overallId,
        category: "Overall",
        totalStock: totalStockOverall,
        totalValue: totalValueOverall,
        averageValue: averageValueOverallString
      })
      setMetrics(metrics);
    }
    catch (error) { console.error(error)}
  }, [availableCategories]);

  const handleFilterChange = useCallback(
    (
      name: string,
      categories: string[],
      availability: string
    ) => {
      // Reset pagination to page 0 when filters change
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
      // Reset sorting when filters change to avoid unexpected behavior
      setSortModel([]);
      setFilterName(name);
      setFilterCategory(categories);
      setFilterAvailability(availability);
    }, []);

  const updateProductStockLocally = useCallback((id: number, newStockQuantity: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id ? { ...product, stockQuantity: newStockQuantity } : product
      )
    );
  }, []);

  const markOutOfStock = useCallback(async (id: number) => {
    if (id) {
      const originalProduct = products.find(p => p.id === id);
      updateProductStockLocally(id, 0); // Optimistic UI update
      try {
        await axios.post(`http://localhost:9090/api/products/${id}/outofstock`);
        fetchProducts(); // Re-fetch to ensure consistency with backend
      } catch (err: any) {
        console.error("An error occurred when setting product out of stock: ", err);
        alert(`Failed to mark product ${id} out of stock.`);
        // Revert optimistic update if API call fails
        if (originalProduct) {
          updateProductStockLocally(id, originalProduct.stockQuantity);
        }
        fetchProducts(); // Re-fetch to revert UI if API failed or for general consistency
      }
    }
  }, [products, updateProductStockLocally, fetchProducts]);

  const markInStock = useCallback(async (id: number, quantity: number = 10) => {
    const originalProduct = products.find(p => p.id === id); // Store original state for potential revert
    updateProductStockLocally(id, quantity); // Optimistic UI update

    try {
      await axios.put(`http://localhost:9090/api/products/${id}/instock?quantity=${quantity}`);
      fetchProducts(); // Re-fetch to ensure consistency
    } catch (err: any) {
      console.error("An error occurred when setting product's stock: ", err);
      alert(`Failed to mark product ${id} in stock.`);
      // Revert optimistic update if API call fails
      if (originalProduct) {
        updateProductStockLocally(id, originalProduct.stockQuantity);
      }
      fetchProducts();
    }
  }, [products, updateProductStockLocally, fetchProducts]);

  const handleCreateButtonClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditButtonClick = useCallback(async (id: GridRowId) => {
    const productToEdit = products.find(p => p.id === id);
    if (productToEdit) {
      productToEdit.unitPrice = Number(productToEdit.unitPrice.slice(2))
      setEditingProduct(productToEdit); 
      setIsEditModalOpen(true); 
    } else {
      alert("Product not found for editing.");
    }
  }, [products]);

  const handleDeleteButtonClick = useCallback(async (id: GridRowId) => {
    if (!window.confirm(`Are you sure you want to delete product with ID: ${id}?`)) {
      return;
    }
    try {
      await axios.delete(`http://localhost:9090/api/products/${id}`);
      alert(`Product with ID ${id} deleted successfully!`);
      fetchProducts();
    } catch (err: any) {
      console.error(`An error occurred when deleting product with id ${id}:`, err);
      alert(`Failed to delete product with ID ${id}.`);
    }
  }, [fetchProducts]);

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  }, []);

  const handleSaveNewProduct = useCallback(async (product: Product) => {
    try {
      await axios.post("http://localhost:9090/api/products", product);
      alert(`${product.name} product was successfully created`);
      fetchProducts();
      handleCloseCreateModal();
    } catch (err) { 
      console.error("An error occurred when creating product", err);
      alert("Failed to create product!");
    };
  }, [fetchProducts, handleCloseCreateModal])

  const handleSaveEditedProduct = useCallback(async (updatedProduct: Product) => {
    try {
      await axios.put(`http://localhost:9090/api/products/${updatedProduct.id}`, updatedProduct);
      alert(`Product ${updatedProduct.name} updated successfully!`);
      fetchProducts();
      handleCloseEditModal();
    } catch (err: any) {
      console.error(`An error occurred when updating product ${updatedProduct.id}:`, err);
      alert(`Failed to update product ${updatedProduct.name}.`);
    }
  }, [fetchProducts, handleCloseEditModal]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="app">
      <div style={{display: "flex "}}>
        <SearchComponent
        onFilterChange={handleFilterChange}
        availableCategories={availableCategories}
        handleCreateButtonClick={handleCreateButtonClick}
        />
      </div>
      <DataTable
        products={products}
        totalRowCount={totalRowCount}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        sortModel={sortModel}
        setSortModel={setSortModel}
        onMarkInStock={markInStock}
        onMarkOutOfStock={markOutOfStock}
        handleEditButtonClick={handleEditButtonClick}
        handleDeleteButtonClick={handleDeleteButtonClick}
      />
      <CreateProductModal 
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveNewProduct}
        categories={uniqueCategories}
      />

      <ProductEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        product={editingProduct} 
        onSave={handleSaveEditedProduct}
        categories={uniqueCategories}
      />

      <MetricsTable
        metrics={metrics}
      />
    </div>
  );
}

export default App;
