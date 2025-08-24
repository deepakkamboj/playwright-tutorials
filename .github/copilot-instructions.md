# GitHub Copilot Instructions for Playwright Test Generation

## Overview

These instructions guide GitHub Copilot in two distinct modes for generating high-quality Playwright tests following Page Object Model (POM) patterns, specifically optimized for Dynamics 365 CRM testing using the established framework structure with integrationTest wrapper functions.

## Modes of Operation

### Edit Mode (Traditional Approach)
GitHub Copilot assists in refactoring raw Playwright CodeGen output into enterprise-ready test code through AI-assisted editing and code completion.

### Agent Mode (MCP Server Approach)
GitHub Copilot operates through Model Context Protocol (MCP) servers for complete automation of test generation, execution, and CI/CD integration using natural language commands.

**IMPORTANT**: If you are operating in Agent Mode, you must use MCP Server for automated test execution and generation.

## Core Principles

- **Always use Page Object Model (POM)** classes within test files
- **Always use integrationTest wrapper** for test execution
- **Follow established framework patterns** for CRM operations
- **Maintain clean separation** between page logic and test logic
- **Use existing utilities** instead of raw Playwright commands


## File Structure Requirements

### **MANDATORY: Always Generate Two Files**

For every test scenario, **ALWAYS** generate exactly two files:

1. **Page Object Model File (.page.ts)**
   - Location: `apps/pages/` folder
   - Naming: `[feature].page.ts` (camelCase)
   - Class naming: PascalCase (e.g., `ContactManagementPage`)
   - Must encapsulate all page interactions

2. **Test File (.test.ts)**
   - Location: `apps/tests/` folder
   - Naming: `[feature].test.ts` (camelCase)
   - Must use integrationTest wrapper
   - Must instantiate and use POM classes

### File Structure Example
```
apps/
├── pages/
│   └── contactManagement.page.ts    // POM class
└── tests/
    └── contactManagement.test.ts     // Test implementation
```

**CRITICAL**: Never generate only one file. Always create both the .page.ts and .test.ts files together.

## Page Object Model Implementation

### Page Object Structure

```typescript
// apps/pages/contactManagement.page.ts
import { Page, Locator } from "@playwright/test";
import {
  EntityLogicalName,
  ControlTypes,
  CommandBarTypes,
  FieldLogicalName,
  SitemapSubAreaDataId,
} from "../common/enums";
import {
  navigateToSubArea,
  waitForGridHomePageLoad,
  waitForEditFormLoad,
  setFieldValueOnForm,
  saveEditForm,
  findAndClickCommandBarButton,
  validateToastNotificationMessage,
} from "../utils/crmUtils";

// Selector constants organized by component
const ContactSelectors = {
  Grid: {
    NewButton: '[data-id="contact|NoRelationship|HomePageGrid|Mscrm.HomepageGrid.contact.NewRecord"]',
    GridContainer: '[data-id="grid-container"]',
    FirstRowCell: '[data-id="cell-0-1"]',
  },
  Form: {
    FirstNameField: '[data-id="firstname"]',
    LastNameField: '[data-id="lastname"]',
    EmailField: '[data-id="emailaddress1"]',
    FormHeader: '[data-id="form-header"]',
  },
  CommandBar: {
    NewRecord: '[data-id="contact|NoRelationship|HomePageGrid|Mscrm.HomepageGrid.contact.NewRecord"]',
    SaveAndClose: '[data-id="contact|NoRelationship|Form|Mscrm.Form.contact.SaveAndClose"]',
  },
};

const ContactConstants = {
  DefaultTimeout: 30000,
  FormLoadTimeout: 60000,
  TestData: {
    FirstName: "Test",
    LastName: "Contact", 
    Email: "test.contact@example.com",
  },
};

export class ContactManagementPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to contacts grid page
   */
  async navigateToContactsGrid(): Promise<void> {
    try {
      await navigateToSubArea(this.page, SitemapSubAreaDataId.Contacts);
      await waitForGridHomePageLoad(this.page);
      console.log("Successfully navigated to contacts grid");
    } catch (error) {
      console.error(`Error navigating to contacts grid: ${error.message}`);
      throw new Error(`Failed to navigate to contacts grid: ${error.message}`);
    }
  }

  /**
   * Click new contact button from command bar
   */
  async clickNewContact(): Promise<void> {
    try {
      await findAndClickCommandBarButton(
        this.page,
        EntityLogicalName.Contact,
        ContactSelectors.CommandBar.NewRecord,
        CommandBarTypes.Grid
      );
      await waitForEditFormLoad(this.page);
      console.log("Successfully clicked new contact button");
    } catch (error) {
      console.error(`Error clicking new contact button: ${error.message}`);
      throw new Error(`Failed to click new contact button: ${error.message}`);
    }
  }

  /**
   * Fill contact form with provided data
   */
  async fillContactForm(firstName: string, lastName: string, email?: string): Promise<void> {
    try {
      await setFieldValueOnForm(
        this.page,
        FieldLogicalName.FirstName,
        firstName,
        ControlTypes.TextBox
      );

      await setFieldValueOnForm(
        this.page,
        FieldLogicalName.LastName,
        lastName,
        ControlTypes.TextBox
      );

      if (email) {
        await setFieldValueOnForm(
          this.page,
          FieldLogicalName.EmailAddress1,
          email,
          ControlTypes.TextBox
        );
      }
      console.log("Successfully filled contact form");
    } catch (error) {
      console.error(`Error filling contact form: ${error.message}`);
      throw new Error(`Failed to fill contact form: ${error.message}`);
    }
  }

  /**
   * Save the contact form
   */
  async saveContact(): Promise<void> {
    try {
      await saveEditForm(this.page);
      await validateToastNotificationMessage(this.page, "Record saved successfully");
      console.log("Successfully saved contact");
    } catch (error) {
      console.error(`Error saving contact: ${error.message}`);
      throw new Error(`Failed to save contact: ${error.message}`);
    }
  }

  /**
   * Verify contact is displayed in grid
   */
  async verifyContactInGrid(contactName: string): Promise<void> {
    const contactCell = this.page.locator(`[aria-label*="${contactName}"]`).first();
    await contactCell.waitFor({ timeout: ContactConstants.DefaultTimeout });
  }
}
```

## Test Implementation with integrationTest Wrapper

### Required Test Structure

```typescript
// apps/tests/contactManagement.test.ts
import { test, expect } from "@playwright/test";
import { integrationTest } from "../src/utils/integrationTestWrapper";
import {
  RunType,
  Priority,
  Severity,
  Team,
} from "@paeng/playwright-teams-info";
import { EntityLogicalName, EntityType } from "../src/common/enums";
import { createEntityRecord, cleanDatabase } from "../src/utils/crmUtils";
import { ContactManagementPage } from "../pages/contactManagement.page";

test.describe("Contact Management Tests", () => {
  let contactPage: ContactManagementPage;
  const createdRecordDetails = new Map<string, string>();

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactManagementPage(page);
  });

  test.afterEach(async ({ page }) => {
    // Clean the DB by deleting all sample created records
    await cleanDatabase(page, createdRecordDetails);
  });

  integrationTest(
    {
      runTypes: [[RunType.Pr, Priority.P0, Severity.S2]],
    },
    Team.PowerPlatformUX,
    "Case #12345: Create contact with required fields",
    async ({ page }) => {
      let contactName: string;

      await test.step("Navigate to contacts grid", async () => {
        await contactPage.navigateToContactsGrid();
      });

      await test.step("Create new contact", async () => {
        await contactPage.clickNewContact();
      });

      await test.step("Fill contact details", async () => {
        const firstName = "John";
        const lastName = "Doe";
        const email = "john.doe@example.com";
        
        contactName = `${firstName} ${lastName}`;
        await contactPage.fillContactForm(firstName, lastName, email);
      });

      await test.step("Save contact and verify creation", async () => {
        await contactPage.saveContact();
        
        // Navigate back to grid to verify contact appears
        await contactPage.navigateToContactsGrid();
        await contactPage.verifyContactInGrid(contactName);
      });
    }
  );

  integrationTest(
    {
      runTypes: [[RunType.Pr, Priority.P1, Severity.S3]],
    },
    Team.PowerPlatformUX,
    "Case #12346: Create contact using API then verify in UI",
    async ({ page }) => {
      let recordName: string;

      await test.step("Create contact via API", async () => {
        const [name, record] = await createEntityRecord(
          page,
          EntityLogicalName.Contact,
          {
            firstname: "API",
            lastname: "Contact",
            emailaddress1: "api.contact@example.com",
          },
          EntityType.SystemEntity
        );

        recordName = name;
        createdRecordDetails.set(record.id, EntityLogicalName.Contact);
      });

      await test.step("Navigate to contacts grid", async () => {
        await contactPage.navigateToContactsGrid();
      });

      await test.step("Verify API-created contact appears in grid", async () => {
        await contactPage.verifyContactInGrid(recordName);
      });
    }
  );
});
```

## Mandatory Requirements

### 1. Always Use POM Classes in Tests
- **NEVER** put page interactions directly in test files
- **ALWAYS** instantiate POM class in `test.beforeEach`
- **ALWAYS** call POM methods from test steps

### 2. Always Use integrationTest Wrapper
- **NEVER** use raw `test()` function
- **ALWAYS** use `integrationTest()` with proper configuration
- **ALWAYS** specify RunType, Priority, Severity, and Team

### 3. Required Imports for Tests

```typescript
import { test, expect } from "@playwright/test";
import { integrationTest } from "../src/utils/integrationTestWrapper";
import {
  RunType,
  Priority,
  Severity,
  Team,
} from "@paeng/playwright-teams-info";
import { EntityLogicalName, EntityType } from "../src/common/enums";
import { createEntityRecord, cleanDatabase } from "../src/utils/crmUtils";
// Import your POM class
import { YourPageClass } from "../pages/yourPage.page";
```

### 4. Required Test Structure Elements

```typescript
test.describe("Your Test Suite Name", () => {
  let pageObject: YourPageClass;
  const createdRecordDetails = new Map<string, string>();

  test.beforeEach(async ({ page }) => {
    pageObject = new YourPageClass(page);
  });

  test.afterEach(async ({ page }) => {
    await cleanDatabase(page, createdRecordDetails);
  });

  integrationTest(
    {
      runTypes: [[RunType.Pr, Priority.P0, Severity.S2]],
    },
    Team.YourTeam,
    "Case #XXXXX: Test description",
    async ({ page }) => {
      await test.step("Step description", async () => {
        // Use pageObject methods here
        await pageObject.yourMethod();
      });
    }
  );
});
```

## Framework Utilities Usage

### Use Framework Functions Instead of Raw Playwright

#### Navigation
```typescript
// ✅ Use framework utility
await navigateToSubArea(page, SitemapSubAreaDataId.Contacts);

// ❌ Don't use raw Playwright
await page.goto('/contacts');
```

#### Form Operations
```typescript
// ✅ Use framework utility
await setFieldValueOnForm(page, FieldLogicalName.FirstName, "John", ControlTypes.TextBox);

// ❌ Don't use raw Playwright
await page.fill('[data-id="firstname"]', "John");
```

#### Wait Operations
```typescript
// ✅ Use framework utilities
await waitForEditFormLoad(page);
await waitForGridHomePageLoad(page);

// ❌ Don't use generic waits
await page.waitForTimeout(5000);
```

#### Command Bar Operations
```typescript
// ✅ Use framework utility
await findAndClickCommandBarButton(
  page,
  EntityLogicalName.Contact,
  ContactSelectors.CommandBar.NewRecord,
  CommandBarTypes.Grid
);

// ❌ Don't use raw Playwright
await page.click('[data-id="new-button"]');
```

## Database Operations and Cleanup

### API Operations for Efficiency
```typescript
// Use API for setup when possible
const [recordName, record] = await createEntityRecord(
  page,
  EntityLogicalName.Contact,
  { firstname: "Test", lastname: "Contact" },
  EntityType.SystemEntity
);

// Track for cleanup
createdRecordDetails.set(record.id, EntityLogicalName.Contact);
```

### Mandatory Cleanup
```typescript
test.afterEach(async ({ page }) => {
  // Always clean up created records
  await cleanDatabase(page, createdRecordDetails);
});
```

## Error Handling Pattern

### In Page Objects
```typescript
async methodName(): Promise<void> {
  try {
    // Implementation using framework utilities
    console.log('Action completed successfully');
  } catch (error) {
    console.error(`Error in methodName: ${error.message}`);
    throw new Error(`Failed to perform methodName: ${error.message}`);
  }
}
```

## Naming Conventions

### Files
- Tests: `apps/tests/contactManagement.test.ts` (camelCase)
- Pages: `apps/pages/contactManagement.page.ts` (camelCase)

### Classes and Methods
- Classes: `ContactManagementPage` (PascalCase)
- Methods: `fillContactForm` (camelCase)
- Test Cases: `"Case #12345: Description"` format

### Constants
- Use framework enums: `EntityLogicalName.Contact`, `ControlTypes.TextBox`
- Page constants: PascalCase organization

## Selector Organization

### In Page Objects
```typescript
const YourSelectors = {
  Grid: {
    NewButton: '[data-id="new-button"]',
    GridContainer: '[data-id="grid-container"]',
  },
  Form: {
    FieldName: '[data-id="fieldname"]',
    SaveButton: '[data-id="save-button"]',
  },
  CommandBar: {
    NewRecord: '[data-id="new-record-command"]',
  },
};
```

## Test Configuration

### integrationTest Parameters
```typescript
integrationTest(
  {
    runTypes: [
      [RunType.Pr, Priority.P0, Severity.S2],      // PR runs
      [RunType.Ci, Priority.P1, Severity.S3],      // CI runs
    ],
  },
  Team.YourTeam,                                   // Team ownership
  "Case #XXXXX: Test description",                 // Test case ID and description
  async ({ page }) => {                            // Test implementation
    // Your test steps using POM
  }
);
```

## Common CRM Patterns

### Form Testing Pattern
```typescript
await test.step("Navigate to form", async () => {
  await pageObject.navigateToEntity();
});

await test.step("Fill form fields", async () => {
  await pageObject.fillRequiredFields(testData);
});

await test.step("Save and verify", async () => {
  await pageObject.saveRecord();
  await pageObject.verifyRecordSaved();
});
```

### Grid Testing Pattern
```typescript
await test.step("Navigate to grid", async () => {
  await pageObject.navigateToGrid();
});

await test.step("Verify record in grid", async () => {
  await pageObject.verifyRecordInGrid(recordName);
});
```

## Quality Standards

- **Type Safety**: Use TypeScript types and interfaces
- **Async/Await**: Proper async patterns throughout
- **Error Handling**: Try-catch blocks in POM methods
- **Logging**: Console logs for debugging
- **Documentation**: JSDoc comments for complex methods
- **Consistency**: Follow established patterns exactly

## Critical Don'ts

- ❌ **NEVER** generate only one file - always create both .page.ts and .test.ts files
- ❌ **NEVER** put files in wrong locations - pages go in `apps/pages/`, tests go in `apps/tests/`
- ❌ **NEVER** put page interactions directly in test files
- ❌ **NEVER** use raw `test()` instead of `integrationTest()`
- ❌ **NEVER** use raw Playwright commands when framework utilities exist
- ❌ **NEVER** skip database cleanup
- ❌ **NEVER** hardcode selectors in test files
- ❌ **NEVER** use generic waits instead of specific framework waits
- ❌ **NEVER** create tests in Agent Mode without using MCP server first

## Critical Do's

- ✅ **ALWAYS** generate exactly two files: .page.ts in `apps/pages/` and .test.ts in `apps/tests/`
- ✅ **ALWAYS** use POM classes for page interactions
- ✅ **ALWAYS** use integrationTest wrapper
- ✅ **ALWAYS** use framework utilities (crmUtils functions)
- ✅ **ALWAYS** organize tests with test.step()
- ✅ **ALWAYS** implement proper cleanup
- ✅ **ALWAYS** follow established patterns exactly
- ✅ **ALWAYS** use MCP server for test execution and generation in Agent Mode

This structure ensures maintainable, scalable, and reliable Dynamics 365 CRM tests that leverage the full power of the established testing framework.

---

## AGENT MODE INSTRUCTIONS (MCP SERVER)

_Use these instructions when GitHub Copilot is operating in Agent Mode through MCP servers for automated test generation and execution._

### MCP Server Requirements

When operating in Agent Mode, you **MUST** use MCP (Model Context Protocol) servers for:

- **Automated Test Execution**: Running tests in browser with full automation
- **Test Generation**: Creating test code based on recorded interactions  
- **CI/CD Integration**: Seamless integration with continuous integration pipelines
- **Natural Language Commands**: Processing user requests in natural language

### Test Execution Guidelines

#### Application Structure
- Ensure that all application files are located in the `apps` folder structure
- Maintain clean separation between page objects (`apps/pages/`) and test files (`apps/tests/`)
- Follow established folder hierarchy for maintainability

#### Browser Configuration
The Playwright-MCP server should run automation tests in the Chrome browser with the following flags:

- `--start-maximized` - Launch browser in maximized window
- `--no-sandbox` - Disable sandbox for automation compatibility
- `--disable-web-security` - Allow cross-origin requests for testing
- `--disable-features=IsolateOrigins` - Disable origin isolation
- `--disable-site-isolation-trials` - Disable site isolation
- `--start-fullscreen` - Launch in fullscreen mode
- `--window-size=1920,1080` - Set specific viewport size
- `--incognito` - **MANDATORY**: Run browser in private mode
- `--disable-save-password-bubble` - **MANDATORY**: Do not save credentials

#### Recording and Generation Process
- Record all steps performed during browser automation
- Generate Playwright test code based on recorded interactions
- Capture element interactions, navigation patterns, and user workflows
- Handle dynamic content and asynchronous operations appropriately
- **ALWAYS** generate both .page.ts and .test.ts files using MCP server

### Test Code Generation Requirements (Agent Mode)

#### File Structure and Naming
- Save generated test code in the `apps/tests/` folder
- Save generated page objects in the `apps/pages/` folder
- Use filename format: `[feature].test.ts` and `[feature].page.ts`
- Create folders if they do not exist
- Base filename on the feature or functionality being tested

#### Test Suite Organization
- Create test suite with name: `Test Suite - <feature name>`
- Include comprehensive header comments describing:
  - Test objectives and scope
  - Test steps and expected outcomes
  - Prerequisites and setup requirements
  - Relevant business logic and validation points

### Power Platform Authentication (Agent Mode)

#### Authentication Process
- Authenticate target environment using TMS (Test Management Service)
- Support multiple authentication scenarios and user contexts
- Handle environment switching and multi-tenant configurations

#### User Context and State Management
- Save authentication JSON with each user's `alias` and corresponding `stateStoragePath`
- Store Playwright state after login for session persistence
- Run each test case for specific user (alias) context
- Use correct `stateStoragePath` for user context in Playwright's `storageState` option
- Support multiple users by repeating authentication and state storage process for each alias
- Maintain isolation between different user contexts

### Mandatory Execution Sequence (Agent Mode)
1. **FIRST**: Execute and run tests in the browser with full automation using MCP server
2. **DURING**: Record all interactions and capture element behaviors
3. **THEN**: Generate test code with proper POM structure (both .page.ts and .test.ts files)
4. **FINALLY**: Create organized files in appropriate `apps/` folders

### Critical Restrictions (Agent Mode)
- **DO NOT** create any additional files beyond test and page object files
- **DO NOT** create tests before running them using MCP SERVER
- **DO NOT** scan or modify package.json files
- **DO NOT** create playwright.config.ts configuration files
- **DO NOT** create any other files or folders BEFORE running tests using MCP server
- **ALWAYS** use MCP server for test execution and generation in Agent Mode

### Security and Privacy Requirements (Agent Mode)
- **ALWAYS** run browser in private mode (`--incognito`) through MCP server
- **NEVER** save usernames or passwords in browser
- **ALWAYS** use `--disable-save-password-bubble` flag
- Ensure credential isolation between test runs
- Maintain secure authentication state management through MCP server

---
