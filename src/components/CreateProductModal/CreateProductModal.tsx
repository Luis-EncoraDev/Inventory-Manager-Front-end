import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { type Product } from '../../App';
import './CreateProductModal.css';

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
  categories: string[] | undefined
}

const CreateProductModal: React.FC<ProductCreateModalProps> = ({ isOpen, onClose, onSave, categories }) => {
    const [product, setProduct] = useState<Product>({
    name: '',
    category: '',
    unitPrice: 0,
    expirationDate: undefined,
    stockQuantity: 0,
    creationDate: new Date(),
    updateDate: new Date()
  });

  const [addCategoryClicked, setAddCategoryClicked] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => {
      if (name === 'unitPrice' || name === 'stockQuantity') {
        const numValue = parseFloat(value);
        return { ...prev, [name]: isNaN(numValue) ? undefined : numValue };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setProduct(prev => {
      return { ...prev, [name]: value };
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => {
      return { ...prev, [name]: value || undefined }; 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      if (!product.name || !product.category || product.unitPrice === undefined || product.stockQuantity === undefined) {
        alert('Please fill in all required fields.');
        return;
      }
      if (product.unitPrice <= 0 || product.stockQuantity < 0) {
        alert('Unit price must be greater than 0 and stock quantity cannot be negative.');
        return;
      }
      onSave(product);
    }
  };

  useEffect(() => {
    return(setAddCategoryClicked(false))
  }, [])

  return (
    <Modal
      open={isOpen}
      onClose={ () => {
        setAddCategoryClicked(false)
        onClose();
      }}
    >
      <Box className="create-modal-box" component="form" onSubmit={handleSubmit}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Create Product
        </Typography>
        <TextField
          margin="dense"
          name="name"
          label="Product Name"
          type="text"
          fullWidth
          variant="outlined"
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            name="category"
            label="Category"
            onChange={handleSelectChange}
            required={addCategoryClicked ? false : true}
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
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="expirationDate"
          label="Expiration date"
          type="date"
          fullWidth
          variant="outlined"
          onChange={handleDateChange}
          InputLabelProps={{shrink: true}}
          sx={{ mb: 3, textAlign: 'shrink' }}
        />
        <Box className="modal-buttons-container">
          <Button
            variant="outlined"
            onClick={() => {
              setAddCategoryClicked(false);
              onClose();
              }
            }
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

export default CreateProductModal;
