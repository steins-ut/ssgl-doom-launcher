import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import circle from '#/assets/icon/circle.svg';
import down from '#/assets/icon/down.svg';
import times from '#/assets/icon/times.svg';
import up from '#/assets/icon/up.svg';

// TODO: color / refactor
export const IconStyle = styled.div`
  cursor: pointer;

  svg {
    stroke: ${p => (p.stroke ? p.stroke : p.theme.border.idle)};
    transition: ${({ theme }) => theme.transition.out};
  }

  div:hover {
    svg {
      stroke: ${p => (p.danger ? '#f55945' : p.theme.border.active)};
      filter: ${p =>
        p.danger
          ? `drop-shadow(0 -1px 4px #ff2f00) drop-shadow(0 0 10px #ff2f00)`
          : p.theme.svg.glow};
    }
  }
`;

const names = {
  up,
  down,
  circle,
  times
};

const Icon = ({ name, danger, stroke, ...rest }) => {
  const SVG = names[name];
  return names[name] ? (
    <IconStyle stroke={stroke} danger={danger}>
      <SVG component={'div'} {...rest} />
    </IconStyle>
  ) : null;
};

Icon.propTypes = {
  name: PropTypes.string,
  stroke: PropTypes.string,
  danger: PropTypes.bool
};

export default Icon;
