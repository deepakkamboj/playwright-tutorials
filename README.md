# Playwright Tutorials 🚀

This repository contains Playwright end-to-end automation tutorials and sample projects using the [Playwright Playground](https://playwright-playground.vercel.app/).

## Playground Demo
- [Playwright Playground](https://playwright-playground.vercel.app/)

## Features
- Page Object Model (POM) structure
- Parallel cross-browser testing (Chromium, Firefox, WebKit)
- Authentication and user session setup
- Sample login flows and dashboard navigation
- JUnit XML reporting
- TypeScript support

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run tests:
   ```sh
   npx playwright test
   ```

## Project Structure
```
src/
  pages/
  setup/
  data/
  tests/
  utils/
.github/
  workflows/
    playwright.yml
```

## Playground URLs
- Login: `https://playwright-playground.vercel.app/login`
- Dashboard: `https://playwright-playground.vercel.app/dashboard`
- Home: `https://playwright-playground.vercel.app/`

## Author & Support
- For detailed tutorials visit: https://deepakkamboj.com/
- Contact: [Deepak Kamboj on LinkedIn](https://www.linkedin.com/in/kambojdeepak/)

---

# About Playwright
Playwright is a Node.js library to automate Chromium, Firefox, and WebKit with a single API. It enables fast, reliable, and capable automation across all modern browsers.

## Capabilities
- Multi-page, domain, and iframe support
- Network interception and mocking
- Mobile device emulation
- Native input events
- Upload & download support
- Auto-wait APIs and timeout-free automation
- Wide variety of selectors & shadow DOM support

## More Playwright Capabilities

- **Cross-browser automation**: Test on Chromium, Firefox, and WebKit
- **Headless and headful modes**: Run tests with or without UI
- **Parallel test execution**: Speed up test runs with multiple workers
- **Browser context isolation**: Create multiple independent sessions in one browser instance
- **Network interception and mocking**: Stub requests, modify responses, and simulate network conditions
- **Device emulation**: Simulate mobile devices, geolocation, permissions, and more
- **Advanced selectors**: Use text, CSS, XPath, role, and custom locators
- **Shadow DOM support**: Interact with elements inside shadow roots
- **Automatic waiting**: Playwright waits for elements to be actionable before performing actions
- **Screenshots and video recording**: Capture screenshots and videos for debugging and reporting
- **Tracing**: Record and analyze test execution traces
- **Custom reporters**: Integrate with CI/CD and generate custom reports
- **Test retries**: Automatically retry failed tests
- **Multi-language support**: Use Playwright with TypeScript, JavaScript, Python, Java, and .NET
- **API testing**: Send HTTP requests and validate API responses
- **Accessibility testing**: Integrate with tools like axe-playwright
- **Authentication flows**: Save and reuse authentication state across tests

## Used Tools
- [playwright](https://playwright.dev/)
- [axe-playwright](https://www.npmjs.com/package/axe-playwright)
- [Playwright test runner](https://github.com/microsoft/playwright-test)

## TypeScript Config Example
```
{
  "compilerOptions": {
     "target": "es6",
     "module": "commonjs",
     "strict": true,
     "sourceMap": true
  },
  "include": ["src"]
}
```

---
This project is designed for learning and experimenting with Playwright using the Playground demo site.
