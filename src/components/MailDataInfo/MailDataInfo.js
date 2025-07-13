import React from 'react';
import { Alert, Badge } from 'reactstrap';

const MailDataInfo = ({ mails, loading, error, loadedFromFiles, totalFiles }) => {
  if (loading) {
    return (
      <Alert color="info" className="mb-4">
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm text-info mr-3" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div>
            <strong>🔄 Đang quét tự động file JSON...</strong>
            <br />
            <small>Hệ thống đang tự động quét thư mục DungHan/ và QuaHan/ để tìm file JSON</small>
          </div>
        </div>
      </Alert>
    );
  }

  // if (error && !loadedFromFiles) {
  //   return (
  //     <Alert color="warning" className="mb-4">
  //       <div className="d-flex align-items-center">
  //         <i className="ni ni-bell-55 text-warning mr-3" style={{ fontSize: '1.5rem' }}></i>
  //         <div>
  //           <strong>⚠️ Sử dụng dữ liệu mặc định</strong>
  //           <br />
  //           <small>Không thể quét file JSON tự động: {error}</small>
  //         </div>
  //       </div>
  //     </Alert>
  //   );
  // }

  // if (loadedFromFiles) {
  //   return (
  //     <Alert color="success" className="mb-4">
  //       <div className="d-flex align-items-center justify-content-between">
  //         <div className="d-flex align-items-center">
  //           <i className="ni ni-check-bold text-success mr-3" style={{ fontSize: '1.5rem' }}></i>
  //           <div>
  //             <strong>✅ Tự động quét và tải file JSON thành công!</strong>
  //             <br />
  //             <small>
  //               Đã tìm thấy và tải <Badge color="success" pill>{totalFiles}</Badge> mail từ các file JSON trong cấu trúc thư mục
  //             </small>
  //           </div>
  //         </div>
  //         <div className="text-right">
  //           <small className="text-muted">
  //             <i className="ni ni-folder-17 mr-1"></i>
  //             Nguồn: Auto-scan JSON files
  //           </small>
  //         </div>
  //       </div>
  //     </Alert>
  //   );
  // }

  // return (
  //   <Alert color="info" className="mb-4">
  //     <div className="d-flex align-items-center justify-content-between">
  //       <div className="d-flex align-items-center">
  //         <i className="ni ni-archive-2 text-info mr-3" style={{ fontSize: '1.5rem' }}></i>
  //         <div>
  //           <strong>📁 Sử dụng dữ liệu fallback</strong>
  //           <br />
  //           <small>
  //             Hiển thị <Badge color="info" pill>{totalFiles}</Badge> mail từ dữ liệu mặc định (không tìm thấy file JSON)
  //           </small>
  //         </div>
  //       </div>
  //       <div className="text-right">
  //         <small className="text-muted">
  //           <i className="ni ni-settings mr-1"></i>
  //           Nguồn: Fallback data
  //         </small>
  //       </div>
  //     </div>
  //   </Alert>
  return <div></div>;
};

export default MailDataInfo;
