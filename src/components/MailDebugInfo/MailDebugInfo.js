import React from 'react';
import { Card, CardBody, CardHeader, Table, Badge } from 'reactstrap';
import { useMailContext } from 'contexts/MailContext.js';

const MailDebugInfo = () => {
  const { mails } = useMailContext();

  const validMails = mails.filter(mail => !mail.isExpired);
  const expiredMails = mails.filter(mail => mail.isExpired);
  const dungHanMails = mails.filter(mail => mail.category === "DungHan");
  const quaHanMails = mails.filter(mail => mail.category === "QuaHan");

  return (
    // <Card className="shadow">
    //   <CardHeader className="bg-transparent">
    //     <h3 className="mb-0">🔍 Debug Info - Phân loại Mail</h3>
    //   </CardHeader>
    //   <CardBody>
    //     <div className="row mb-4">
    //       <div className="col-md-3">
    //         <div className="text-center">
    //           <h4 className="text-success">{validMails.length}</h4>
    //           <small>Mail đúng hạn (isExpired: false)</small>
    //         </div>
    //       </div>
    //       <div className="col-md-3">
    //         <div className="text-center">
    //           <h4 className="text-danger">{expiredMails.length}</h4>
    //           <small>Mail hết hạn (isExpired: true)</small>
    //         </div>
    //       </div>
    //       <div className="col-md-3">
    //         <div className="text-center">
    //           <h4 className="text-info">{dungHanMails.length}</h4>
    //           <small>Thư mục DungHan/</small>
    //         </div>
    //       </div>
    //       <div className="col-md-3">
    //         <div className="text-center">
    //           <h4 className="text-warning">{quaHanMails.length}</h4>
    //           <small>Thư mục QuaHan/</small>
    //         </div>
    //       </div>
    //     </div>

    //     <Table size="sm" responsive>
    //       <thead>
    //         <tr>
    //           <th>ID</th>
    //           <th>Subject</th>
    //           <th>Category</th>
    //           <th>isExpired</th>
    //           <th>Status</th>
    //           <th>File Path</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {mails.map(mail => (
    //           <tr key={mail.id}>
    //             <td>{mail.id}</td>
    //             <td className="text-sm">
    //               {mail.Subject.length > 30 ? mail.Subject.substring(0, 30) + '...' : mail.Subject}
    //             </td>
    //             <td>
    //               <Badge color={mail.category === "DungHan" ? "info" : "warning"} pill>
    //                 {mail.category}
    //               </Badge>
    //             </td>
    //             <td>
    //               <Badge color={mail.isExpired ? "danger" : "success"} pill>
    //                 {mail.isExpired ? "true" : "false"}
    //               </Badge>
    //             </td>
    //             <td>
    //               <Badge color={mail.isReplied ? "success" : "secondary"} pill>
    //                 {mail.status}
    //               </Badge>
    //             </td>
    //             <td className="text-xs text-muted">
    //               {mail.filePath.split('/').slice(-3).join('/')}
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </Table>

    //     <div className="mt-3">
    //       <h5>Logic phân loại:</h5>
    //       <ul className="text-sm">
    //         <li><strong>isExpired = false</strong> khi mail ở thư mục <code>DungHan/</code></li>
    //         <li><strong>isExpired = true</strong> khi mail ở thư mục <code>QuaHan/</code></li>
    //         <li><strong>isReplied = false</strong> khi mail ở thư mục <code>*/ChuaTraLoi/</code></li>
    //         <li><strong>isReplied = true</strong> khi mail ở thư mục <code>*/DaTraLoi/</code></li>
    //       </ul>
    //     </div>
    //   </CardBody>
    // </Card>
    <div></div>
  );
};

export default MailDebugInfo;
