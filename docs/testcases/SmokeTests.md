# Smoke Tests - Guided Answers Extension

**Estimated Execution Time:** 15-30 minutes

**Environments:** 
- SAP Business Application Studio (SBAS)
- Microsoft Visual Studio Code (VSCODE)

**Prerequisites:** Guided Answers Extension is installed

---

## 1. Open Guided Answers Extension

### Test: Open in VSCODE
1. Open the 'Command Palette'
2. Enter 'SAP: Open Guided Answers'
3. Select 'SAP: Open Guided Answers'

**Expected Results:**
- Guided Answers extension opens in view port displaying:
  - SAP logo and Guided Answers header
  - Empty search input field

### Test: Open in SBAS
1. Open the 'Command Palette'
2. Enter 'SAP: Open Guided Answers'
3. Select 'SAP: Open Guided Answers'

**Expected Results:**
- Guided Answers extension opens in view port displaying:
  - SAP Logo and Guided Answers header
  - Empty search input field
  - Quick filters section containing filters on Components: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE

---

## 2. Search Guided Answers Content

1. Open Guided Answers Extension
2. Enter 'SAP Fiori Tools' in search field

**Expected Results:**
- A list of guides closely matching 'SAP Fiori Tools' appears containing:
  - Name of the Guided Answer
  - Description of the Guided Answer
  - Associated Product
  - Associated Component

---

## 3. Navigate Through Guided Answer Content

1. Open Guided Answers Extension
2. Search for 'SAP Fiori Tools'
3. Select 'SAP Fiori Tools' Guided Answer from the list
4. Select an outcome from the first node (e.g., 'Generation of SAP Fiori application')

**Expected Results - Initial View:**
- View port displays:
  - 'Home' icon, 'Step back', Feedback icon, Share link, and Bookmark star
  - Guided Answers content tree showing the first node
  - Title of the Guided Answer
  - Content of the first node
  - Available outcomes

**Expected Results - After Selecting Outcome:**
- View port displays:
  - 'Home' icon, 'Step back', 'Restart', Feedback icon, Share link, and Bookmark star
  - Tree showing the selected outcome underlined in blue
  - Content includes: Images, Bullet points, Paragraphs, Videos
  - Available outcomes for the next step(if applicable)

---

## 4. Navigation Controls

### Using the same Guided Answer from Test 3:

### Test: Step Back
1. Click 'Step back'

**Expected Results:**
- User returns to the previous node of the tree

### Test: Restart
1. Navigate through at least 2 outcomes
2. Click 'Restart'

**Expected Results:**
- User returns to the start of the Guided Answer
- First node is displayed

### Test: Tree Navigation
1. Click on a different node in the tree component

**Expected Results:**
- User navigates directly to that node in the Guided Answer Tree
- Content for that node is displayed

### Test: Home Button
1. Click 'Home' icon

**Expected Results:**
- User returns to Guided Answers home page
- Last visited section appears showing the last visited node

---

## 5. Filter Guided Answers Content

### Test: Product Filter
1. Open Guided Answers Extension
2. Enter 'Fiori Tools' in search field
3. Click on Product Filter(next to input field)
4. Check 'SAP Fiori Tools'
5. Click 'Apply Filter'

**Expected Results:**
- Text appears indicating the list is filtered on product 'SAP Fiori Tools'
- All outcomes in the list are associated with 'SAP Fiori Tools'

6. Click 'Clear filters'

**Expected Results:**
- List refreshes to show all Guided Answers matching the search input

### Test: Component Filter
1. Enter 'Fiori Tools' in search field
2. Click on Component Filter
3. Check 'CA-UX-IDE'
4. Click 'Apply Filter'

**Expected Results:**
- Text appears indicating the list is filtered on component 'CA-UX-IDE'
- All outcomes in the list are associated with 'CA-UX-IDE'

5. Click 'Clear filters'

**Expected Results:**
- List refreshes to show all Guided Answers matching the search input

---

## 6. Quick Filter (SBAS Only)

1. Open GA extension in SBAS
2. Click on Quick Filter Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE

**Expected Results:**
- List displays guides related to the specified components
- 'Clear filters' link is visible

3. Enter 'SAP Fiori Tools' in search field

**Expected Results:**
- List shows guides matching both the component filter AND search criteria

4. Click 'Clear Filters'

**Expected Results:**
- List refreshes to show only guides matching 'SAP Fiori Tools' search

---

## 7. Issue Resolution - Solved

1. Open GA extension
2. Search and select a Guided Answer
3. Navigate through the Guided Answer until there are no more outcomes to select
4. Click 'This solved my issue'

**Expected Results:**
- Pop-up appears containing:
  - Thank you message
  - 'Home' Button
  - 'Close' Button

5. Click 'Home' button

**Expected Results:**
- User navigates to the home page
- Last visited section displays the last visited node

---

## 8. Issue Resolution - Not Solved

1. Open GA extension
2. Search and select a Guided Answer
3. Navigate through the Guided Answer until there are no more outcomes to select
4. Click 'This did not resolve my issue'

**Expected Results:**
- User navigates to a new node showing:
  - Heading: 'The issue was not resolved'
  - Description: 'We are sorry to hear that your issue was not yet resolved...'
  - List of options (e.g., Start an Expert Chat, Schedule an Expert, Open an Incident, Ask the SAP Community, Search for Another Guided Answer)

5. Click on 'Search for Another Guided Answer'

**Expected Results:**
- User navigates back to the Guided Answer Extension Home page

---

## 9. Bookmarking Guides

### Test: Add Bookmark
1. Open GA extension
2. Search for 'SAP Fiori Tools'
3. Select 'SAP Fiori Tools' Guided Answer
4. Navigate to a specific node
5. Click on the star icon

**Expected Results:**
- Star icon turns yellow

6. Click 'Home' icon

**Expected Results:**
- Home page displays with bookmarked guides section
- Previously bookmarked guide appears in the list

### Test: Remove Bookmark
1. From the home page with bookmarks visible
2. Click on the star icon opposite the bookmarked guide

**Expected Results:**
- Bookmark is removed
- Bookmarked guides section is empty if no other bookmarks exist

### Test: Navigate to Bookmark
1. Create a bookmark (follow steps from "Add Bookmark")
2. Click 'Home' icon
3. Click on the bookmarked guide from the home page

**Expected Results:**
- Extension opens to the exact bookmarked node

---

## 10. Share Guided Answer Link

1. Open GA extension
2. Search for 'SAP Fiori Tools'
3. Select a SAP Fiori Tools Guided Answer
4. Navigate to a specific node
5. Click on 'Share this guide' icon

**Expected Results:**
- Pop-up appears with the shareable link

6. Click on 'Copy This Link' icon

**Expected Results:**
- Link is copied to clipboard

7. Click 'Home' icon
8. Paste the link in the search input field

**Expected Results:**
- Extension navigates directly to the specific node from the copied link

---

## 11. General Feedback Submission

1. Open GA extension
2. Search and select a Guided Answer
3. Navigate through the Guided Answer
4. Click the Comment/Feedback icon

**Expected Results:**
- Pop-up appears containing:
  - Heading: 'Is this content helpful?'
  - Text: 'If you have suggestions on how to improve this content we would love to hear them!'
  - Text input field labeled 'Your suggestion'
  - 'Send' Button
  - 'Close' Button

5. Enter text in the suggestion box
6. Click 'Send'

**Expected Results:**
- 'Message Sent' confirmation appears

---

## 12. Responsive Design

1. Open Guided Answers Extension
2. Make the viewport smaller

**Expected Results:**
- The search input field adjusts layout and falls under the SAP Guided Answers Extension title
- All content remains accessible and properly formatted

---

## 13. Last Visited Functionality

1. Open Guided Answers Extension
2. Search for 'SAP Fiori Tools'
3. Select and navigate through a Guided Answer to a specific node
4. Click 'Home' icon

**Expected Results:**
- Home page displays with 'Last visited' section
- Last visited section shows the specific node that was last viewed

5. Click on the last visited guide

**Expected Results:**
- Extension opens directly to that specific node

---

## Notes

- Verify that content (headers, bullet points, images, videos) matches the web application version
- Test in both VSCODE and SBAS environments where applicable
- Ensure feedback submissions are captured in the backend system
- Verify that the extension reuses existing instances when opened multiple times (unless "Open in New Tab" setting is enabled)
