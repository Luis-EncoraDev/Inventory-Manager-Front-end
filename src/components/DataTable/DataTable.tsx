import React from 'react';
import "../DataTable/DataTable.css";
import { DataGrid, type GridColDef, type GridRenderCellParams, type GridPaginationModel } from '@mui/x-data-grid';
import { Box } from '@mui/material';

interface DataTableProps {
  products: Product[];
  totalRowCount: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: React.Dispatch<React.SetStateAction<GridPaginationModel>>;
}

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

const DataTable: React.FC<DataTableProps> = ({
  products,
  totalRowCount,
  paginationModel,
  setPaginationModel,
}) => {

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
        return <Box sx={{ background: color, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>{params.value}</Box>;
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
    <Box sx={{height: 'auto', width: '55%'}}>
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