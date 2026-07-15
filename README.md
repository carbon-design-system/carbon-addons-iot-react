> [!WARNING]
> The `next` branch is no longer supported. These components are now being maintained in the [Graphite legacy-pal project](https://github.ibm.com/maximo-graphite/legacy-pal).

# Key information for carbon-addons-iot-react v5.x.x

## ♻️ TL;DR ♻️

**Who is affected?**
Non-Graphite apps that consume PAL directly as of 5.0. Graphite apps are not affected because Graphite manages libraries/CSS, except when shipping custom React components that import Carbon or fonts/styles directly.

**What to change now?**
Declare your own @carbon/\* versions in your app’s regular dependencies (not devDependencies). Stay within ranges supported by PAL and mas-common-ui.

```
{
  "dependencies": {
    "@carbon/charts": "1.23.17",
    "@carbon/charts-react": "1.23.17",
    "@carbon/colors": "^11.38.0",
    "@carbon/icons-react": "11.46.0",
    "@carbon/layout": "^11",
    "@carbon/pictograms-react": "11.51.2",
    "@carbon/react": "^1.88.0"
  }
}
```

Fonts: Stop external or duplicate loads. Self-host IBM Plex or add explicit font declarations.
Styles: Use one entry point. Pick SCSS or CSS. Typically not both.

**Why?**
Eliminate version collisions and duplicate/external font loading. Give control back to the consuming app.

---

## Full explanation...

🚨 PAL (carbon-addons-iot-react) + mas-common-ui upgrades — what changed and what you need to do

This may be a slight inconvenience today, but in the long run this will be very beneficial. 🙂

You may notice with an upgrade to the latest PAL (PAL = carbon-addons-iot-react) and mas-common-ui, you now have problems with @carbon/\* dependencies.
This is because we have decoupled these dependencies from PAL and mas-common-ui, so that applications that consume either one of these (Graphite, Core, Monitor, MVI, Optimizer, Assist, etc.) declare the dependencies for themselves, instead of having dependencies passed to them downstream from PAL or mas-common-ui.
(Also includes --> Non-Graphite apps that consume PAL directly as of 5.0 or Graphite apps shipping custom React components that import Carbon or fonts/styles directly)

**Why this was problematic?**

Your app declared: `@carbon/react: 1.88.0`
PAL declared: `@carbon/react: 1.91.0`
mas-common-ui declared: `@carbon/react: 2.3.4`

## Your consumer project had to choose which of these three to resolve, often leading to unexpected failures due to your project accepting a version of @carbon/react that wasn’t intended.

😎 **How this helps you in the long run...**

- @carbon/\* are now peerDependencies in both PAL and mas-common-ui.
- Your app declares exact versions → one source of truth and fewer flaky failures.
- You have more control over these packages, within the version ranges we publish in PAL and mas-common-ui.

👨‍💻 **What you must do to account for this change**
Since your consumer project is no longer getting dependency declarations from PAL or mas-common-ui, ensure your project explicitly declares these @carbon/\* libraries.
Add these to your project’s regular dependencies section (not devDependencies).
Choose versions within the ranges supported by PAL and mas-common-ui.

```
{
  "dependencies": {
    "@carbon/charts": "1.23.17",
    "@carbon/charts-react": "1.23.17",
    "@carbon/colors": "^11.38.0",
    "@carbon/icons-react": "11.46.0",
    "@carbon/layout": "^11",
    "@carbon/pictograms-react": "11.51.2",
    "@carbon/react": "^1.88.0"
  }
}
```

---

⚠️ PLEASE READ: FONTS CAN SLIP THROUGH THE CRACKS
💇 About styles and fonts

Just like the @carbon/\* dependencies, part of this change is to give applications more control over how they import/use styles and fonts.

Previously, IBM Plex fonts were sometimes loaded more than once and sometimes fetched externally.

Now, IBM Plex fonts are no longer pulled from external sources or auto-bundled via Carbon defaults.

If your application needs IBM Plex or custom fonts, handle them explicitly in your app.

To self-host Plex and restore font faces, import:
`@use '@carbon/react/scss/fonts' as *;`
This provides the @font-face declarations, with external urls.

See [mas-common-ui/index.scss](https://github.ibm.com/maximo-app-framework/mas-app-common/blob/main/packages/mas-common-ui/index.scss) for an explicit example

## **Make sure your app explicitly adds fonts if you need them. This is commonly missed and can hold your application back from licensing approvals/progression.**

**⤵️ Styles entry points**

You can import SCSS directly instead if it fits your application. You do not need both. Pick one by default:

SCSS projects (recommended for projects that already use SCSS):
`@use '@maximo/mas-common-ui/dist/scss/styles.scss';`

Legacy or CSS-only projects:
`@import '@maximo/mas-common-ui/dist/style.css';`
