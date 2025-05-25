import React, { useState, useEffect, useCallback } from "react";
import DataTable from "./components/DataTable/DataTable.tsx";
import SearchComponent from "./components/SearchComponent/SearchComponent.tsx";
import ProductEditModal from "./components/EditProductModal/EditProductModal.tsx";
import MetricsTable from "./components/MetricsTable/MetricsTable.tsx";
import "./App.css";
import axios from "axios";
import { type GridPaginationModel, type GridRowId } from "@mui/x-data-grid";

export interface Product {
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

interface MetricsResponse {
  totalStock: number,
  totalValue: number,
  averageValue: number
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [filterName, setFilterName] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [filterAvailability, setFilterAvailability] = useState<string>("All");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
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

      const response = await axios.get<ProductPageResponse>(
        `http://localhost:9090/api/products?${params.toString()}`
      );

      setProducts(response.data.content);
      console.log("Products", response.data.content)
      setTotalRowCount(response.data.totalElements);
    
      const uniqueCategories = new Set<string>();
      response.data.content.forEach((product) =>
        uniqueCategories.add(product.category)
      );
      fetchMetrics(Array.from(uniqueCategories));
      setAvailableCategories(["All", ...Array.from(uniqueCategories)]);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setProducts([]); // Clear products on error
      setTotalRowCount(0); // Reset total count on error
      alert("Failed to fetch products. Please try again.");
    }
  }, [filterName, filterCategory, filterAvailability, paginationModel]); // Dependencies for re-fetching

  /*
    Handles changes to the filter criteria from the SearchComponent.
    Resets pagination to the first page when filters are applied.
   */

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
                averageValue: averageValue.data
            };

      });
      
      const metrics = await Promise.all(metricsResponse);
      console.log("Metrics:", metrics)
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
      // When filters change, reset to the first page
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
      setFilterName(name);
      setFilterCategory(categories);
      setFilterAvailability(availability);
    }, []);

  /**
   * Helper function to update a product's stock quantity in the local state.
   * This provides immediate UI feedback (optimistic update).
   */
  const updateProductStockLocally = useCallback((id: number, newStockQuantity: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id ? { ...product, stockQuantity: newStockQuantity } : product
      )
    );
  }, []);

  /**
   * Function to mark a product out of stock.
   * Includes optimistic UI update and error handling.
   */
  const markOutOfStock = useCallback(async (id: number) => {
    console.log(`Checkbox checked: Marking product ${id} out of stock...`);
    const originalProduct = products.find(p => p.id === id); // Store original state for potential revert
    updateProductStockLocally(id, 0); // Optimistic UI update

    try {
      await axios.post(`http://localhost:9090/api/products/${id}/outofstock`);
      fetchProducts(); // Re-fetch to ensure consistency
    } catch (err: any) {
      console.error("An error occurred when setting product out of stock: ", err);
      alert(`Failed to mark product ${id} out of stock.`);
      // Revert optimistic update if API call fails
      if (originalProduct) {
        updateProductStockLocally(id, originalProduct.stockQuantity);
      }
      fetchProducts(); // Re-fetch to revert UI if API failed or for general consistency
    }
  }, [products, updateProductStockLocally, fetchProducts]);

  /**
   * Function to mark a product in stock with a default quantity.
   * Includes optimistic UI update and error handling.
   */
  const markInStock = useCallback(async (id: number, quantity: number = 10) => {
    console.log(`Checkbox unchecked: Marking product ${id} in stock (qty ${quantity})...`);
    const originalProduct = products.find(p => p.id === id); // Store original state for potential revert
    updateProductStockLocally(id, quantity); // Optimistic UI update

    try {
      // Corrected: Use axios.put to match Spring Boot @PutMapping
      await axios.put(`http://localhost:9090/api/products/${id}/instock?quantity=${quantity}`);
      fetchProducts(); // Re-fetch to ensure consistency
    } catch (err: any) {
      console.error("An error occurred when setting product's stock: ", err);
      alert(`Failed to mark product ${id} in stock.`);
      // Revert optimistic update if API call fails
      if (originalProduct) {
        updateProductStockLocally(id, originalProduct.stockQuantity);
      }
      fetchProducts(); // Re-fetch to revert UI if API failed or for general consistency
    }
  }, [products, updateProductStockLocally, fetchProducts]);

  /**
   * Handler for the "Edit" button click in DataTable.
   * Sets the product to be edited and opens the modal.
   */
  const handleEditButtonClick = useCallback(async (id: GridRowId) => {
    // Find the product in the current products state
    const productToEdit = products.find(p => p.id === id);
    if (productToEdit) {
      setEditingProduct(productToEdit); // Set the product data for the modal
      setIsEditModalOpen(true); // Open the modal
    } else {
      alert("Product not found for editing.");
    }
  }, [products]); // Dependency on products to ensure we find the current product

  /**
   * Handler for the "Delete" button click in DataTable.
   * Prompts for confirmation and then sends a DELETE request.
   */
  const handleDeleteButtonClick = useCallback(async (id: GridRowId) => {
    // IMPORTANT: For real applications, use a custom modal for confirmation
    // instead of window.confirm due to potential browser blocking.
    if (!window.confirm(`Are you sure you want to delete product with ID: ${id}?`)) {
      return; // User cancelled the deletion
    }
    try {
      await axios.delete(`http://localhost:9090/api/products/${id}`);
      alert(`Product with ID ${id} deleted successfully!`);
      fetchProducts(); // Re-fetch products to update the table after deletion
    } catch (err: any) {
      console.error(`An error occurred when deleting product with id ${id}:`, err);
      alert(`Failed to delete product with ID ${id}.`);
    }
  }, [fetchProducts]); // Dependency on fetchProducts to refresh data

  /**
   * Handler for closing the edit modal.
   * Resets the modal state.
   */
  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingProduct(null); // Clear the editing product state
  }, []);

  /**
   * Handler for saving edited product from the modal.
   * Sends PUT request to update the product in the backend.
   */
  const handleSaveEditedProduct = useCallback(async (updatedProduct: Product) => {
    try {
      // Send the updated product data to the backend
      await axios.put(`http://localhost:9090/api/products/${updatedProduct.id}`, updatedProduct);
      alert(`Product ${updatedProduct.name} updated successfully!`);
      fetchProducts(); // Re-fetch products to update the table with the new data
      handleCloseEditModal(); // Close the modal after successful save
    } catch (err: any) {
      console.error(`An error occurred when updating product ${updatedProduct.id}:`, err);
      alert(`Failed to update product ${updatedProduct.name}.`);
    }
  }, [fetchProducts, handleCloseEditModal]);

  // Effect hook to trigger initial data fetching when the component mounts
  // and whenever the fetchProducts callback itself changes.
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // useEffect(() => {
  //   fetchMetrics();
  // }, [availableCategories])

  return (
    <div className="app">
      {/* Search component for filtering */}
      <SearchComponent
        onFilterChange={handleFilterChange}
        availableCategories={availableCategories}
      />
      {/* Data table for displaying products */}
      <DataTable
        products={products}
        totalRowCount={totalRowCount}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        onMarkInStock={markInStock}
        onMarkOutOfStock={markOutOfStock}
        handleEditButtonClick={handleEditButtonClick} // Pass the edit handler to DataTable
        handleDeleteButtonClick={handleDeleteButtonClick} // Pass the delete handler to DataTable
      />

      {/* Product Edit Modal component */}
      <ProductEditModal
        isOpen={isEditModalOpen} // Controls modal visibility
        onClose={handleCloseEditModal} // Callback for closing the modal
        product={editingProduct} // The product data to display/edit in the modal
        onSave={handleSaveEditedProduct} // Callback for saving changes from the modal
      />

      <MetricsTable
        metrics={metrics}
      />
    </div>
  );
}

export default App;
