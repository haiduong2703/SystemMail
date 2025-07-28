import React from 'react';
import { Container } from 'reactstrap';
import Header from 'components/Headers/Header.js';
import DecryptionDemo from 'components/DecryptionDemo.js';

const DecryptionTest = () => {
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <DecryptionDemo />
      </Container>
    </>
  );
};

export default DecryptionTest;
