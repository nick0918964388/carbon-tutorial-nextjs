'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Button,
  TreeView,
  TreeNode,
  Tag,
  Grid,
  Column,
} from '@carbon/react';
import { Add } from '@carbon/icons-react';

const RepoTable = ({ headers, initialRows, title, description }) => {
  const [rows, setRows] = useState(initialRows);
  const [filterText, setFilterText] = useState('');

  const handleFilter = useCallback(
    (text) => {
      setFilterText(text);
      const filteredRows = initialRows.filter((row) =>
        Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(text.toLowerCase())
        )
      );
      console.log('RepoTable',filteredRows);
      setRows(filteredRows);
    },
    [initialRows]
  );

  const handleAddRow = useCallback(() => {
    // 實現添加新行的邏輯
    console.log('添加新行');
  }, []);

  const statistics = useMemo(() => {
    const readingStats = {
      '0-50': 0,
      '51-100': 0,
      '100+': 0
    };

    rows.forEach(row => {
      const reading = parseFloat(row.reading);
      if (reading <= 50) readingStats['0-50']++;
      else if (reading <= 100) readingStats['51-100']++;
      else readingStats['100+']++;
    });

    return { readingStats };
  }, [rows]);

  const renderLeftSideTree = () => (
    <div style={{
      width: '256px',
      marginRight: '1rem',
      padding: '1rem',
      backgroundColor: '#f4f4f4',
      borderRight: '1px solid #e0e0e0'
    }}>
      <TreeView label="" active expanded>
        <TreeNode label="讀數統計" expanded>
          {Object.entries(statistics.readingStats).map(([range, count]) => (
            <TreeNode
              key={`reading-${range}`}
              label={
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{range}</span>
                  <Tag type="blue">{count}</Tag>
                </div>
              }
            />
          ))}
        </TreeNode>
      </TreeView>
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      <Grid>
        <Column lg={4} md={2} sm={2}>
          {renderLeftSideTree()}
        </Column>
        <Column lg={12} md={8} sm={4}>
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
                    <TableToolbarSearch onChange={onInputChange} placeholder="搜尋所有欄位" />
                    <Button renderIcon={Add} onClick={handleAddRow}>
                      添加新行
                    </Button>
                  </TableToolbarContent>
                </TableToolbar>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader key={header.key} {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id} {...getRowProps({ row })}>
                        {headers.map((header) => (
                          <TableCell key={header.key}>
                            {header.key === 'readingdate' 
                              ? new Date(row[header.key]).toLocaleDateString('zh-TW')
                              : row[header.key]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          />
        </Column>
      </Grid>
    </div>
  );
};

export default RepoTable;
