import React, { useCallback } from 'react';
import "../DataTable/DataTable.css";
import { DataGrid, type GridColDef, type GridRenderCellParams, type GridPaginationModel, type GridRowId } from '@mui/x-data-grid';
import { Box, Checkbox } from '@mui/material';

interface DataTableProps {
  products: Product[];
  totalRowCount: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: React.Dispatch<React.SetStateAction<GridPaginationModel>>;
  onMarkOutOfStock: (id: number) => Promise<void>;
  onMarkInStock: (id: number) => Promise<void>;
  handleEditButtonClick: (id: GridRowId) => Promise<void>; // Added edit handler prop
  handleDeleteButtonClick: (id: GridRowId) => Promise<void>; // Added delete handler prop
}

interface Product {
  id?: number;
  name: string;
  category: string;
  unitPrice: number;
  expirationDate?: Date;
  stockQuantity: number;
  creationDate: Date;
  updateDate: Date;
}

const DataTable: React.FC<DataTableProps> = ({
  products,
  totalRowCount,
  paginationModel,
  setPaginationModel,
  onMarkOutOfStock,
  onMarkInStock,
  handleEditButtonClick, // Destructure new prop
  handleDeleteButtonClick // Destructure new prop
}) => {

  const getRowClassName = (params: any) => {
    const expirationDate = new Date(params.row.expirationDate);
    const today = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const twoWeeks = 2 * oneWeek;

    let classes = '';

    if (!params.row.expirationDate) {
      // No expiration date specific class
    } else if (expirationDate.getTime() - today.getTime() < oneWeek) {
      classes += 'expired-soon';
    } else if (expirationDate.getTime() - today.getTime() < twoWeeks) {
      classes += 'expires-within-two-weeks';
    } else {
      classes += 'expires-later';
    }

    // Add strike-through class if stockQuantity is 0
    if (params.row.stockQuantity === 0) {
      classes += ' out-of-stock-strike';
    }

    return classes.trim();
  };

  const handleCheck = useCallback((id: number | undefined) => products.some(product => product.id === id && product.stockQuantity === 0), [products]);

  const columns: GridColDef[] = [
    {
      field: 'checkbox',
      headerName: '',
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Checkbox
          onChange={(event) => {
            if (event.target.checked) {
              onMarkOutOfStock(Number(params.row.id));
            } else {
              onMarkInStock(Number(params.row.id));
            }
          }}
          checked={handleCheck(params.row.id)}
        />
      ),
      headerAlign: 'center',
      align: 'center',
    },
    { field: 'name', headerName: 'Name', width: 250, headerAlign: 'center', align: 'center'},
    { field: 'category', headerName: 'Category', width: 130, headerAlign: 'center', align: 'center' },
    { field: 'unitPrice', headerName: 'Unit price', width: 130, headerAlign: 'center', align: 'center' },
    {
      field: 'stockQuantity',
      headerName: 'Stock',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        let color = '';
        if (params.value < 5) {
          color = "#f44336";
        } else if (params.value >= 5 && params.value <= 10) {
          color = "#ff9800";
        }
        return <Box sx={{ background: color, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>{params.value}</Box>;
      },
    },
    { field: 'expirationDate', headerName: 'Expiration date', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'Actions', width: 180, sortable: false, renderCell: (params) => (
      <div>
        {/* Call handleEditButtonClick with the row's ID */}
        <button className='editButton' onClick={() => handleEditButtonClick(params.id)}>Edit</button>
        {/* Call handleDeleteButtonClick with the row's ID */}
        <button className='deleteButton' onClick={() => handleDeleteButtonClick(params.id)}>Delete</button>
      </div>
    ), headerAlign: 'center', align: 'center'}
  ];

  return (
    <Box sx={{height: 'auto', width: '55 %'}}> {/* Adjusted width for better layout */}
      <DataGrid
        rows={products}
        columns={columns}
        rowCount={totalRowCount}
        pageSizeOptions={[5, 10, 20, 50]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        getRowClassName={getRowClassName}
      />
    </Box>
  );
}

export default DataTable;