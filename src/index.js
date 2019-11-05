// Needed so that any component that uses sizeme can be jest tested
import sizeMe from 'react-sizeme';

sizeMe.noPlaceholders = true;

// Styles
export styles from './styles.scss';

// Components
export Button from './components/Button';
export Table from './components/Table';
export AddCard from './components/AddCard';
export ComposedModal from './components/ComposedModal';
export WizardModal from './components/WizardModal';
export WizardInline from './components/WizardInline/WizardInline';
export StatefulWizardInline from './components/WizardInline/StatefulWizardInline';
export TableHead from './components/Table/TableHead/TableHead';
export TableBody from './components/Table/TableBody/TableBody';
export TableToolbar from './components/Table/TableToolbar/TableToolbar';
export EmptyTable from './components/Table/EmptyTable/EmptyTable';
export TableSkeletonWithHeaders from './components/Table/TableSkeletonWithHeaders/TableSkeletonWithHeaders';
export StatefulTable from './components/Table/StatefulTable';
export TileCatalog from './components/TileCatalog/TileCatalog';
export StatefulTileCatalog from './components/TileCatalog/StatefulTileCatalog';
export SimplePagination from './components/SimplePagination/SimplePagination';
export CatalogContent from './components/TileCatalog/CatalogContent';
export ProgressIndicator from './components/ProgressIndicator/ProgressIndicator';
export ComposedStructuredList from './components/ComposedStructuredList/ComposedStructuredList';
export ResourceList from './components/ResourceList/ResourceList';
export FileDrop from './components/FileDrop/FileDrop';
export PageTitleBar from './components/PageTitleBar/PageTitleBar';

// reusable reducers
export { baseTableReducer } from './components/Table/baseTableReducer';
export { tableReducer } from './components/Table/tableReducer';
export { tileCatalogReducer } from './components/TileCatalog/tileCatalogReducer';
export * as tableActions from './components/Table/tableActionCreators';

// Page related helpers
export PageHero from './components/Page/PageHero';
export PageWorkArea from './components/Page/PageWorkArea';
export NavigationBar from './components/NavigationBar/NavigationBar';
export Header from './components/Header';
export SideNav from './components/SideNav';

// Dashboard
export Dashboard from './components/Dashboard/Dashboard';
export Card from './components/Card/Card';
export ValueCard from './components/ValueCard/ValueCard';
export {
  CARD_TYPES,
  CARD_SIZES,
  DASHBOARD_BREAKPOINTS,
  DASHBOARD_SIZES,
} from './constants/LayoutConstants';
export { findMatchingThresholds } from './components/TableCard/TableCard';

// Experimental
export ListCard from './components/ListCard/ListCard';
export {
  PageWizard,
  PageWizardStep,
  PageWizardStepContent,
  PageWizardStepTitle,
  PageWizardStepDescription,
  PageWizardStepExtraContent,
} from './components/PageWizard/PageWizard';
export StatefulPageWizard from './components/PageWizard/StatefulPageWizard';

// Carbon proxy
export {
  Accordion,
  AccordionItem,
  Breadcrumb,
  BreadcrumbItem,
  Checkbox,
  CodeSnippet,
  ComboBox,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ContentSwitcher,
  Copy,
  CopyButton,
  DangerButton,
  // TODO consolidate Carbon's datatable exports below with our table exports
  // default as DataTable,
  // Table,
  // TableActionList,
  // TableBatchAction,
  // TableBatchActions,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableExpandHeader,
  // TableExpandRow,
  // TableExpandedRow,
  // TableHead,
  // TableHeader,
  // TableRow,
  // TableSelectAll,
  // TableSelectRow,
  // TableToolbar,
  // TableToolbarAction,
  // TableToolbarContent,
  // TableToolbarSearch,
  // TableToolbarMenu,
  DatePicker,
  DatePickerInput,
  Dropdown,
  Filename,
  FileUploader,
  FileUploaderButton,
  FileUploaderDropContainer,
  FileUploaderItem,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  Icon,
  InlineLoading,
  Link,
  ListItem,
  Loading,
  Modal,
  ModalWrapper,
  MultiSelect,
  ToastNotification,
  InlineNotification,
  NotificationActionButton,
  NotificationButton,
  NotificationTextDetails,
  NumberInput,
  OrderedList,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  PrimaryButton,
  // TODO Consolidate ProgressIndicator export from Carbon below with our ProgressIndicator export
  // ProgressIndicator,
  ProgressStep,
  RadioButton,
  RadioButtonGroup,
  Search,
  SearchFilterButton,
  SearchLayoutButton,
  SecondaryButton,
  Select,
  SelectItem,
  SelectItemGroup,
  Switch,
  Slider,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListInput,
  StructuredListCell,
  Tab,
  TabContent,
  Tabs,
  Tag,
  TextArea,
  TextInput,
  Tile,
  ClickableTile,
  SelectableTile,
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
  RadioTile,
  TileGroup,
  TimePicker,
  TimePickerSelect,
  Toggle,
  ToggleSmall,
  Toolbar,
  ToolbarItem,
  ToolbarTitle,
  ToolbarOption,
  ToolbarDivider,
  ToolbarSearch,
  Tooltip,
  TooltipDefinition,
  TooltipIcon,
  UnorderedList,
  SkeletonText,
  SkeletonPlaceholder,
  DataTableSkeleton,
  AccordionSkeleton,
  BreadcrumbSkeleton,
  ButtonSkeleton,
  CheckboxSkeleton,
  CodeSnippetSkeleton,
  DropdownSkeleton,
  FileUploaderSkeleton,
  NumberInputSkeleton,
  ProgressIndicatorSkeleton,
  RadioButtonSkeleton,
  SearchSkeleton,
  SelectSkeleton,
  SliderSkeleton,
  StructuredListSkeleton,
  TabsSkeleton,
  TagSkeleton,
  TextAreaSkeleton,
  TextInputSkeleton,
  ToggleSkeleton,
  ToggleSmallSkeleton,
  IconSkeleton,
  DatePickerSkeleton,
  // -----------------------
  // UI Shell proxy exports
  // -----------------------
  Content,
  // TODO Consolidate Header export from Carbon below with our Header export
  // Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenu,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  HeaderPanel,
  HeaderSideNavItems,
  Switcher,
  SwitcherItem,
  SwitcherDivider,
  SkipToContent,
  // TODO Consolidate SideNav export from Carbon below with our SideNav export
  // SideNav,
  SideNavDetails,
  SideNavFooter,
  SideNavHeader,
  SideNavIcon,
  SideNavItem,
  SideNavItems,
  SideNavLink,
  SideNavLinkText,
  SideNavMenu,
  SideNavMenuItem,
  SideNavSwitcher,
} from 'carbon-components-react';
export { validateDashboardJSON } from './utils/schemas/validators';

export {
  determineCardRange,
  determineMaxValueCardAttributeCount,
  compareGrains,
} from './utils/cardUtilityFunctions';
