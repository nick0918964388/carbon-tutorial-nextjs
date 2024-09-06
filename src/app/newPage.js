import React from 'react';
import { Button, Grid, Column } from 'carbon-components-react';

export default function NewPage() {
  return (
    <Grid>
      <Column lg={16} md={8} sm={4}>
        <h1>Welcome to the New Page</h1>
        <Button>Click Me</Button>
      </Column>
    </Grid>
  );
}
