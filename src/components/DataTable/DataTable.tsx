import React from 'react';
import "../DataTable/DataTable.css";
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { Paper, Box } from '@mui/material';

const rows = [
  {
    id: 1,
    name: "Organic Gala Apples",
    category: "Produce",
    unitPrice: 1.99,
    expirationDate: "2025-05-23",
    stockQuantity: 1,
  },
  {
    id: 2,
    name: "Whole Wheat Bread Loaf",
    category: "Bakery",
    unitPrice: 3.50,
    expirationDate: "2025-05-19",
    stockQuantity: 4,
  },
  {
    id: 3,
    name: "Cheddar Cheese Block",
    category: "Dairy & Cheese",
    unitPrice: 6.75,
    expirationDate: "2025-06-10",
    stockQuantity: 8,
  },
  {
    id: 4,
    name: "Ground Coffee (Medium Roast)",
    category: "Pantry",
    unitPrice: 8.99,
    expirationDate: "2026-01-15",
    stockQuantity: 20,
  },
  {
    id: 5,
    name: "Boneless Chicken Breast (1kg)",
    category: "Meat & Seafood",
    unitPrice: 12.50,
    expirationDate: "2025-05-18",
    stockQuantity: 100,
  },
  {
    id: 6,
    name: "Almond Milk (Unsweetened)",
    category: "Beverages",
    unitPrice: 4.25,
    expirationDate: "2025-06-01",
    stockQuantity: 250,
  },
  {
    id: 7,
    name: "Pasta (Spaghetti)",
    category: "Pantry",
    unitPrice: 1.79,
    expirationDate: "2026-03-20",
    stockQuantity: 16,
  },
  {
    id: 8,
    name: "Greek Yogurt (Plain)",
    category: "Dairy & Cheese",
    unitPrice: 3,
    expirationDate: "2025-05-25",
    stockQuantity: 180,
  },
  {
    id: 9,
    name: "Frozen Broccoli Florets",
    category: "Frozen Foods",
    unitPrice: 3.29,
    expirationDate: "2026-11-01",
    stockQuantity: 350,
  },
  {
    id: 10,
    name: "Olive Oil (Extra Virgin)",
    category: "Pantry",
    unitPrice: 15.99,
    expirationDate: "2027-04-05",
    stockQuantity: 10,
  }
];

const paginationModel = { page: 0, pageSize: 10 };

const DataTable = () => {
  const getRowClassName = (params: any) => {
    const expirationDate = new Date(params.row.expirationDate);
    const today = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const twoWeeks = 2 * oneWeek;

    if (!params.row.expirationDate) {
      return '';
    } else if (expirationDate.getTime() - today.getTime() < oneWeek) {
      return 'expired-soon';
    } else if (expirationDate.getTime() - today.getTime() < twoWeeks) {
      return 'expires-within-two-weeks';
    } else {
      return 'expires-later';
    }
  };

  const columns: GridColDef[] = [
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

        return <Box sx={{ background: color }}>{params.value}</Box>;
      },
    },
    { field: 'expirationDate', headerName: 'Expiration date', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'Actions', width: 180, sortable: false, renderCell: () => (
      <div>
        <button className='editButton'>Edit</button>
        <button className='deleteButton'>Delete</button>
      </div>
    ), headerAlign: 'center', align: 'center'}
  ];

  return (
    <Paper sx={{ height: 630, width: 1050}}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10]}
        sx={{ border: 0, width: '100%' }}
        getRowClassName={getRowClassName}
      />
    </Paper>
  );
}

export default DataTable;