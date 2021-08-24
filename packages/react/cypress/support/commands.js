import compareSnapshotCommand from 'cypress-image-diff-js/dist/command';
// https://github.com/testing-library/cypress-testing-library
import '@testing-library/cypress/add-commands';
import 'cypress-file-upload';

compareSnapshotCommand();
