'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Column,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  TreeView,
  TreeNode,
  TextInput,
  DatePicker,
  DatePickerInput,
  Dropdown,
  Modal,
  Tag,
} from '@carbon/react';
import { ChevronDown, ChevronUp } from '@carbon/icons-react';
import './newPage.scss';

const getTagProps = (level) => {
  switch (level) {
    case 0:
      return { type: 'blue', label: '組織' };
    case 1:
      return { type: 'green', label: '廠區' };
    case 2:
      return { type: 'teal', label: '部門' };
    case 3:
      return { type: 'purple', label: '系統' };
    case 4:
      return { type: 'red', label: '子系統' };
    default:
      return { type: 'gray', label: '未知' };
  }
};

export default function NewPage() {
  const [selectedNode, setSelectedNode] = useState({ id: '', description: '' });
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [parentNode, setParentNode] = useState('');
  const [newNode, setNewNode] = useState({
    id: '',
    description: '',
    parent: '',
  });
  const [nodes, setNodes] = useState([
    { id: 'tsmc', description: '台積電', label: 'tsmc (台積電)', parent: null },
    { id: 'F12P1', description: 'F12P1', label: 'F12P1', parent: 'tsmc' },
    { id: 'IE', description: 'IE', label: 'IE', parent: 'F12P1' },
    { id: 'F12P2', description: 'F12P2', label: 'F12P2', parent: 'tsmc' },
    { id: 'WE', description: 'WE', label: 'WE', parent: 'F12P2' },
    { id: 'F12P34', description: 'F12P34', label: 'F12P34', parent: 'tsmc' },
    {
      id: 'SUBSYSTEM1',
      description: 'SUBSYSTEM1',
      label: 'SUBSYSTEM1',
      parent: 'IE',
    },
    {
      id: 'SUBSYSTEM2',
      description: 'SUBSYSTEM2',
      label: 'SUBSYSTEM2',
      parent: 'IE',
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allExpanded, setAllExpanded] = useState(true);

  useEffect(() => {
    setExpandedNodes(nodes.map((node) => node.id));
  }, [nodes]);

  const handleSelectNode = (nodeId, nodeDescription) => {
    const node = nodes.find((n) => n.id === nodeId);
    setSelectedNode({ id: nodeId, description: nodeDescription });
    setParentNode(node ? node.parent : '');
    setExpandedNodes((prevExpandedNodes) => {
      if (!prevExpandedNodes.includes(nodeId)) {
        return [...prevExpandedNodes, nodeId];
      }
      return prevExpandedNodes;
    });
  };

  const getParentOptions = (nodeId) => {
    switch (nodeId) {
      case 'IE':
      case 'WE':
        return ['F12P1', 'F12P2', 'tsmc'];
      case 'F12P1':
      case 'F12P2':
      case 'F12P34':
        return ['tsmc'];
      default:
        return [];
    }
  };

  const handleModify = () => {
    if (selectedNode.id && parentNode) {
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) =>
          node.id === selectedNode.id ? { ...node, parent: parentNode } : node
        );

        return updatedNodes;
      });

      // Rebuild the tree structure and expand the necessary nodes
      setExpandedNodes((prevExpandedNodes) => {
        const newExpandedNodes = new Set(prevExpandedNodes);
        newExpandedNodes.add(parentNode);
        newExpandedNodes.add(selectedNode.id);
        return Array.from(newExpandedNodes);
      });

      setSelectedNode({ id: '', description: '' });
      setParentNode('');
    }
  };

  const handleAddNode = () => {
    if (newNode.id && newNode.description && newNode.parent) {
      setNodes((prevNodes) => [
        ...prevNodes,
        { ...newNode, label: `${newNode.id} (${newNode.description})` },
      ]);
      setNewNode({ id: '', description: '', parent: '' });
      setIsModalOpen(false);
    }
  };

  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpandedNodes([]);
    } else {
      setExpandedNodes(nodes.map((node) => node.id));
    }
    setAllExpanded(!allExpanded);
  };

  const renderTreeNodes = (nodes, parentId = null, level = 0) => {
    return nodes
      .filter((node) => node.parent === parentId)
      .map((node) => {
        const tagProps = getTagProps(level);
        return (
          <TreeNode
            key={node.id}
            id={node.id}
            label={
              <div>
                {node.label} <Tag type={tagProps.type}>{tagProps.label}</Tag>
              </div>
            }
            onClick={() => handleSelectNode(node.id, node.description)}
            isExpanded={expandedNodes.includes(node.id)}
          >
            {renderTreeNodes(nodes, node.id, level + 1)}
          </TreeNode>
        );
      });
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
                  <Column lg={2} md={1} sm={1}>
                    <Button
                      renderIcon={allExpanded ? ChevronUp : ChevronDown}
                      onClick={toggleExpandAll}
                      hasIconOnly
                      iconDescription={allExpanded ? '全部收起' : '全部展開'}
                      kind="ghost"
                      size="small"
                    />
                  </Column>
                  <Column lg={6} md={3} sm={1}>
                    <TreeView label="位置架構" active="tsmc">
                      {renderTreeNodes(nodes)}
                    </TreeView>
                  </Column>
                </Column>
                <Column lg={8} md={4} sm={2}>
                  <form>
                    <TextInput
                      id="location-id"
                      labelText="ID:"
                      value={selectedNode.id}
                      readOnly
                    />
                    <TextInput
                      id="location-description"
                      labelText="Description:"
                      value={selectedNode.description}
                      readOnly
                    />
                    <TextInput id="location-modifier" labelText="修改人:" />
                    <DatePicker dateFormat="m/d/Y" datePickerType="single">
                      <DatePickerInput
                        id="location-date"
                        labelText="修改日期:"
                      />
                    </DatePicker>
                    <Dropdown
                      id="location-parent"
                      titleText="上層位置:"
                      label="選擇上層位置"
                      items={getParentOptions(selectedNode.id)}
                      selectedItem={parentNode}
                      onChange={({ selectedItem }) =>
                        setParentNode(selectedItem)
                      }
                    />
                    <div className="button-group">
                      <Button onClick={handleModify}>修改</Button>
                      <Button onClick={() => setIsModalOpen(true)}>新增</Button>
                    </div>
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
                    <TextInput id="equipment-modifier" labelText="修改人:" />
                    <DatePicker dateFormat="m/d/Y" datePickerType="single">
                      <DatePickerInput
                        id="equipment-date"
                        labelText="修改日期:"
                      />
                    </DatePicker>
                    <TextInput id="equipment-parent" labelText="上層設備:" />
                    <Button>修改</Button>
                  </form>
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>

      <Modal
        open={isModalOpen}
        modalHeading="新增節點"
        primaryButtonText="確認"
        secondaryButtonText="取消"
        onRequestClose={() => setIsModalOpen(false)}
        onRequestSubmit={handleAddNode}
      >
        <TextInput
          id="modal-new-node-id"
          labelText="新節點 ID:"
          value={newNode.id}
          onChange={(e) => setNewNode({ ...newNode, id: e.target.value })}
        />
        <TextInput
          id="modal-new-node-description"
          labelText="新節點描述:"
          value={newNode.description}
          onChange={(e) =>
            setNewNode({ ...newNode, description: e.target.value })
          }
        />
        <Dropdown
          id="modal-new-node-parent"
          titleText="上層位置:"
          label="選擇上層位置"
          items={nodes.map((node) => node.id)}
          selectedItem={newNode.parent}
          onChange={({ selectedItem }) =>
            setNewNode({ ...newNode, parent: selectedItem })
          }
        />
      </Modal>
    </Grid>
  );
}
