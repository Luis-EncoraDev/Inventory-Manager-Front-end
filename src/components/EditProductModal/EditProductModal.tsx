import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { type Product } from '../../App';
import './EditProductModal.css';

interface ProductEditModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
  categories: string[] | undefined
}

const EditProductModal: React.FC<ProductEditModalProps> = ({ isOpen, product , onClose, onSave, categories }) => {
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [addCategoryClicked, setAddCategoryClicked] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setEditedProduct({ ...product });
    } else {
      setEditedProduct(null);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProduct(prev => {
      if (!prev) return null;
      if (name === 'unitPrice' || name === 'stockQuantity') {
        const numValue = parseFloat(value);
        return { ...prev, [name]: isNaN(numValue) ? '' : numValue };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setEditedProduct(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProduct(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value || undefined };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedProduct) {
      if (!editedProduct.name || !editedProduct.category || editedProduct.unitPrice === undefined || editedProduct.stockQuantity === undefined) {
        alert('Please fill in all required fields.');
        return;
      }
      if (editedProduct.unitPrice <= 0 || editedProduct.stockQuantity < 0) {
        alert('Unit price must be greater than 0 and stock quantity cannot be negative.');
        return;
      }
      onSave(editedProduct);
    }
  };

  if (!editedProduct) return null;

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        onClose();
        setAddCategoryClicked(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
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
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            name="category"
            value={editedProduct.category}
            label="Category"
            onChange={handleSelectChange}
            required={!addCategoryClicked ? true : false}
          >
            { categories?.map(category => <MenuItem value={category}>{category}</MenuItem>) }
          </Select>
          { !addCategoryClicked &&  
          <Button 
            variant='outlined'
            className='modal-button-addCategory'
            onClick={() => setAddCategoryClicked(true)}
            sx={{ mt: 2 }}
          >
            Add new category
          </Button>
          }

          {
          addCategoryClicked && 
          <TextField 
          name="category"
          label="Add new category"
          onChange={handleChange}
          required
          sx={{ mt: 2 }}
          />
          }
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
          required
          sx={{ mb: 2 }}
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
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="expirationDate"
          label="Expiration date"
          InputLabelProps={{shrink: true}}
          type="date"
          fullWidth
          variant="outlined"
          value={editedProduct.expirationDate || ''}
          onChange={handleDateChange}
          sx={{ mb: 3, textAlign: 'shrink' }}
        />
        <Box className="modal-buttons-container">
          <Button
            variant="outlined"
            onClick={() => {
              onClose();
              setAddCategoryClicked(false);
            }}
            className="modal-button-cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="modal-button-save"
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProductModal;
