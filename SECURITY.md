# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

Please report a vulnerability through GitHub's security advisory feature at
https://github.com/carbon-design-system/carbon-addons-iot-react/security/advisories/new

As this is a UI library, it's highly uncommon to see a security vulnerability
directly within this codebase, but it is possible.

If a reported vulnerability is within the codebase, the issue will be added to
the current sprint and someone will begin to investigate immediately. Some
components/modules we export are a direct proxy of a module from the
[Carbon Design System](https://github.com/carbon-design-system/carbon). If the
vulnerability is there, a maintainer will contact a member of the Carbon team
and we'll work with them to investigate.

If the vulnerability is within a dependency, we'll update the dependency to a
patched version. We welcome pull requests and utilize dependabot to automate
this for the codebase.
