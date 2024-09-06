'use client';

import React from 'react';
import { Button, Grid, Column } from '@carbon/react';
import './newPage.scss';
import { hello } from '../hello';

export default function NewPage() {
  return (
    <Grid className="new-page">
      <Column lg={16} md={8} sm={4} className="new-page__content">
        <h1>Welcome to the New Page</h1>
        <Button>Click Me</Button>
      </Column>
    </Grid>
  );
}
