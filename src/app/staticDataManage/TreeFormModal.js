import React, { useState, useEffect } from 'react';
import {
  Button,
  TreeView,
  TreeNode,
  TextInput,
  DatePicker,
  DatePickerInput,
  Dropdown,
  Modal,
  Tag,
  Grid,
  Column,
} from '@carbon/react';
import { ChevronDown, ChevronUp } from '@carbon/icons-react';

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

const TreeFormModal = ({
  nodes,
  setNodes,
  isEquipment,
  modalHeading,
  getParentOptions,
  handleAddNode,
  handleModifyNode,
}) => {
  const [selectedNode, setSelectedNode] = useState({
    id: '',
    description: '',
    label: '',
  });
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [parentNode, setParentNode] = useState('');
  const [newNode, setNewNode] = useState({
    id: '',
    description: '',
    parent: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allExpanded, setAllExpanded] = useState(true);

  useEffect(() => {
    setExpandedNodes(nodes.map((node) => node.id));
  }, [nodes]);

  const handleSelectNode = (nodeId, nodeDescription) => {
    const node = nodes.find((n) => n.id === nodeId);
    setSelectedNode({
      id: nodeId,
      description: nodeDescription,
      label: node.label,
    });
    setParentNode(node ? node.parent : '');
    setExpandedNodes((prevExpandedNodes) => {
      if (!prevExpandedNodes.includes(nodeId)) {
        return [...prevExpandedNodes, nodeId];
      }
      return prevExpandedNodes;
    });
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
    <>
      <Grid>
        <Column lg={4} md={2} sm={2}>
          <Button
            renderIcon={allExpanded ? ChevronUp : ChevronDown}
            onClick={toggleExpandAll}
            hasIconOnly
            iconDescription={allExpanded ? '全部收起' : '全部展開'}
            kind="ghost"
            size="small"
          />
          <TreeView
            label={isEquipment ? '設備架構' : '位置架構'}
            active={nodes[0]?.id}
          >
            {renderTreeNodes(nodes)}
          </TreeView>
        </Column>
        <Column lg={8} md={3} sm={2}>
          <form>
            <header className="location-content-header">
              {isEquipment ? '設備內容' : '位置內容'}
            </header>
            <TextInput
              id={isEquipment ? 'equipment-label' : 'location-label'}
              labelText={isEquipment ? '設備:' : '位置:'}
              value={selectedNode.label}
              readOnly
            />
            <TextInput
              id={
                isEquipment ? 'equipment-description' : 'location-description'
              }
              labelText="描述:"
              value={selectedNode.description}
              readOnly
            />
            <TextInput
              id={isEquipment ? 'equipment-modifier' : 'location-modifier'}
              labelText="修改人:"
            />
            <DatePicker dateFormat="m/d/Y" datePickerType="single">
              <DatePickerInput
                id={isEquipment ? 'equipment-date' : 'location-date'}
                labelText="修改日期:"
              />
            </DatePicker>
            <Dropdown
              id={isEquipment ? 'equipment-parent' : 'location-parent'}
              titleText={isEquipment ? '上層設備:' : '上層位置:'}
              label={isEquipment ? '選擇上層設備' : '選擇上層位置'}
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
              <Button
                onClick={() => handleModifyNode(selectedNode, parentNode)}
              >
                修改
              </Button>
              <Button onClick={() => setIsModalOpen(true)}>新增</Button>
            </div>
          </form>
        </Column>
      </Grid>

      <Modal
        open={isModalOpen}
        modalHeading={modalHeading}
        primaryButtonText="確認"
        secondaryButtonText="取消"
        onRequestClose={() => setIsModalOpen(false)}
        onRequestSubmit={() =>
          handleAddNode(newNode, setNewNode, setIsModalOpen)
        }
      >
        <TextInput
          id={
            isEquipment
              ? 'modal-new-equipment-node-id'
              : 'modal-new-location-node-id'
          }
          labelText={isEquipment ? '新設備 ID:' : '新位置 ID:'}
          value={newNode.id}
          onChange={(e) => {
            const newId = e.target.value;
            setNewNode({
              ...newNode,
              id: newId,
            });
          }}
        />
        <TextInput
          id={
            isEquipment
              ? 'modal-new-equipment-node-label'
              : 'modal-new-location-node-label'
          }
          labelText={isEquipment ? '新設備 Label:' : '新位置 Label:'}
          value={newNode.label}
          onChange={(e) =>
            setNewNode({
              ...newNode,
              label: e.target.value,
            })
          }
        />
        <TextInput
          id={
            isEquipment
              ? 'modal-new-equipment-node-description'
              : 'modal-new-location-node-description'
          }
          labelText={isEquipment ? '新設備描述:' : '新位置描述:'}
          value={newNode.description}
          onChange={(e) =>
            setNewNode({
              ...newNode,
              description: e.target.value,
            })
          }
        />
        <Dropdown
          id={
            isEquipment
              ? 'modal-new-equipment-node-parent'
              : 'modal-new-location-node-parent'
          }
          titleText={isEquipment ? '上層設備:' : '上層位置:'}
          label={isEquipment ? '選擇上層設備' : '選擇上層位置'}
          items={getParentOptions()}
          selectedItem={
            newNode.parent
              ? nodes.find((node) => node.id === newNode.parent)?.label
              : ''
          }
          onChange={({ selectedItem }) => {
            const selectedNode = nodes.find(
              (node) => node.label === selectedItem.split(' / ').pop()
            );
            setNewNode({
              ...newNode,
              parent: selectedNode ? selectedNode.id : '',
            });
          }}
        />
      </Modal>
    </>
  );
};

export default TreeFormModal;
