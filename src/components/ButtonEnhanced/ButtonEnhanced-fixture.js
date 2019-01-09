import ButtonEnhanced from './ButtonEnhanced';

export default [
  {
    component: ButtonEnhanced,
    name: 'loading',
    props: {
      children: 'Click Me!',
      loading: true,
      onClick: () => console.log('clicked'),
    },
  },
  {
    component: ButtonEnhanced,
    name: 'notloading',
    props: {
      children: 'Click Me!',
      onClick: () => console.log('clicked'),
    },
  },
];
