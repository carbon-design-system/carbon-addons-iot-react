# Experimental Components

This document aims to provide clarity on why components become 'experimental', what that term means, and what steps are necessary to bring those components into the stable category.

## TL;DR

Experimental components are a work in progress and not subject to the normal rules of semantic versioning. Any use of these components or features should come with the implicit understanding that minor version bumps may introduce breaking changes. These components have inherently low test coverage and documentation due to shifting apis and architecture.

## What is an 'experimental component'

The term experimental can mean many things in the development context. For the PAL project this term is applied to components whose designs are being validated and iterated on. During this process the API and internal markup may drastically change in response to feedback. These components have inherently low test coverage and documentation, due to this volatility,

Experimental components are not subject to the normal rules of [semantic versioning](https://semver.org/). This means minor version bumps may introduce breaking changes.

## Are these components safe to use?

You should only use experimental components in development. Without proper test in place to ensure functionality and resiliency these components could introduce bugs and negatively impact your user's experience.

If your application is dependent on a component that has experimental status please elevate this in our PAL priority call.

## The road to stable

The process of moving a component over to stable begins when there are no outstanding requirements or design questions. Once this is the case then the component is subject to our acceptance criteria.

- Test coverage must be complete and pass with out exceptions. All production components must meet the 80% threshold level.
- Documentation of the finalized API must be added to the component story
- No outstanding i18n, a11y, or RTL concerns
