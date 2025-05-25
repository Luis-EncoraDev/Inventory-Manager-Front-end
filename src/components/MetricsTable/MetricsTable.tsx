import React from "react"
import "./MetricsTable.css"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"

interface MetricsTableProps {
    metrics: Object[],

}

const MetricsTable: React.FC<MetricsTableProps> = ({ metrics }) => {

    const columns: GridColDef[] = [
        { field: "category", headerName: "Categories", sortable: false, width: 200, headerAlign: 'center', align: 'center' },
        { field: "totalStock", headerName: "Total products in stock", sortable: false, width: 200, headerAlign: 'center', align: 'center' },
        { field: "totalValue", headerName: "Total value in stock", sortable: false, width: 200, headerAlign: 'center', align: 'center' },
        { field: "averageValue", headerName: "Average price in stock", sortable: false, width: 200, headerAlign: 'center', align: 'center' },
    ]

    return(
        <DataGrid 
        columns={columns}
        rows={metrics}
        sx={{width: '45%', marginBottom: 50}}
        hideFooter
        />
    )
}

export default MetricsTable;