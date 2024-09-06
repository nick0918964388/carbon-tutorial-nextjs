'use client';

import React from 'react';
import { Button, Grid, Column, Tabs, Tab, TabList, TabPanels, TabPanel, TreeView } from '@carbon/react';
import { useState } from 'react';
import './newPage.scss';


export default function NewPage() {
  return (
    <Grid className="new-page">
      <Column lg={16} md={8} sm={4} className="new-page__content">
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
                  <TreeView label="位置架構">
                    {/* Add tree nodes here */}
                  </TreeView>
                </Column>
                <Column lg={8} md={4} sm={2}>
                  <form>
                    <div>
                      <label>ID:</label>
                      <input type="text" value="123" readOnly />
                    </div>
                    <div>
                      <label>Description:</label>
                      <input type="text" />
                    </div>
                    <div>
                      <label>修改人:</label>
                      <input type="text" />
                    </div>
                    <div>
                      <label>修改日期:</label>
                      <input type="date" />
                    </div>
                    <div>
                      <label>上層位置:</label>
                      <input type="text" />
                    </div>
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
                    <div>
                      <label>ID:</label>
                      <input type="text" value="456" readOnly />
                    </div>
                    <div>
                      <label>Description:</label>
                      <input type="text" />
                    </div>
                    <div>
                      <label>修改人:</label>
                      <input type="text" />
                    </div>
                    <div>
                      <label>修改日期:</label>
                      <input type="date" />
                    </div>
                    <div>
                      <label>上層設備:</label>
                      <input type="text" />
                    </div>
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
