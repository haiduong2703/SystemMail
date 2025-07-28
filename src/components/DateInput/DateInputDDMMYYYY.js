import React from 'react';
import { Input } from 'reactstrap';
import './DateInputDDMMYYYY.css';

const DateInputDDMMYYYY = ({ value, onChange, className = '', style = {}, ...props }) => {
  // Convert yyyy-mm-dd to dd/mm/yyyy for display
  const formatToDisplay = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      return '';
    }
  };

  const displayValue = formatToDisplay(value);
  const hasValue = value && value.length > 0;

  return (
    <div className={`date-input-ddmmyyyy ${className.includes('form-control-sm') ? 'form-control-sm' : ''}`}>
      <Input
        type="date"
        value={value || ''}
        onChange={onChange}
        className={className}
        style={style}
        {...props}
      />
      <div className={`date-display ${!hasValue ? 'placeholder' : ''}`}>
        {hasValue ? displayValue : 'dd/mm/yyyy'}
      </div>
    </div>
  );
};

export default DateInputDDMMYYYY;
