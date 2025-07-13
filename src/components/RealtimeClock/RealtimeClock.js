import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Row,
  Col
} from 'reactstrap';

const RealtimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const getDayOfWeek = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const getVietnameseDayOfWeek = (date) => {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return days[date.getDay()];
  };

  return (
    <Card className="shadow border-0">
      <CardBody className="py-2 px-3">
        <div className="d-flex align-items-center">
          <div className="mr-3">
            <i className="ni ni-time-alarm text-primary" style={{ fontSize: '18px' }}></i>
          </div>
          <div className="flex-fill">
            <div className="text-xs text-muted mb-1">
              {getVietnameseDayOfWeek(currentTime)}
            </div>
            <div className="text-sm font-weight-bold text-dark">
              {formatDateTime(currentTime)}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default RealtimeClock;
