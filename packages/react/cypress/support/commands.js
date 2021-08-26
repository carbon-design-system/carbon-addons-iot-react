import compareSnapshotCommand from 'cypress-image-diff-js/dist/command';
// https://github.com/testing-library/cypress-testing-library
import '@testing-library/cypress/add-commands';
import '@4tw/cypress-drag-drop';
import 'cypress-file-upload';

compareSnapshotCommand();
