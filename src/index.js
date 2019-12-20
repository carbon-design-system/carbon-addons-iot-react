// Needed so that any component that uses sizeme can be jest tested
import sizeMe from 'react-sizeme';

sizeMe.noPlaceholders = true;

// Styles
export styles from './styles.scss';

// Components
export Button, { ButtonSkeleton } from './components/Button';
export Table from './components/Table';
export AddCard from './components/AddCard';
// ModalHeader, ModalBody, ModalFooter are Carbon proxy
export ComposedModal, { ModalHeader, ModalBody, ModalFooter } from './components/ComposedModal';
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
export EditPage from './components/Page/EditPage';
export NavigationBar from './components/NavigationBar/NavigationBar';
export Header, {
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
} from './components/Header';
export SideNav from './components/SideNav';

// Dashboard
export Dashboard from './components/Dashboard/Dashboard';
export DashboardGrid from './components/Dashboard/DashboardGrid';
export Card from './components/Card/Card';
export ValueCard from './components/ValueCard/ValueCard';
export TimeSeriesCard from './components/TimeSeriesCard/TimeSeriesCard';
export ImageCard from './components/ImageCard/ImageCard';
export TableCard, { findMatchingThresholds } from './components/TableCard/TableCard';
export {
  CARD_TYPES,
  CARD_SIZES,
  DASHBOARD_BREAKPOINTS,
  DASHBOARD_SIZES,
} from './constants/LayoutConstants';

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
export { Accordion, AccordionItem, AccordionSkeleton } from './components/Accordion';
export { Breadcrumb, BreadcrumbItem, BreadcrumbSkeleton } from './components/Breadcrumb';
export { Checkbox, CheckboxSkeleton } from './components/Checkbox';
export { CodeSnippet, CodeSnippetSkeleton } from './components/CodeSnippet';
export { ComboBox } from './components/ComboBox';
export { ContentSwitcher } from './components/ContentSwitcher';
export { Copy } from './components/Copy';
export { CopyButton } from './components/CopyButton';
export { DangerButton } from './components/DangerButton';
// export {
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
// TableToolbarMenu,} from './components/DataTable;
export { DataTableSkeleton } from './components/DataTableSkeleton';
export { DatePicker, DatePickerSkeleton } from './components/DatePicker';
export { DatePickerInput } from './components/DatePickerInput';
export { Dropdown, DropdownSkeleton } from './components/Dropdown';
export {
  Filename,
  FileUploader,
  FileUploaderButton,
  FileUploaderDropContainer,
  FileUploaderItem,
  FileUploaderSkeleton,
} from './components/FileUploader';
export { Form } from './components/Form';
export { FormGroup } from './components/FormGroup';
export { FormItem } from './components/FormItem';
export { FormLabel } from './components/FormLabel';
export { Icon, IconSkeleton } from './components/Icon';
export { InlineLoading } from './components/InlineLoading';
export { Link } from './components/Link';
export { ListItem } from './components/ListItem';
export { Loading } from './components/Loading';
export { Modal } from './components/Modal';
export { ModalWrapper } from './components/ModalWrapper';
export { MultiSelect } from './components/MultiSelect';
export {
  ToastNotification,
  InlineNotification,
  NotificationActionButton,
  NotificationButton,
  NotificationTextDetails,
} from './components/Notification';
export { NumberInput, NumberInputSkeleton } from './components/NumberInput';
export { OrderedList } from './components/OrderedList';
export { OverflowMenu } from './components/OverflowMenu';
export { OverflowMenuItem } from './components/OverflowMenuItem';
export { Pagination } from './components/Pagination';
export { PrimaryButton } from './components/PrimaryButton';
export {
  // TODO Consolidate ProgressIndicator export from Carbon below with our ProgressIndicator export
  // ProgressIndicator,
  ProgressStep,
  ProgressIndicatorSkeleton,
} from './components/ProgressIndicator';
export { RadioButton, RadioButtonSkeleton } from './components/RadioButton';
export { RadioButtonGroup } from './components/RadioButtonGroup';
export { RadioTile } from './components/RadioTile';
export { Search, SearchSkeleton } from './components/Search';
export { SearchFilterButton } from './components/SearchFilterButton';
export { SearchLayoutButton } from './components/SearchLayoutButton';
export { SecondaryButton } from './components/SecondaryButton';
export { Select, SelectSkeleton } from './components/Select';
export { SelectItem } from './components/SelectItem';
export { SelectItemGroup } from './components/SelectItemGroup';
export {
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
} from './components/SideNav';
export { SkeletonPlaceholder } from './components/SkeletonPlaceholder';
export { SkeletonText } from './components/SkeletonText';
export { Slider, SliderSkeleton } from './components/Slider';
export {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListInput,
  StructuredListCell,
  StructuredListSkeleton,
} from './components/StructuredList';
export { Switch } from './components/Switch';
export { Tab, Tabs, TabContent, TabsSkeleton } from './components/Tabs';
export { Tag, TagSkeleton } from './components/Tag';
export { TextArea, TextAreaSkeleton } from './components/TextArea';
export { TextInput, TextInputSkeleton } from './components/TextInput';
export { TileGroup } from './components/TileGroup';
export {
  Tile,
  ClickableTile,
  SelectableTile,
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from './components/Tile';
export { TimePicker } from './components/TimePicker';
export { TimePickerSelect } from './components/TimePickerSelect';
export { Toggle, ToggleSkeleton } from './components/Toggle';
export { ToggleSmall, ToggleSmallSkeleton } from './components/ToggleSmall';
export { ToolbarSearch } from './components/ToolbarSearch';
export {
  Toolbar,
  ToolbarItem,
  ToolbarTitle,
  ToolbarOption,
  ToolbarDivider,
} from './components/Toolbar';
export { Tooltip } from './components/Tooltip';
export { TooltipDefinition } from './components/TooltipDefinition';
export { TooltipIcon } from './components/TooltipIcon';
export {
  Content,
  Switcher,
  SwitcherItem,
  SwitcherDivider,
  SkipToContent,
} from './components/UIShell';
export { UnorderedList } from './components/UnorderedList';

export { validateDashboardJSON } from './utils/schemas/validators';
export {
  determineCardRange,
  determineMaxValueCardAttributeCount,
  compareGrains,
} from './utils/cardUtilityFunctions';
