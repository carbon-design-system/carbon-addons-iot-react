/**
 * Simulates a client capable of asynchronously fetching
 * paginated, filtered and sorted data from some resource (e.g. an HTTP API)
 */
export default class MockApiClient {
  static firstNames = [
    'Tom',
    'Amy',
    'Bryan',
    'Cynthia',
    'Claudia',
    'Denny',
    'Mats',
    'Luaithrenn',
    'Scott',
    'Taylor',
  ];

  static lastNames = ['Smith', 'Brown', 'Johnson', 'Williams', 'Miller', 'Davis', 'Wilson'];

  constructor(resultCount = 100, fetchDurationMs = 500) {
    this.data = [];
    this.fetchDurationMs = fetchDurationMs;

    for (let i = 0; i < resultCount; i += 1) {
      this.data = [
        ...this.data,
        {
          firstName: `${
            MockApiClient.firstNames[Math.floor(Math.random() * MockApiClient.firstNames.length)]
          } (${i + 1})`,
          lastName: `${
            MockApiClient.lastNames[Math.floor(Math.random() * MockApiClient.lastNames.length)]
          } (${i + 1})`,
        },
      ];
    }
  }

  /**
   * Returns true iff ${fieldName} of ${record} contains the substring ${fieldValue} (case-insensitive)
   */
  static doesRecordMatch = (record, fieldName, fieldValue) =>
    `${record[fieldName].toLowerCase()}`.includes(fieldValue.toLowerCase());

  /**
   * Return a promise that resolves (after a delay) to a page of data, optionally filtered and sorted.
   *
   * offset: the index of the first result in the returned page
   * limit: the (maximum) number of results to include in the returned page
   * firstNameFilter: (optional) filter results to include only those with a firstName that contains this value as a substring (case-insensitive)
   * lastNameFilter: (optional) filter results to include only those with a lastName that contains this value as a substring (case-insensitive)
   * sort: (optional) An object with fields {"fieldName":<string>, "descending":<boolean>} denoting a
   *                  a field (one of "firstName" or "lastName" on which to sort results, and the direction
   *                  of the sort.
   *
   */
  getData = (
    offset,
    limit,
    firstNameFilter = undefined,
    lastNameFilter = undefined,
    sortSpec = undefined
  ) => {
    // console.log('Fetching ', offset, limit, firstName, lastName, sortSpec);

    return new Promise(resolve => {
      // filter results
      const maybeFilteredByFirstName = firstNameFilter
        ? this.data.filter(r => MockApiClient.doesRecordMatch(r, 'firstName', firstNameFilter))
        : this.data;

      const maybeFilteredByLastName = lastNameFilter
        ? maybeFilteredByFirstName.filter(r =>
            MockApiClient.doesRecordMatch(r, 'lastName', lastNameFilter)
          )
        : maybeFilteredByFirstName;

      const maybeSorted = sortSpec
        ? maybeFilteredByLastName.sort((da, db) => {
            const a = da[sortSpec.fieldName];
            const b = db[sortSpec.fieldName];
            return a === b ? 0 : (a < b ? -1 : 1) * (sortSpec.descending ? -1 : 1);
          })
        : maybeFilteredByLastName;

      // cap results to total (matching) rows even if more are requested
      const maxRow = Math.min(maybeSorted.length, offset + limit);
      const page = maybeSorted.slice(offset, maxRow);

      setTimeout(
        () =>
          resolve({
            meta: {
              totalRows: maybeSorted.length,
            },
            results: page,
          }),
        this.fetchDurationMs
      );
    });
  };
}
