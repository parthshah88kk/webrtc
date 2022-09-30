import {Layout, Spinner} from '@ui-kitten/components';
import React from 'react';

function FullScreenLoader() {
  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Spinner size="giant" />
    </Layout>
  );
}

export default FullScreenLoader;
