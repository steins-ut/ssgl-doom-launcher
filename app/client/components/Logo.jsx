import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import LogoSVG from '#/assets/Logo.svg';

const LogoContainer = styled.div`
  text-align: ${p => (p.center ? 'center' : 'left')};
  padding: 10px 0 0 10px;
  width: 100%;
`;

const Logo = ({ height = '70', center = false }) => {
  return (
    <LogoContainer center={center}>
      <LogoSVG height={height} />
    </LogoContainer>
  );
};

Logo.propTypes = {
  height: PropTypes.string,
  center: PropTypes.bool
};

export default Logo;
