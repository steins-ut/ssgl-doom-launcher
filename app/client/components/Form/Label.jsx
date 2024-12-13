import * as remote from '@electron/remote';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const LabelStyle = styled.label`
  display: inline-block;
  text-transform: uppercase;
  font-size: 14px;
  user-select: none;
  margin: ${p => (p.error ? '0 0 3px 10px;' : '0 0 3px 3px')};
  color: ${p => (p.error ? 'red' : 'white')};

  .info {
    color: ${({ theme }) => theme.color.active};
    cursor: pointer;
  }
`;

const Label = ({ children, info, error, ...rest }) => {
  const onInfo = e => {
    e.preventDefault();
    remote.shell.openExternal(info);
  };
  return (
    <LabelStyle error={error} {...rest}>
      {children}{' '}
      {info ? (
        <span className="info" onClick={onInfo}>
          [?]
        </span>
      ) : null}
    </LabelStyle>
  );
};

Label.propTypes = {
  children: PropTypes.string.isRequired,
  error: PropTypes.bool,
  info: PropTypes.string
};

export default Label;
