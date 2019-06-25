import React, { Component, Fragment } from 'react';
import { SkeletonText } from 'carbon-components-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledPageHeader = styled.div`
  display: flex;
  flex-flow: column nowrap;

  .bx--progress {
    padding: 1rem 1rem;
  }

  .bx--modal-header {
    display: flex;
    margin-bottom: 0.5rem;
    overflow-x: auto;
    overflow-y: hidden;
  }
`;

const StyledDivHeading = styled.div`
  min-width: 200px;
  padding-right: 3rem;
`;

/** Shared header with a title and close option */
class PageHeader extends Component {
  static propTypes = {
    /** Title in the header  */
    title: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    blurb: PropTypes.string,
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
    i18n: PropTypes.shape({ closeLabel: PropTypes.string }),
  };

  static defaultProps = {
    blurb: null,
    children: null,
    isLoading: false,
    i18n: {
      closeLabel: 'Close',
    },
  };

  state = {};

  render = () => {
    const {
      title,
      blurb,
      onClose,
      children,
      className,
      isLoading,
      i18n: { closeLabel },
    } = this.props;

    return (
      <StyledPageHeader className={className}>
        {isLoading ? (
          <StyledDivHeading className="bx--modal-header">
            <SkeletonText className="bx--modal-header__heading bx--type-beta" width="10%" />
          </StyledDivHeading>
        ) : (
          <Fragment>
            <div className="bx--modal-header">
              <StyledDivHeading>
                <p className="bx--modal-header__heading bx--type-beta">{title}</p>
              </StyledDivHeading>
              {children || null}
              <button
                className="bx--modal-close"
                type="button"
                data-modal-close
                aria-label={closeLabel}
                onClick={onClose}
              >
                <svg
                  className="bx--modal-close__icon"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>{closeLabel}</title>
                  <path
                    d="M6.32 5L10 8.68 8.68 10 5 6.32 1.32 10 0 8.68 3.68 5 0 1.32 1.32 0 5 3.68 8.68 0 10 1.32 6.32 5z"
                    fillRule="nonzero"
                  />
                </svg>
              </button>
            </div>
            {blurb ? <div>{blurb}</div> : null}
          </Fragment>
        )}
      </StyledPageHeader>
    );
  };
}

export default PageHeader;
