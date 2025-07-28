import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';

const AntdDatePicker = ({ 
  value, 
  onChange, 
  placeholder = "dd/mm/yyyy", 
  className = '', 
  style = {},
  size = 'middle',
  ...props 
}) => {
  // Convert yyyy-mm-dd string to dayjs object
  const convertValueToDayjs = (dateStr) => {
    if (!dateStr) return null;
    try {
      return dayjs(dateStr);
    } catch (error) {
      return null;
    }
  };

  // Convert dayjs object to yyyy-mm-dd string
  const convertDayjsToValue = (date) => {
    if (!date) return '';
    return date.format('YYYY-MM-DD');
  };

  const handleChange = (date) => {
    const dateString = convertDayjsToValue(date);
    if (onChange) {
      onChange({
        target: {
          value: dateString
        }
      });
    }
  };

  const dayjsValue = convertValueToDayjs(value);

  return (
    <DatePicker
      value={dayjsValue}
      onChange={handleChange}
      placeholder={placeholder}
      format="DD/MM/YYYY"
      size={size}
      style={{
        width: '100%',
        ...style
      }}
      className={className}
      allowClear={false}
      {...props}
    />
  );
};

export default AntdDatePicker;
