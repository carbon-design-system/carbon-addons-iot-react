// Renders the children if it is a function returning a frangment
// and then returns the children of that fragment
export const getRenderPropChildren = (props, children) => {
  if (typeof children === 'function') {
    const renderedChildren = children(props);
    if (renderedChildren.type.description === 'react.fragment') {
      return renderedChildren.props.children;
    }
  }
  return [];
};
