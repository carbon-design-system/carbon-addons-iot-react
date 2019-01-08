# Common Core External Dashboard

[![Build Status](https://travis.ibm.com/IoT-Enterprise/common-core-external-dashboard.svg?token=sRhjdZCbzJUNxQBJx7Va&branch=master&style=plastic)](https://travis.ibm.com/IoT-Enterprise/common-core-external-dashboard)

## Setting up the project

if you don't already have yarn on your Mac then '**brew install yarn**' first

```bash
yarn install
yarn start
```

This will launch an External Dashboard instance pointing to our "development environment" backend services and the "sandvik" tenant.

## Requesting access

To actually login to our dev environment you will need to request access. Please make the request (including your IBM ID email) on the #ask_iotcs_as slack channel in the IBM Watson IoT Platform Workspace: https://ibm-watson-iot.slack.com/messages/CA60S5T88/.

## Testing changes

We have an automated unit test bucket that runs when you execute `yarn test:watch`.
Before every push, we automatically run our test suite and take snapshots of all of our current component fixtures. If you have made visual changes to a component, our tests will
fail because the snapshots will no longer match. You will be prevented from pushing to git until you fix this error.

## Updating snapshots

To update the snapshot, type `u` after the snapshot difference has been detected by our unit test engine.
_Do not blindly update snapshots to pass the testcase._ Make sure the detected change is intentional and not unintentional before updating the snapshot.

## Exploring components

To explore each of our components outside of the UI, you can use our test tool "react-cosmos". To start the cosmos server, run:
`yarn cosmos` and open a browser to http://localhost:8989. If you add or modify an existing component, please add a new Cosmos fixture to it, so our unit tests will cover it. https://github.com/react-cosmos/react-cosmos/blob/master/docs/fixtures.md

## Minimum Code Coverage

We enforce code coverage thresholds in our project. If you add code but do not cover it with unit tests, the git push may fail because we have fallen under our code coverage thresholds. Please add cosmos fixtures or unit tests to cover your new code before checking in. _Do not reduce the code coverage threshold to get around this constraint._
To understand what lines of code are NOT covered by our current testcases, open the coverage/index.html file in a browser and investigate.

## Setting up VSCode to share our Settings/Extensions

<http://shanalikhan.github.io/2015/12/15/Visual-Studio-Code-Sync-Settings.html>

Here's our Gist ID to download/share settings from:
5e3fb697c29f2aaa058145a3349a8229

After installing the VSCode Sync, restart VSCode, go to the Command Palette
and search for Sync. Select Sync : Advanced Options-> Sync : Download Settings from Public GIST

Then Sync : Download Settings. It will ask you for a Public GIST URL, here it is.

Here's the Public GIST URL:
<https://gist.github.com/scottdickerson/5e3fb697c29f2aaa058145a3349a8229>

## Adding a dependency

Please use `yarn add` to add dependencies to the project not `npm install`

## Webpack Bundle Analyzation

View an interactive treemap visualization of the contents of all our bundles/dependencies at http://127.0.0.1:8888/
This is started automatically on `yarn start` via [`webpack-bundle-analyzer`](https://www.npmjs.com/package/webpack-bundle-analyzer)

## Advanced Configuration (optional)

1.  annoucement_config.json

Staging

```javascript
{
	"announcement_server_url":"https://status-staging.internetofthings.ibmcloud.com",
	"authorization_server_url":"https://opsdashboard-staging.internetofthings.ibmcloud.com",
	"pin_code":"uimm03ti8gis5k48r5ijm3lr2a"
}
```

Production

```javascript
{
"announcement_server_url":"https://status.internetofthings.ibmcloud.com",
"authorization_server_url":"https://opsdashboard.internetofthings.ibmcloud.com",
	"pin_code":<contact wangfu@cn.ibm.com>
}
```

Description:

This file is shared by internal dashboard and external dashboard.

- **announcement_server_url:** This server is used to retrieve the announcements, used by external dashboard.
- **authorization_server_url:** This server is used to populate solution/instance/tenant data, used by internal dashboard.
- **pin_code:** This pin code is used for authentication to the above two servers, used by both.

external_dashboard_config.json

```javascript
{
	"app_url":"https://localhost:8443",
	"banner_text":"IBM Watson IoT Connected Products",
	"sso_config":{
		"client_id":"xxx",
		"client_secret":"xxx",
		"authorization_url":"https://idaas.iam.ibm.com/idaas/oidc/endpoint/default/authorize",
		"token_url":"https://idaas.iam.ibm.com/idaas/oidc/endpoint/default/token",
		"issuer_id":"https://idaas.iam.ibm.com",
		"logout_url":"https://idaas.iam.ibm.com/pkmslogout"
	},
	"doc_url":"https://www.ibm.com/support/knowledgecenter/SSQP8H/iot-connected-products/kc_welcome.html",
	"service_config":{
		"cos":{
			"enable_buckets":true
		},
		"messagehub":{
			"enable_topics":true
		}
	}
	"analytics_config": {
    "enableExplore": true,
    "enableConnect": true
  }
}
```

Description:

- **app_url:** specify the application url, e.g. `https://169.48.172.72:31515`
- **banner_text:** specify the text displayed in banner, login page and logout page as banner text. The default value is "IBM IoT Connection Service" if not present.
- **sso_config:** specify the SSO service configuration. To register SSO service, please go to <https://w3.innovate.ibm.com/tools/sso/home.html> . **Register blueID with OpenID protocol**, then update the corresponding fields in this configuration file.
- **doc_url:** specify the URL for the Docs link in the dashboard banner. There is not default value for this propery. If it is not present in the configuration file, Docs link is hidden.
- **service_config:** used to customize the different services. For example, hide/show Buckets in Cloud Object Storage details dialog.
- **analytics_config:** used to configure which features of the Analytics Service are available. For example to hide the connect and explore panels from standard ICS customers

## Adding a new test tenant

1.  In internal dashboard, create a new tenant (assume its tenant id is "mytenant"). Ensure its "Contact Email" is your IBM Id (i.e. Blue Id, not w3Id, federated Id could be considered as IBM Id)

2.  Open the external dashboard URL using this format - `https://[hostname]:[port]/preauth?tenantid=[tenant id]`, e.g. `https://173.193.106.101:31515/preauth?tenantid=mytenant`. After press Enter, you should see external dashboard login page.

3.  Click "Log in" link in login page, and following the steps to pass Blue Id SSO with your Blue Id and password.

## Environmental Variables

The following environmental variables can be used to customize your k8s deployment.

- TLS_ENABLED (yes/no): TLS is disabled by default. To enable it, set "yes". Usually when k8s ingress is configured, TLS is disabled, and when IP address directly used to access application, enable TLS. **Note:** SSO does not work when TLS is disabled.
- SECRET_DIR: To test production you can override to point to the directory with all the json secret files (by default it's /usr/src/app/secret in production)
- SERVICE_BROKER_URL: The default value is <http://service-broker:3001>.
- REST_METADATA_URL: The default value is <http://cc-rest-meta-service:9081>.
- REST_MASTER_URL: The default value is <http://as-rest-master-service:9081>.
- KPI_MANAGER_URL: The default value is <http://as-rest-kpi-service:9081>.
