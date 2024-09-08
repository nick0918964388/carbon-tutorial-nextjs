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
  ListBox,
  ListBoxField,
  ListBoxMenu,
  ListBoxMenuItem,
  Tag,
} from '@carbon/react';
import { ChevronDown, ChevronUp } from '@carbon/icons-react';
import './_newPage.scss';

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
  const [selectedNode, setSelectedNode] = useState({ id: '', description: '', label: '' });
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [parentNode, setParentNode] = useState('');
  const [newNode, setNewNode] = useState({
    id: '',
    description: '',
    parent: '',
  });
  const [nodes, setNodes] = useState([
    { id: '1', description: '台積電', label: 'tsmc (台積電)', parent: null },
    { id: '2', description: 'F12P1', label: 'F12P1', parent: '1' },
    { id: '3', description: 'IE', label: 'IE', parent: '2' },
    { id: '4', description: 'F12P2', label: 'F12P2', parent: '1' },
    { id: '5', description: 'WE', label: 'WE', parent: '4' },
    { id: '6', description: 'F12P34', label: 'F12P34', parent: '1' },
    { id: '7', description: 'SUBSYSTEM1', label: 'SUBSYSTEM1', parent: '3' },
    { id: '8', description: 'SUBSYSTEM2', label: 'SUBSYSTEM2', parent: '3' },
  ]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedEquipmentNode, setSelectedEquipmentNode] = useState({
    id: '',
    description: '',
  });
  const [expandedEquipmentNodes, setExpandedEquipmentNodes] = useState([]);
  const [parentEquipmentNode, setParentEquipmentNode] = useState('');
  const [newEquipmentNode, setNewEquipmentNode] = useState({
    id: '',
    description: '',
    parent: '',
  });
  const [equipmentNodes, setEquipmentNodes] = useState([
    { id: 'eq1', description: '設備1', label: 'eq1 (設備1)', parent: null },
    { id: 'eq2', description: '設備2', label: 'eq2 (設備2)', parent: 'eq1' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [allEquipmentExpanded, setAllEquipmentExpanded] = useState(true);
  const [allExpanded, setAllExpanded] = useState(true);

  useEffect(() => {
    setExpandedNodes(nodes.map((node) => node.id));
    setExpandedEquipmentNodes(equipmentNodes.map((node) => node.id));
    console.log(expandedEquipmentNodes);
    console.log(expandedNodes);
  }, [nodes, equipmentNodes]);

  const handleSelectNode = (nodeId, nodeDescription) => {
    const node = nodes.find((n) => n.id === nodeId);
    setSelectedNode({ id: nodeId, description: nodeDescription, label: node.label });
    setParentNode(node ? node.parent : '');
    setExpandedNodes((prevExpandedNodes) => {
      if (!prevExpandedNodes.includes(nodeId)) {
        return [...prevExpandedNodes, nodeId];
      }
      return prevExpandedNodes;
    });
  };

  const getParentOptions = (nodeId) => {
    const buildHierarchy = (node, nodes, prefix = '') => {
      const children = nodes.filter((n) => n.parent === node.id);
      const currentLabel = `${prefix}${node.label}`;
      return [
        currentLabel,
        ...children.flatMap((child) =>
          buildHierarchy(child, nodes, `${currentLabel} / `)
        ),
      ];
    };

    return nodes
      .filter((node) => node.parent === null)
      .flatMap((rootNode) => buildHierarchy(rootNode, nodes));
  };

  const handleModify = () => {
    if (selectedNode.id) {
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
      const newId = (nodes.length + 1).toString(); // Generate a new unique ID
      setNodes((prevNodes) => [
        ...prevNodes,
        { ...newNode, id: newId, label: `${newNode.id} (${newNode.description})` },
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

  const handleSelectEquipmentNode = (nodeId) => {
    const node = equipmentNodes.find((n) => n.id === nodeId);
    console.log(node);
    if (node) {
      setSelectedEquipmentNode({ id: node.id, description: node.description });
      setParentEquipmentNode(node.parent);
      setExpandedEquipmentNodes((prevExpandedNodes) => {
        if (!prevExpandedNodes.includes(nodeId)) {
          return [...prevExpandedNodes, nodeId];
        }
        return prevExpandedNodes;
      });
    }
  };

  const handleModifyEquipment = () => {
    if (selectedEquipmentNode.id && parentEquipmentNode) {
      setEquipmentNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) =>
          node.id === selectedEquipmentNode.id
            ? { ...node, parent: parentEquipmentNode }
            : node
        );

        return updatedNodes;
      });

      setExpandedEquipmentNodes((prevExpandedNodes) => {
        const newExpandedNodes = new Set(prevExpandedNodes);
        newExpandedNodes.add(parentEquipmentNode);
        newExpandedNodes.add(selectedEquipmentNode.id);
        return Array.from(newExpandedNodes);
      });

      setSelectedEquipmentNode({ id: '', description: '' });
      setParentEquipmentNode('');
    }
  };

  const handleAddEquipmentNode = () => {
    if (
      newEquipmentNode.id &&
      newEquipmentNode.description &&
      newEquipmentNode.parent
    ) {
      setEquipmentNodes((prevNodes) => [
        ...prevNodes,
        {
          ...newEquipmentNode,
          label: `${newEquipmentNode.id} (${newEquipmentNode.description})`,
        },
      ]);
      setNewEquipmentNode({ id: '', description: '', parent: '' });
      setIsModalOpen(false);
    }
  };

  const toggleExpandAllEquipment = () => {
    if (allEquipmentExpanded) {
      setExpandedEquipmentNodes([]);
    } else {
      setExpandedEquipmentNodes(equipmentNodes.map((node) => node.id));
    }
    setAllEquipmentExpanded(!allEquipmentExpanded);
  };

  const renderTreeNodes = (
    nodes,
    parentId = null,
    level = 0,
    isEquipment = false
  ) => {
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
            onClick={() => {
              if (isEquipment) {
                console.log(node.id);
                handleSelectEquipmentNode(node.id);
              } else {
                handleSelectNode(node.id, node.description);
              }
            }}
            isExpanded={
              isEquipment
                ? expandedEquipmentNodes.includes(node.id)
                : expandedNodes.includes(node.id)
            }
          >
            {renderTreeNodes(nodes, node.id, level + 1, isEquipment)}
          </TreeNode>
        );
      });
  };

  return (
    <Grid className="new-page">
      <Column lg={16} md={8} sm={4} className="landing-page__banner">
        <h1 className="new-page__heading">主檔管理</h1>

        <Tabs>
          <TabList aria-label="管理選項" className="tabs-group">
            <Tab>位置管理</Tab>
            <Tab>設備管理</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid>
                <Column lg={4} md={3} sm={2}>
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
                      {renderTreeNodes(nodes, null, 0, false)}
                    </TreeView>
                  </Column>
                </Column>
                <Column lg={4} md={5} sm={2}>
                  
                  <form>
                    {/* ID field is hidden */}
                    <header className="location-content-header">位置內容</header>
                    <TextInput
                      id="location-label"
                      labelText="位置:"
                      value={selectedNode.label}
                      readOnly
                    />
                    <TextInput
                      id="location-description"
                      labelText="描述:"
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
                      selectedItem={
                        parentNode
                          ? nodes.find((node) => node.id === parentNode)?.label
                          : ''
                      }
                      onChange={({ selectedItem }) => {
                        const selectedNode = nodes.find(
                          (node) => node.label === selectedItem.split(' / ').pop()
                        );
                        setParentNode(selectedNode ? selectedNode.id : '');
                      }}
                    />
                    <div className="button-group">
                      <Button onClick={handleModify}>修改</Button>
                      <Button onClick={() => { setIsAddingLocation(true); setIsModalOpen(true); }}>新增</Button>
                    </div>
                  </form>
                </Column>
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid>
                <Column lg={4} md={4} sm={2}>
                  <Column lg={2} md={1} sm={1}>
                    <Button
                      renderIcon={
                        allEquipmentExpanded ? ChevronUp : ChevronDown
                      }
                      onClick={toggleExpandAllEquipment}
                      hasIconOnly
                      iconDescription={
                        allEquipmentExpanded ? '全部收起' : '全部展開'
                      }
                      kind="ghost"
                      size="small"
                    />
                  </Column>
                  <Column lg={6} md={3} sm={1}>
                    <TreeView label="設備架構" active="eq1">
                      {renderTreeNodes(equipmentNodes, null, 0, true)}
                    </TreeView>
                  </Column>
                </Column>
                <Column lg={4} md={4} sm={2}>
                  <form>
                    <TextInput
                      id="equipment-id"
                      labelText="ID:"
                      value={selectedEquipmentNode.id}
                      readOnly
                    />
                    <TextInput
                      id="equipment-description"
                      labelText="Description:"
                      value={selectedEquipmentNode.description}
                      readOnly
                    />
                    <TextInput id="equipment-modifier" labelText="修改人:" />
                    <DatePicker dateFormat="m/d/Y" datePickerType="single">
                      <DatePickerInput
                        id="equipment-date"
                        labelText="修改日期:"
                      />
                    </DatePicker>
                    <Dropdown
                      id="equipment-parent"
                      titleText="上層設備:"
                      label="選擇上層設備"
                      items={equipmentNodes.map((node) => node.id)}
                      selectedItem={parentEquipmentNode}
                      onChange={({ selectedItem }) =>
                        setParentEquipmentNode(selectedItem)
                      }
                    />
                    <div className="button-group">
                      <Button onClick={handleModifyEquipment}>修改</Button>
                      <Button onClick={() => { setIsAddingLocation(false); setIsModalOpen(true); }}>新增</Button>
                    </div>
                  </form>
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>

      <Modal
        open={isModalOpen}
        modalHeading={isAddingLocation ? "新增位置" : "新增設備"}
        primaryButtonText="確認"
        secondaryButtonText="取消"
        onRequestClose={() => setIsModalOpen(false)}
        onRequestSubmit={isAddingLocation ? handleAddNode : handleAddEquipmentNode}
      >
        {isAddingLocation ? (
          <>
            <TextInput
              id="modal-new-location-node-id"
              labelText="新位置 ID:"
              value={newNode.id}
              onChange={(e) => {
                const newId = e.target.value;
                setNewNode({
                  ...newNode,
                  id: newId,
                  description: `Description for ${newId}`,
                });
              }}
            />
            <TextInput
              id="modal-new-location-node-description"
              labelText="新位置描述:"
              value={newNode.description}
              onChange={(e) =>
                setNewNode({
                  ...newNode,
                  description: e.target.value,
                })
              }
            />
            <Dropdown
              id="modal-new-location-node-parent"
              titleText="上層位置:"
              label="選擇上層位置"
              items={getParentOptions()}
              selectedItem={newNode.parent}
              onChange={({ selectedItem }) =>
                setNewNode({ ...newNode, parent: selectedItem.split(' / ').pop() })
              }
            />
          </>
        ) : (
          <>
            <TextInput
              id="modal-new-equipment-node-id"
              labelText="新設備 ID:"
              value={newEquipmentNode.id}
              onChange={(e) => {
                const newId = e.target.value;
                setNewEquipmentNode({
                  ...newEquipmentNode,
                  id: newId,
                  description: `Description for ${newId}`,
                });
              }}
            />
            <TextInput
              id="modal-new-equipment-node-description"
              labelText="新設備描述:"
              value={newEquipmentNode.description}
              onChange={(e) =>
                setNewEquipmentNode({
                  ...newEquipmentNode,
                  description: e.target.value,
                })
              }
            />
            <Dropdown
              id="modal-new-equipment-node-parent"
              titleText="上層設備:"
              label="選擇上層設備"
              items={equipmentNodes.map((node) => node.id)}
              selectedItem={newEquipmentNode.parent}
              onChange={({ selectedItem }) =>
                setNewEquipmentNode({ ...newEquipmentNode, parent: selectedItem })
              }
            />
          </>
        )}
      </Modal>
    </Grid>
  );
}
