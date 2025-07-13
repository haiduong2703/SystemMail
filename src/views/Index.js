/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  Badge,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import MailHeader from "components/Headers/MailHeader.js";
import MailStatisticsChart from "components/MailStatisticsChart/MailStatisticsChart.js";
import MailDataInfo from "components/MailDataInfo/MailDataInfo.js";
import MailDebugInfo from "components/MailDebugInfo/MailDebugInfo.js";
import AssignmentStats from "components/AssignmentStats.js";
import TestNewFeatures from "components/TestNewFeatures/TestNewFeatures.js";
import RealtimeMailMonitor from "components/RealtimeMailMonitor/RealtimeMailMonitor.js";
import { formatDate } from "../data/mockMails.js";
import {
  useMailContext,
  useMailStats,
  useValidMails,
  useExpiredMails,
  useMailTypeStats,
  useTopSenders,
  useDetailedStats, // Thêm import useDetailedStats
  usePICOverdueRanking
} from "contexts/MailContext.js";

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");

  // Load mail data from context (tự động quét file JSON)
  const { mails, loading, error, loadedFromFiles, totalFiles } = useMailContext();

  // Get mail statistics (tự động cập nhật khi mails thay đổi)
  const mailStats = useMailStats();
  const mailTypeStats = useMailTypeStats();
  const topSenders = useTopSenders();
  const detailedStats = useDetailedStats(); // Lấy dữ liệu chi tiết
  const picRanking = usePICOverdueRanking(); // Lấy xếp hạng PIC
  const validMails = useValidMails().slice(0, 5); // Get latest 5 valid mails
  // const expiredMails = useExpiredMails().slice(0, 5); // Get latest 5 expired mails - không cần nữa vì dùng detailedStats

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  // Show loading state
  if (loading) {
    return (
      <>
        <MailHeader />
        <Container className="mt--7" fluid>
          <Row className="justify-content-center">
            <Col className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Đang tải dữ liệu mail...</span>
              </div>
              <p className="mt-3">Đang tải dữ liệu từ file JSON...</p>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <MailHeader />
        <Container className="mt--7" fluid>
          <Row className="justify-content-center">
            <Col className="text-center">
              <div className="alert alert-warning" role="alert">
                <h4 className="alert-heading">⚠️ Lỗi tải dữ liệu</h4>
                <p>Không thể tải dữ liệu từ file JSON. Đang sử dụng dữ liệu mặc định.</p>
                <hr />
                <p className="mb-0">Lỗi: {error}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <MailHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Mail Data Info */}
        <Row>
          <Col xl="8">
            <MailDataInfo
              mails={mails}
              loading={loading}
              error={error}
              loadedFromFiles={loadedFromFiles}
              totalFiles={totalFiles}
            />
          </Col>
          <Col xl="4">
            <AssignmentStats />
          </Col>
        </Row>

        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <MailStatisticsChart />
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      PIC Ranking
                    </h6>
                    <h2 className="mb-0">
                      {picRanking.topPIC ? (
                        <>
                          <i className="ni ni-badge text-warning mr-2"></i>
                          {picRanking.topPIC.name}: {picRanking.topPIC.count}
                        </>
                      ) : (
                        'No overdue mails'
                      )}
                    </h2>
                    <p className="text-muted mb-0">
                      <small>Top PIC with most overdue unreplied mails</small>
                    </p>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* PIC Overdue Ranking - Simple List with Scroll */}
                <div
                  className="pic-ranking-list"
                  style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    paddingRight: '5px'
                  }}
                >
                  {picRanking.ranking.length > 0 ? (
                    picRanking.ranking.map((pic, index) => (
                      <div
                        key={pic.name}
                        className={`d-flex justify-content-between align-items-center py-2 ${index < picRanking.ranking.length - 1 ? 'border-bottom' : ''}`}
                        style={{ borderColor: '#e9ecef' }}
                      >
                        <div className="d-flex align-items-center">
                          <span
                            className="badge badge-circle mr-3"
                            style={{
                              backgroundColor: index === 0 ? '#f5365c' :
                                             index === 1 ? '#fb6340' :
                                             index === 2 ? '#ffd600' : '#8898aa',
                              color: 'white',
                              minWidth: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: 'bold'
                            }}
                          >
                            {index + 1}
                          </span>
                          <div>
                            <div className="font-weight-bold text-sm">{pic.name}</div>
                            {pic.email && (
                              <div className="text-muted text-xs">{pic.email}</div>
                            )}
                          </div>
                        </div>
                        <Badge
                          color={index === 0 ? "danger" : index === 1 ? "warning" : "secondary"}
                          pill
                          className="ml-2"
                        >
                          {pic.count}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <i className="ni ni-check-bold text-success" style={{ fontSize: '2rem' }}></i>
                      <p className="text-muted mt-2 mb-0">No overdue unreplied mails</p>
                      <small className="text-success">All PICs are up to date!</small>
                    </div>
                  )}
                </div>

                {/* Custom Scrollbar Styles */}
                <style jsx>{`
                  .pic-ranking-list::-webkit-scrollbar {
                    width: 6px;
                  }
                  .pic-ranking-list::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                  }
                  .pic-ranking-list::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                  }
                  .pic-ranking-list::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                  }
                `}</style>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Mail đúng hạn gần đây</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="success"
                      href="/admin/valid-mails"
                      size="sm"
                    >
                      Xem tất cả
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Tiêu đề</th>
                    <th scope="col">Người gửi</th>
                    <th scope="col">Loại</th>
                    <th scope="col">Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {validMails.map((mail) => (
                    <tr key={mail.id}>
                      <th scope="row">
                        <span className="text-sm font-weight-bold">
                          {mail.Subject.length > 50 ? mail.Subject.substring(0, 50) + '...' : mail.Subject}
                        </span>
                      </th>
                      <td>{mail.From}</td>
                      <td>
                        <Badge color="success" pill>
                          {mail.Type}
                        </Badge>
                      </td>
                      <td>
                        <span className="text-sm">
                          {formatDate(mail.Date)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Top người gửi</h3>
                  </div>
                 
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Người gửi</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody>
                  {topSenders.map((sender, index) => (
                    <tr key={index}>
                      <th scope="row">
                        <span className="text-sm font-weight-bold">
                          {sender.sender}
                        </span>
                      </th>
                      <td>
                        <Badge color="primary" pill>
                          {sender.count}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">{sender.percentage}%</span>
                          <div>
                            <Progress
                              max="100"
                              value={sender.percentage}
                              barClassName="bg-gradient-primary"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>

        {/* Realtime Mail Monitor */}
        

        {/* Test New Features */}
        {/* <Row className="mt-4">
          <Col>
            <TestNewFeatures />
          </Col>
        </Row>

        {/* Debug Info */}
        {/* <Row className="mt-4">
          <Col>
            <MailDebugInfo />
          </Col>
        </Row> */}
      </Container>
    </>
  );
};

export default Index;
