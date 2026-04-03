import * as React from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DataTable({
  rows,
  loading,
  onEdit,
  onDelete,
}: {
  rows: any[];
  loading?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}) {
  const gridRows: GridRowsProp = rows.map((r) => ({ id: r.id, ...r }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 120 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'severity', headerName: 'Severity', width: 140 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => onEdit && onEdit(params.row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => onDelete && onDelete(params.row)}
        />,
      ],
    },
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid rows={gridRows} columns={columns} loading={loading} pageSizeOptions={[10, 20, 50]} />
    </div>
  );
}
