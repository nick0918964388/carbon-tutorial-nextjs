'use client';

import React from 'react';
import { Button, Grid, Column, Tabs, Tab, TabList, TabPanels, TabPanel, TreeView, TreeNode, TextInput, DatePicker, DatePickerInput } from '@carbon/react';
import { useState } from 'react';
import './newPage.scss';


export default function NewPage() {
  const [selectedNode, setSelectedNode] = useState({ id: '', description: '' });

  const handleSelectNode = (nodeId, nodeDescription) => {
    setSelectedNode({ id: nodeId, description: nodeDescription });
  };

  return (
    <Grid className="new-page">
      <Column lg={16} md={8} sm={4} className="landing-page__banner">
        <h1 className="new-page__heading">管理系統</h1>
        <Tabs>
          <TabList aria-label="管理選項">
            <Tab>位置管理</Tab>
            <Tab>設備管理</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid>
                <Column lg={8} md={4} sm={2}>
                  <TreeView label="位置架構" active="tsmc">
                    <TreeNode id="tsmc" label="tsmc (台積電)" onClick={() => handleSelectNode('tsmc', '台積電')}>
                      <TreeNode id="F12P1" label="F12P1" onClick={() => handleSelectNode('F12P1', 'F12P1')}>
                        <TreeNode id="IE" label="IE" onClick={() => handleSelectNode('IE', 'IE')} />
                      </TreeNode>
                      <TreeNode id="F12P2" label="F12P2" onClick={() => handleSelectNode('F12P2', 'F12P2')}>
                        <TreeNode id="WE" label="WE" onClick={() => handleSelectNode('WE', 'WE')} />
                      </TreeNode>
                      <TreeNode id="F12P34" label="F12P34" onClick={() => handleSelectNode('F12P34', 'F12P34')} />
                    </TreeNode>
                  </TreeView>
                </Column>
                <Column lg={8} md={4} sm={2}>
                  <form>
                    <TextInput
                      id="location-id"
                      labelText="ID:"
                      value={selectedNode.id}
                      readOnly
                      value={selectedNode.description}
                      readOnly
                    />
                    <TextInput
                      id="location-description"
                      labelText="Description:"
                    />
                    <TextInput
                      id="location-modifier"
                      labelText="修改人:"
                    />
                    <DatePicker dateFormat="m/d/Y" datePickerType="single">
                      <DatePickerInput
                        id="location-date"
                        labelText="修改日期:"
                      />
                    </DatePicker>
                    <TextInput
                      id="location-parent"
                      labelText="上層位置:"
                    />
                    <Button>修改</Button>
                  </form>
                </Column>
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid>
                <Column lg={8} md={4} sm={2}>
                  <TreeView label="設備架構">
                    {/* Add tree nodes here */}
                  </TreeView>
                </Column>
                <Column lg={8} md={4} sm={2}>
                  <form>
                    <TextInput
                      id="equipment-id"
                      labelText="ID:"
                      value="456"
                      readOnly
                    />
                    <TextInput
                      id="equipment-description"
                      labelText="Description:"
                    />
                    <TextInput
                      id="equipment-modifier"
                      labelText="修改人:"
                    />
                    <DatePicker dateFormat="m/d/Y" datePickerType="single">
                      <DatePickerInput
                        id="equipment-date"
                        labelText="修改日期:"
                      />
                    </DatePicker>
                    <TextInput
                      id="equipment-parent"
                      labelText="上層設備:"
                    />
                    <Button>修改</Button>
                  </form>
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
}
