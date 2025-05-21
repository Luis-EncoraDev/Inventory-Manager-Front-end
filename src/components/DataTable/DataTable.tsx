import React, { useState, useEffect } from 'react';
import "../DataTable/DataTable.css";
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { Paper, Box } from '@mui/material';
import axios from 'axios';

const paginationModel = { page: 0, pageSize: 10 };

const DataTable = () => {

  const [products, setProducts] = useState([]);

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

useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9090/api/products");
        setProducts(response.data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
      }
    };

    fetchProducts();
  }, []);

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
      <DataGrid
        rows={products}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10]}
        sx={{ border: 0, width: '55%' }}
        getRowClassName={getRowClassName}
        hideFooterPagination
      />
  );
}

export default DataTable;