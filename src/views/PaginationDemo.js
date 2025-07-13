import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Container,
  Row,
  Col,
  Table,
  Badge
} from "reactstrap";
import PaginationControls from "components/PaginationControls/PaginationControls.js";
import SimpleHeader from "components/Headers/SimpleHeader.js";

const PaginationDemo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Generate demo data with 500 items to test pagination
  const generateDemoData = () => {
    const data = [];
    for (let i = 1; i <= 500; i++) {
      data.push({
        id: i,
        title: `Demo Item ${i}`,
        description: `This is description for item number ${i}`,
        status: i % 3 === 0 ? 'completed' : i % 2 === 0 ? 'pending' : 'active',
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString()
      });
    }
    return data;
  };

  const demoData = generateDemoData();

  // Pagination calculations
  const totalPages = Math.ceil(demoData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = demoData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'active': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <>
      <SimpleHeader />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">
                      <i className="ni ni-collection text-info mr-2" />
                      Pagination Demo ({demoData.length} items)
                    </h3>
                    <p className="text-sm mb-0">
                      Testing smart pagination with {totalPages} pages
                    </p>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.id}>
                      <td className="text-sm font-weight-bold">
                        #{item.id}
                      </td>
                      <td className="text-sm">
                        {item.title}
                      </td>
                      <td className="text-sm text-muted">
                        {item.description}
                      </td>
                      <td>
                        <Badge color={getStatusColor(item.status)} pill>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="text-sm text-muted">
                        {item.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={demoData.length}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  showItemsPerPage={true}
                />
              </CardFooter>
            </Card>
          </div>
        </Row>

        {/* Pagination Examples */}
        <Row className="mt-4">
          <Col lg="12">
            <Card className="shadow">
              <CardHeader>
                <h3 className="mb-0">Pagination Examples</h3>
              </CardHeader>
              <CardBody>
                <h5>How pagination looks with different scenarios:</h5>
                
                <div className="mb-4">
                  <h6>≤ 5 pages: Shows all pages</h6>
                  <p className="text-sm text-muted">Example: [1] [2] [3] [4] [5]</p>
                </div>

                <div className="mb-4">
                  <h6>> 5 pages, current page near start:</h6>
                  <p className="text-sm text-muted">Example: [1] [2] [3] [...] [50]</p>
                </div>

                <div className="mb-4">
                  <h6>> 5 pages, current page in middle:</h6>
                  <p className="text-sm text-muted">Example: [1] [...] [24] [25] [26] [...] [50]</p>
                </div>

                <div className="mb-4">
                  <h6>> 5 pages, current page near end:</h6>
                  <p className="text-sm text-muted">Example: [1] [...] [48] [49] [50]</p>
                </div>

                <div className="alert alert-info">
                  <strong>Current Status:</strong> Page {currentPage} of {totalPages} 
                  ({itemsPerPage} items per page)
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PaginationDemo;
