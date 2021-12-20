import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ComposedModal, ModalBody, ModalFooter, ModalHeader } from 'carbon-components-react';

import CheckboxList from './CheckboxList';

const renderDefaultHeader = ({ children, ...props }) => {
  return <ModalHeader {...props}>{children}</ModalHeader>;
};

const renderDefaultBody = ({ data, selectedIds, onChange }) => (
  <ModalBody>
    <CheckboxList data={data} selectedIds={selectedIds} onChange={onChange} />
  </ModalBody>
);

const renderDefaultFooter = (props) => <ModalFooter {...props} />;

const getRenderPropChildren = (props, children) => {
  if (typeof children === 'function') {
    const renderedChildren = children(props);
    if (renderedChildren.type.description === 'react.fragment') {
      return renderedChildren.props.children;
    }
  }
  return [];
};

const ArchetypeModalPropTypes = {
  children: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object),
  header: PropTypes.shape({
    label: PropTypes.node,
    title: PropTypes.node,
    helpText: PropTypes.node,
  }),
  footer: PropTypes.shape({
    onRequestSubmit: PropTypes.bool,
    onRequestClose: PropTypes.bool,
    primaryButtonText: PropTypes.string,
    primaryButtonDisabled: PropTypes.bool,
    secondaryButtonText: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};

const DefaultArchetypeModalPropTypes = {
  children: {},
  data: [],
  footer: {
    secondaryButtonText: 'Cancel',
    primaryButtonText: 'OK',
  },
  header: {
    title: 'I am a default value',
  },
};

const ArchetypeModal = ({
  children,
  data,
  header: headerProps,
  footer: footerProps,
  onSubmit: onSubmitProp,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const onSubmit = () => {
    // This is done to stay data agnostic
    const selectedDataObjects = selectedIds.map((selectedId) =>
      data.find((dataObj) => JSON.stringify(dataObj) === selectedId)
    );
    onSubmitProp(selectedDataObjects);
  };

  const onCheckboxChange = (check, checkboxValueId) => {
    console.info(check, checkboxValueId);
    setSelectedIds((prev) =>
      check ? [...prev, checkboxValueId] : prev.filter((id) => id !== checkboxValueId)
    );
  };

  const [modalHeader, modalBody, modalFooter] = getRenderPropChildren(
    {
      checkboxListProps: { data, selectedIds, onChange: onCheckboxChange },
      footerProps: { ...footerProps, onRequestSubmit: onSubmit },
      headerProps,
    },
    children
  );

  return (
    <ComposedModal open>
      {modalHeader || renderDefaultHeader(headerProps)}
      {modalBody || renderDefaultBody({ data, selectedIds, onChange: onCheckboxChange })}
      {modalFooter || renderDefaultFooter({ ...footerProps, onRequestSubmit: onSubmit })}
    </ComposedModal>
  );
};

ArchetypeModal.defaultProps = DefaultArchetypeModalPropTypes;
ArchetypeModal.propTypes = ArchetypeModalPropTypes;
export { ModalHeader, ModalBody, ModalFooter, ArchetypeModal };
