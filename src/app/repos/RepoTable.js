'use client';

import React, { useState, useCallback } from 'react';
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableExpandHeader,
  TableHeader,
  TableBody,
  TableExpandRow,
  TableCell,
  TableExpandedRow,
  Grid,
  Column,
  TextInput,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  TableToolbarAction,
  Button,
} from '@carbon/react';
import { Add } from '@carbon/icons-react';

const RepoTable = ({ initialRows = [], headers, title, description }) => {
  const [rows, setRows] = useState(initialRows);
  const [filterText, setFilterText] = useState('');

  const handleSort = useCallback(
    (headerKey, direction) => {
      const sortedRows = [...rows].sort((a, b) => {
        if (a[headerKey] < b[headerKey]) return direction === 'ASC' ? -1 : 1;
        if (a[headerKey] > b[headerKey]) return direction === 'ASC' ? 1 : -1;
        return 0;
      });
      setRows(sortedRows);
    },
    [rows]
  );

  const handleFilter = useCallback(
    (text) => {
      setFilterText(text);
      const filteredRows = initialRows.filter((row) =>
        Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(text.toLowerCase())
        )
      );
      setRows(filteredRows);
    },
    [initialRows]
  );

  const handleAddRow = useCallback(() => {
    const newRow = {
      id: `${rows.length + 1}`,
      name: `新儲存庫 ${rows.length + 1}`,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
      issueCount: '0',
      stars: '0',
      description: '',
    };
    setRows((prevRows) => [...prevRows, newRow]);
  }, [rows]);

  const renderForm = (rowId) => {
    const row = rows.find(({ id }) => id === rowId);
    if (!row) return null;
    return (
      <Grid>
        <Column lg={5} md={4} sm={4}>
          <TextInput
            id={`name-${rowId}`}
            labelText="名稱"
            value={row.name}
            readOnly
          />
          <TextInput
            id={`created-${rowId}`}
            labelText="創建時間"
            value={row.createdAt}
            readOnly
          />
        </Column>
        <Column lg={5} md={4} sm={4}>
          <TextInput
            id={`updated-${rowId}`}
            labelText="更新時間"
            value={row.updatedAt}
            readOnly
          />
          <TextInput
            id={`issues-${rowId}`}
            labelText="開放問題"
            value={row.issueCount}
            onChange={(e) => {
              setRows((prevRows) =>
                prevRows.map((r) =>
                  r.id === rowId ? { ...r, issueCount: e.target.value } : r
                )
              );
            }}
          />
        </Column>
        <Column lg={6} md={4} sm={4}>
          <TextInput
            id={`stars-${rowId}`}
            labelText="星數"
            value={row.stars}
            readOnly
          />
          <TextInput
            id={`description-${rowId}`}
            labelText="描述"
            value={row.description || ''}
            onChange={(e) => {
              setRows((prevRows) =>
                prevRows.map((r) =>
                  r.id === rowId ? { ...r, description: e.target.value } : r
                )
              );
            }}
          />
        </Column>
      </Grid>
    );
  };

  return (
    <DataTable
      rows={rows}
      headers={headers}
      render={({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
        onInputChange,
      }) => (
        <TableContainer title={title} description={description}>
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch onChange={onInputChange} />
              <TableToolbarMenu>
                <TableToolbarAction onClick={() => handleSort('name', 'ASC')}>
                  按名稱排序（升序）
                </TableToolbarAction>
                <TableToolbarAction onClick={() => handleSort('name', 'DESC')}>
                  按名稱排序（降序）
                </TableToolbarAction>
              </TableToolbarMenu>
              <Button renderIcon={Add} onClick={handleAddRow}>
                添加新行
              </Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                <TableExpandHeader />
                {headers.map((header) => (
                  <TableHeader key={header.key} {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableExpandRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableExpandRow>
                  <TableExpandedRow colSpan={headers.length + 1}>
                    {renderForm(row.id)}
                  </TableExpandedRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    />
  );
};

export default RepoTable;
