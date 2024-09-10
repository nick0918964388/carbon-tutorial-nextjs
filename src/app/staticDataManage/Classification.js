import React, { useState, useEffect } from 'react';
import RepoTable from '../repos/RepoTable';
import { DataTableSkeleton, Grid, Column } from '@carbon/react';

const headers = [
  { key: 'metername', header: '儀表名稱' },
  { key: 'assetnum', header: '資產編號' },
  { key: 'reading', header: '讀數' },
  { key: 'readingdate', header: '讀數日期' },
  { key: 'unit', header: '單位' },
];

// 生成模擬數據的函數
const generateMockData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `id-${index + 1}`,
    metername: `emission-05000${index + 1}`,
    assetnum: `asset-00${index + 1}`,
    reading: Math.floor(Math.random() * 200),
    readingdate: new Date(new Date().getFullYear(), new Date().getMonth(), index + 1).toISOString(),
    unit: 'ton',
  }));
};

const Classification = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // 模擬 API 調用的延遲
    setTimeout(() => {
      try {
        const mockData = generateMockData(10);
        console.log(mockData);
        setRows(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error generating mock data:', error);
        setError('Error generating mock data');
        setLoading(false);
      }
    }, 1000); // 1秒的模擬延遲
  }, []);

  if (loading) {
    return (
      <Grid className="repo-page">
        <Column lg={16} md={8} sm={4} className="repo-page__r1">
          <DataTableSkeleton
            columnCount={headers.length}
            rowCount={10}
            headers={headers}
          />
        </Column>
      </Grid>
    );
  }

  if (error) {
    return `Error! ${error}`;
  }

  return (
    <Grid className="repo-page">
      <Column lg={16} md={8} sm={4} className="repo-page__r1">
        <RepoTable 
          headers={headers} 
          initialRows={rows} 
          title="分類管理" 
          description="管理系統中的各種分類" 
        />
      </Column>
    </Grid>
  );
}

export default Classification;