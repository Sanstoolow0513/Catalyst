# Catalyst v1.0.0 Release Notes

This is the first stable release of Catalyst, marking a significant refactoring and rebranding of the original project. The focus of this release has been on improving code quality, stabilizing core features, and establishing a clear product direction.

---

## Features & Enhancements

- **Branding**: The project has been renamed to **Catalyst** with an updated product definition and description.
- **UI/UX Refactoring**:
    - The user interface has been redesigned with a new, consistent dark theme.
    - The main navigation has been simplified into four core tabs: "Dashboard", "Proxy", "Toolkit", and "Browser".
    - The "System Info" and "Resource Monitor" sections have been consolidated into the "Dashboard".
    - Redundant features have been removed to focus the application's scope.
- **Proxy Node Loading**: The logic for loading proxy nodes has been improved. Nodes are now loaded directly from the `config.yaml` file, allowing them to be displayed before the Clash service starts. Real-time status is fetched from the API when the service is active.
- **Network Robustness**: A 10-second timeout has been added to the configuration file download request. Error messages from the backend are now properly displayed in the UI.
- **User Experience**: Added tooltips to key controls for better user guidance.

## Bug Fixes

- **Application Exit**: Fixed a critical bug where the application would not terminate correctly, causing background processes to run in a loop after the window was closed.
- **Styling**: Fixed an issue where all styles were missing due to an empty `global.css` file.
- **Proxy List**: Resolved a bug that prevented the proxy node list from being fetched and displayed.

## Maintenance

- **Codebase Cleanup**: Removed obsolete directories and files from the project.
- **Dependency Management**: Uninstalled unused npm packages (`puppeteer`, `pkg`) to streamline dependencies.
- **Code Quality**: Performed a full linting pass on the codebase, fixing all style inconsistencies and "unused variable" warnings.

## Documentation

- **README.md**: The main documentation has been significantly expanded to include sections on Design Philosophy, Technical Architecture, and Core Modules.
- **DEVELOPMENT_LOG.md**: A new development log was created to document the refactoring process.

---

## Installation Files

- **Windows**: `Catalyst.Setup.1.0.0.exe` 