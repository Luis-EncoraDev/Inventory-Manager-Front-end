import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { type Product } from '../../App'; // Assuming Product interface is also in App.tsx or a shared types file
import './EditProductModal.css'; // Import the new CSS file

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null; // The product data to edit
  onSave: (updatedProduct: Product) => void; // Callback to save changes
}

// The 'style' object is no longer needed as styles are moved to CSS
// const style = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
//   borderRadius: '8px',
//   fontFamily: 'Inter, sans-serif',
// };

const EditProductModal: React.FC<ProductEditModalProps> = ({ isOpen, onClose, product, onSave }) => {
  // Local state for form fields, initialized from the 'product' prop
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);

  // Effect to update local state when the 'product' prop changes (i.e., a new product is selected for editing)
  useEffect(() => {
    if (product) {
      // Create a deep copy to avoid direct mutation of the prop
      setEditedProduct({ ...product });
    } else {
      setEditedProduct(null);
    }
  }, [product]);

  // Handle input changes for text fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProduct(prev => {
      if (!prev) return null;
      // Handle numeric fields
      if (name === 'unitPrice' || name === 'stockQuantity') {
        const numValue = parseFloat(value);
        return { ...prev, [name]: isNaN(numValue) ? '' : numValue }; // Allow empty string for partial input
      }
      return { ...prev, [name]: value };
    });
  };

  // Handle select changes for category
  const handleSelectChange = (e: any) => { // Use 'any' for event type from Select for simplicity
    const { name, value } = e.target;
    setEditedProduct(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  // Handle date input change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProduct(prev => {
      if (!prev) return null;
      // Ensure date is stored as a string in YYYY-MM-DD format if needed by backend
      return { ...prev, [name]: value || undefined }; // Store undefined if empty
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedProduct) {
      // Basic validation before saving
      if (!editedProduct.name || !editedProduct.category || editedProduct.unitPrice === undefined || editedProduct.stockQuantity === undefined) {
        alert('Please fill in all required fields.');
        return;
      }
      if (editedProduct.unitPrice <= 0 || editedProduct.stockQuantity < 0) {
        alert('Unit price must be greater than 0 and stock quantity cannot be negative.');
        return;
      }
      onSave(editedProduct); // Call the onSave callback from parent
    }
  };

  if (!editedProduct) return null; // Don't render modal if no product is being edited

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {/* Apply the CSS class 'edit-modal-box' */}
      <Box className="edit-modal-box" component="form" onSubmit={handleSubmit}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Edit Product
        </Typography>
        <TextField
          margin="dense"
          name="name"
          label="Product Name"
          type="text"
          fullWidth
          variant="outlined"
          value={editedProduct.name}
          onChange={handleChange}
          required
          // Removed inline sx for border-radius, handled by CSS
          sx={{ mb: 2 }} // Keep mb for spacing
        />
        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            name="category"
            value={editedProduct.category}
            label="Category"
            onChange={handleSelectChange}
            required
            // Removed inline sx for border-radius, handled by CSS
          >
            {/* You might want to pass available categories as a prop to this modal */}
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Books">Books</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Home Goods">Home Goods</MenuItem>
            {/* Add more categories as needed */}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          name="unitPrice"
          label="Unit Price"
          type="number"
          fullWidth
          variant="outlined"
          value={editedProduct.unitPrice}
          onChange={handleChange}
          inputProps={{ step: "0.01" }} // Allow decimal input
          required
          sx={{ mb: 2 }} // Keep mb for spacing
        />
        <TextField
          margin="dense"
          name="stockQuantity"
          label="Stock Quantity"
          type="number"
          fullWidth
          variant="outlined"
          value={editedProduct.stockQuantity}
          onChange={handleChange}
          required
          sx={{ mb: 2 }} // Keep mb for spacing
        />
        <TextField
          margin="dense"
          name="expirationDate"
          label="Expiration Date"
          type="date"
          fullWidth
          variant="outlined"
          InputLabelProps={{ shrink: true }} // Keep label visible for date input
          value={editedProduct.expirationDate || ''} // Ensure it's empty string if undefined
          onChange={handleDateChange}
          sx={{ mb: 3 }} // Keep mb for spacing
        />
        {/* Apply the CSS class 'modal-buttons-container' */}
        <Box className="modal-buttons-container">
          <Button
            variant="outlined"
            onClick={onClose}
            className="modal-button-cancel" // Apply the CSS class for cancel button
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="modal-button-save" // Apply the CSS class for save button
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProductModal;
