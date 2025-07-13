import React from 'react';
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  FormGroup,
  Label,
  Input,
  Row,
  Col
} from 'reactstrap';

const PaginationControls = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [5, 10, 25, 50, 100]
}) => {
  return (
    <>
      {/* Items per page selector */}
      {showItemsPerPage && (
        <Row className="align-items-center mt-3 mb-3">
          <Col className="col-auto">
            <FormGroup className="mb-0">
              <Label for="itemsPerPage" className="form-control-label">
                Hiển thị:
              </Label>
              <Input
                type="select"
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
                className="form-control-sm"
                style={{ width: 'auto', display: 'inline-block', marginLeft: '10px' }}
              >
                {itemsPerPageOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Input>
              <span className="ml-2 text-muted">mục/trang</span>
            </FormGroup>
          </Col>
          <Col className="col-auto">
            <small className="text-muted">
              Hiển thị {startIndex + 1}-{Math.min(endIndex, totalItems)} của {totalItems} mục
            </small>
          </Col>
        </Row>
      )}

      {/* Pagination */}
      <nav aria-label="Pagination">
        <Pagination
          className="pagination justify-content-end mb-0"
          listClassName="justify-content-end mb-0"
        >
          {/* Previous button */}
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink
              href="#pablo"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              tabIndex="-1"
            >
              <i className="fas fa-angle-left" />
              <span className="sr-only">Previous</span>
            </PaginationLink>
          </PaginationItem>
          
          {/* Page numbers with smart pagination */}
          {(() => {
            const pages = [];
            const maxVisiblePages = 5;

            if (totalPages <= maxVisiblePages) {
              // Show all pages if total pages <= 5
              for (let i = 1; i <= totalPages; i++) {
                pages.push(
                  <PaginationItem key={i} active={currentPage === i}>
                    <PaginationLink
                      href="#pablo"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(i);
                      }}
                    >
                      {i}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
            } else {
              // Smart pagination for many pages
              // Always show first page
              pages.push(
                <PaginationItem key={1} active={currentPage === 1}>
                  <PaginationLink
                    href="#pablo"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              );

              // Show ellipsis if current page is far from start
              if (currentPage > 3) {
                pages.push(
                  <PaginationItem key="start-ellipsis" disabled>
                    <PaginationLink href="#pablo" onClick={(e) => e.preventDefault()}>
                      ...
                    </PaginationLink>
                  </PaginationItem>
                );
              }

              // Show pages around current page
              const startPage = Math.max(2, currentPage - 1);
              const endPage = Math.min(totalPages - 1, currentPage + 1);

              for (let i = startPage; i <= endPage; i++) {
                if (i !== 1 && i !== totalPages) {
                  pages.push(
                    <PaginationItem key={i} active={currentPage === i}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(i);
                        }}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              }

              // Show ellipsis if current page is far from end
              if (currentPage < totalPages - 2) {
                pages.push(
                  <PaginationItem key="end-ellipsis" disabled>
                    <PaginationLink href="#pablo" onClick={(e) => e.preventDefault()}>
                      ...
                    </PaginationLink>
                  </PaginationItem>
                );
              }

              // Always show last page
              if (totalPages > 1) {
                pages.push(
                  <PaginationItem key={totalPages} active={currentPage === totalPages}>
                    <PaginationLink
                      href="#pablo"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(totalPages);
                      }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
            }

            return pages;
          })()}
          
          {/* Next button */}
          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationLink
              href="#pablo"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
            >
              <i className="fas fa-angle-right" />
              <span className="sr-only">Next</span>
            </PaginationLink>
          </PaginationItem>
        </Pagination>
      </nav>
    </>
  );
};

export default PaginationControls;
