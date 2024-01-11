
### Associated user stories 
[#60](https://github.com/SAP/guided-answers-extension/issues/60),
[#89](https://github.wdf.sap.corp/ux-engineering/tools-suite/issues/89),
[#90](https://github.wdf.sap.corp/ux-engineering/tools-suite/issues/90),
[#91](https://github.wdf.sap.corp/ux-engineering/tools-suite/issues/91),
[#143](https://github.wdf.sap.corp/ux-engineering/tools-suite/issues/143),
[#164](https://github.wdf.sap.corp/ux-engineering/tools-suite/issues/164)
[#199](https://github.com/SAP/guided-answers-extension/issues/199),
[#39](https://github.com/SAP/guided-answers-extension/issues/39),
[#40](https://github.com/SAP/guided-answers-extension/issues/40),
[#96](https://github.com/SAP/guided-answers-extension/issues/96),
[#230](https://github.com/SAP/guided-answers-extension/issues/230),
[#245](https://github.com/SAP/guided-answers-extension/issues/245),
[#137](https://github.com/SAP/guided-answers-extension/issues/137),
[#311](https://github.com/SAP/guided-answers-extension/issues/311),
[#258](https://github.com/SAP/guided-answers-extension/issues/258),
[#85](https://github.com/SAP/guided-answers-extension/issues/85),
[#426](https://github.com/SAP/guided-answers-extension/issues/426),
[#492](https://github.com/SAP/guided-answers-extension/issues/492),
[#490](https://github.com/SAP/guided-answers-extension/issues/490),
[#531](https://github.com/SAP/guided-answers-extension/issues/531),
[#309](https://github.com/SAP/guided-answers-extension/issues/309)

Prerequisites: Guided Answers Extension is installed in either SAP Business Application Studio (SBAS) or Microsoft Visual Studio Code (VSCODE)



### Open Guided Answers in VSCODE

2. Open the 'Command Palette'
3. Enter 'SAP: Open Guided Answers'
4. Select 'SAP: Open Guided Answers' ( See expected result 1 ) 
5. Make view port smaller ( See expected results 2 ) 
6. Open the 'Command Palette'
7. Enter 'SAP: Open Guided Answers'
8. Select 'SAP: Open Guided Answers' ( See expected result 4 ) 
9. Select Code in VSCode Nav bar
10. Select Settings in drop down menu
11. Click Settings in menu 
12. Enter 'Guided Answers' in the setting search input field 
13. Check/Enable 'SAP>UX>Guided Answer:Open in New Tab 
14. Close Settings
15. Open the 'Command Palette'
16. Enter 'SAP: Open Guided Answers'
17. Select 'SAP: Open Guided Answers' ( See expected result 5 ) 

### Open Guided Answers in SBAS

2. Open the 'Command Palette'
3. Enter 'SAP: Open Guided Answers'
4. Select 'SAP: Open Guided Answers' ( See expected result 3 ) 
5. Make view port smaller ( See expected results 2 ) 
6. Open the 'Command Palette'
7. Enter 'SAP: Open Guided Answers'
8. Select 'SAP: Open Guided Answers' ( See expected result 4 ) 
9. Click on menu icon in side tool bar
10. Select File
11. Select Preferences
12. Click Settings in menu 
13. Enter 'Guided Answers' in the setting search input field 
14. Check/Enable 'SAP>UX>Guided Answer:Open in New Tab 
15. Close Settings
16. Open the 'Command Palette'
17. Enter 'SAP: Open Guided Answers'
18. Select 'SAP: Open Guided Answers' ( See expected result 5 ) 


**Expected Results 1** 
Guided Answers extension opens in view port displaying a home page containing 
    a. SAP logo and Guided Answers 
    b. An Empty search input field

**Expected Results 2** 
The search input field falls under the SAP Guided Answers Extension 


**Expected Results 3** 
Guided Answers extension opens in view port
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    

**Expected Results 4** 
If the Guided Answers extension is already open in the existing view port is given focus. A new instance of the GA extension is not opened the existing instance is re used. 

**Expected Results 5**
Guided Answers extension open in a new view port. Two instances of the Guided Answers Extension are opened.




### Search Guided Answers Content
1. Open Guided Answers Extension
2. Enter 'SAP Fiori Tools' in search fields (See expected result 1)
3. Click on SAP logo  ( See expected result 2) 

**Expected Results 1**
The view port displays

    a. A list containing guides that are related to the 'SAP Fiori Tools' search criteria. 'SAP Fiori tools' , 'SAP Fiori tools - Application Preview' and 'Configuring the UI of a Fiori Element Application' should appear in the list
    b. The name of the Guided Answer should appear in the list 
    c. The description of the Guided Answer  should appear in the list
    d. The Product the Guided Answer is associated to
    e. The Component the Guided Answer is associated to

**Expected Results 2**
 Guided Answers Home page is displayed containing 
 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    

### Filtering Guided Answers Content on Product 
1. Open Guided Answers Extension 
2. Enter 'Fiori Tools' in search input field
3. Click on Product Filter ( See expected result 1 ) 
4. Enter 'Fiori Tools' in the pop up search bar (See expected result 2)
5. Check 'SAP Fiori Tools'
6. Click 'Appy Filter'( See expected result 3)
7. Click 'Clear Filter' ( See expected result 4)
8. Click on SAP logo  ( See expected result 5)
   
**Expected result 1**
A pop up appears containing all products that the returned Guided Answers list are associated to

**Expected result 2**
Only SAP Fiori Tools appears in Product list

**Expected result 3**
Text appears informing the user that the outcomes list has been filtered on product 'SAP Fiori Tools' 
All outcomes appearing in the list are associated to the product 'SAP Fiori Tools' 

**Expected result 4**
The outcome list is refreshed displaying all Guided Answers closely mathcing the Guided Answers search input

**Expected result 5**
 Guided Answers Home page is displayed containing 
 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    



### Filtering Guided Answers Content on Components 

1. Open Guided Answers Extension 
2. Enter 'Fiori tools' in search input field
3. Click on Component Filter ( See expected result 1 ) 
4. Enter 'CA-UX-IDE' in the pop up search bar (See expected result 2)
5. Check 'CA-UX-IDE'
6. Click 'Appy Filter'( See expected result 3)
7. Click 'Clear Filter' ( See expected result 4)
8. Click on SAP logo  ( See expected result 5)

**Expected result 1**
A pop up appears containing all components that the returned Guided Answers list are associated to

**Expected result 2**
Only component 'CA-UX-IDE' appears in list 

**Expected result 3**
Text appears informing the user that the outcomes list has been filtered on component 'CA-UX-IDE' 
All outcomes appearing in the list are associated to the product 'CA-UX-IDE' 

**Expected result 4**
The outcome list is refreshed displaying all Guided Answers closely mathcing the Guided Answers search input

**Expected result 5**
 Guided Answers Home page is displayed containing 
 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    

### Filtering Guided Answers Content on Products and Components 

1. Open Guided Answer Extension
2. Enter 'SAP Business Application Studio' in search input field
3. Click on Product Filter
4. Enter 'SAP Business Application Studio' in product pop up input field
5. Click Apply Filter
6. Click on Component Filter ( See expected results 1 ) 
7. User selects 'CA-WDE'
8. Click Apply Filter ( See expected results 2)
9. Click on SAP logo  ( See expected result 3)

**Expected result 1**
Component Filter pop up opens displaying all the components associated to the outcomes list that is filtered on 'SAP Business Application Studio. 
This list contains 

        a. CA-BAS

Note: This list is subject to change based on Guided Answers being continually added for different products and components

**Expected result 2**
Text informing the user the outcomes list is filtered on 'SAP Business Application Studio' and the component 'CA-BAS'. The outcomes list displays outcomes associated to 'SAP Business Application Studio' and components 'CA_BAS' 

**Expected result 3**
 Guided Answers Home page is displayed containing 
 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    



### Open Guided Answers Content and Last visited content

1. Open Guided Answers Extension ( See expected results 1 ) 
3. Enter SAP Fiori Tools in search
4. Select SAP Fiori Tools Guided Answer in the list ( See expected result 2)
5. Select an outcome of the first node of the Guided Answer (See expected result 3)
6. Select multiple outcomes in the Guided Answer Tree  - SBAS -> Services unavailable , All catalog service request failed
7. Click 'Step back' ( See expected result 4)
8. Click on a node in the tree component ( See expected result 5) - Fiori Generator
9. Click 'Restart' ( See expected result 6)
10. Click 'Step back' ( See expected results 7) 
11. Select SAP Fiori Tools Guided Answer in the list ( See expected result 2)
12. Click Home icon ( See expected results 8 )
13. Click on last visited Guide ( See expected result 2)
14. Select an outcome of the first node of the Guided Answer (See expected result 3)
15. Click Home icon ( See expected results 9 )
16. Click on last visited Guide ( See expected result 2)
17. Click on 'Step back'  ( See expected result 4)
18. Click on 'Step back' ( See expected results 10) 

**Expected Result 1**
 Guided Answers Home page is displayed containing 
 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    
**Expected Result 2**
View port now displays
    a. 'Home' icon, 'Step back' , Feedback icon, Share link and Bookmark star 
    b. Guided Answers content tree showing the first node of the Guided Answer Tree
    c. The title of the Guided Answer - SAP Fiori Tools
    d. The content of the first Guided Answer node
    e. The outcomes of the Guided Answer content  - Generation of SAP SAP Fiori Application , Deployment of SAP Fiori Application, Preview of SAP Fiori application, Configuration of SAP Fiori application

**Expected Result 3**
The contents of that outcome/node is displayed  

    a. 'Home' icon, 'Step back' , Restart , Feedback icon, Share link and Bookmark star 
    b. Guided Answers content tree showing the first node of the Guided Answer Tree and the outcome the user selected is underlined in blue - Fiori Genearator
    c. The contents of the Guided Answer
           1. Images
           2. Bullet points
           3. Paragraphs
           4. Videos
    d. The content of the Guided Answer content 
    e. The outcomes of the Guided Answer content 

Note: Check the content matches the content in the web application e.g. headers , bullet points , images , scrolling the content

**Expected result 4**
The user is returned to the previous node of the tree content  

**Expected result 5**
The user is navigated to the node in the Guided Answer Tree  

**Expected result 6**
The user is returned to the start of the Guided Answer  

View port now displays
    a. 'Home' icon, 'Step back' , Feedback icon, Share link and Bookmark star 
    b. Guided Answers content tree showing the first node of the Guided Answer Tree
    c. The title of the Guided Answer - SAP Fiori Tools
    d. The content of the first Guided Answer node
    e. The outcomes of the Guided Answer content  - Generation of SAP SAP Fiori Application , Deployment of SAP Fiori Application, Preview of SAP Fiori application, Configuration of SAP Fiori application

**Expected result 7**
The user is navigated to the Guided Answers home search list with 'SAP Fiori Tools ' in the search input field.

**Expected result 8**
 Guided Answers Home page is displayed containing 
 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. Last visited section  displaying the last visited node e.g. The first node of the SAP Fiori Tools tree - "SAP Fiori Tools - SAP Fiori Tools"
    d. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    
**Expected result 9**
 Guided Answers Home page is displayed containing 
 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. Last visited section  displaying the last visited node e.g. The first node of the SAP Fiori Tools tree - "SAP Fiori Tools - Fiori Generator"
    d. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    
**Expected result 10**
The user is navigated to the Guided Answers search list with nothing in the search input list


### Open Quick Filter 

_SBAS_
1. Open GA extension ( See expected results 1)
2. Click on Quick Filter Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE  (See expected results 2)
3. Enter search criteria (See expected results 3)
4. Click Clear Filters (See expected results 4)
5. Click on SAP Logo (See expected results 5)
6. Click on Quick Filter Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE  (See expected results 2)
7. Click on SAP Logo (See expected results 5)

**Expected result 1**
Guided Answers Home page is displayed containing 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    
**Expected result 2**
Guided Answer view port displays
    a. A list containing guides that are related to the components CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    b. Clear Filter link
    c. The name of the Guided Answer should appear in the list 
    d. The description of the Guided Answer  should appear in the list
    e. The Product the Guided Answer is associated to
    f. The Component the Guided Answer is associated to
    
**Expected result 3**
Guided Answer view port displays
    a. A list containing guides that are related to the components CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE and search input 'SAP Fiori Tools'
    b. Clear Filter link
    c. The name of the Guided Answer should appear in the list 
    d. The description of the Guided Answer  should appear in the list
    e. The Product the Guided Answer is associated to
    f. The Component the Guided Answer is associated to
    
**Expected result 4**
Guided Answer view port displays
    a. A list containing guides that are related to the search input 'SAP Fiori Tools'
    b. Clear Filter link
    c. The name of the Guided Answer should appear in the list 
    d. The description of the Guided Answer  should appear in the list
    e. The Product the Guided Answer is associated to
    f. The Component the Guided Answer is associated to

**Expected result 5**
Guided Answers Home page is displayed containing 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE


### The Guided Answer solved the issue

1. Open GA extension
2. Select a Guided Answer in the List
3. Navgate through a Guided Answer until there is no more outcomes to select
4. Click 'This solved my issue' ( See Expected Result 1)
5. Click Home button ( See Expected Result 2)  or Click Close button ( See Expect Result 3 )

**Expected result 1**
Pop up appears containing
 a. Text - 'Thanks! We are glad to hear that your issue has been resolved and we hope that you enjoying using the Guided Answers application'
 b. A 'Home' Button
 c. A Close Button
 
 **Expected result 2**
The user is navigated to the home page

Guided Answers Home page is displayed containing 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. Last visited section  displaying the last visited node e.g. the last node of the tree
    d. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    
Verify that the submission of the 'This solved my issue' is captured in the backend with the GA content creator of the outcome that you selected.
 
 **Expected result 3**
The user is navigated to the home page



### The Guided Answer did not solve the issue

1. Open GA extension
2. Search and Select a Guided Answer in the List
3. Navgate through a Guided Answer until there is no more outcomes to select
4. Click 'This did not resolve my issue' ( See Expected Result 1)
5. Click on option  'Open and Incident'( See Expected Result 2)
6. Click on option  'Search for Another Guided Answer'( See Expected Result 2)

**Expected result 1**
User is navigated to a new node 
    a. Node Heading  'The issue was not resolved'
    b. Description of the Node: 'We are sorry to hear that your issue was not yet resolved. There are several options to getting further assistance' 
    c. A list of options e.g Start Expert Chart,  Schedule an Expert, Open an Incident, Ask the SAP Community, Search for Another Guided Answer

**Expected result 2**
User is navigated to a browswer where the user can continue with the option they selected.
Note: Verify that the submission of the 'This did not solve my issue' is captured in the backend with the GA content creator of the outcome that you selected.

**Expected result 3**
User is navigated back to the Guided Answer Extension Home page

Guided Answers Home page is displayed containing 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. Last visited section  displaying the last visited node e.g. the last node of the tree
    d. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    

### Submiting General Feedback on Guided Answer
1. Open GA extension
2. Search and Select a Guided Answer in the List
3. Navgate through a Guided Answer 
4. Click Comment Icon ' ( See Expected Result 1)
5. Enter text in Suggestion box ( See Expected Result 2)
6. Click 'Send' ( See Expected Result 3) or Click 'Close' ( See Expected Result 4)

**Expected result 1**
Pop up appears containing
 a. Heading - Is this content helpful?
 b. Text - If you have suggestions on how to improve this content we would love to hear them!
 c. Text Input field - Suggestion
 d. A 'Send' Button
 e. A 'Close' Button
 
**Expected result 2**
Text appears in suggestion input field
Pop up stretches in size dependent on the amount text inputted. Scroll bar appears on pop up if text inputed is longer than the height of the screen

**Expected result 3**
Message Sent pop up appears.
Note: Verify that the submission of the general feedback is captured in the backend with the GA content creator of the outcome that you selected.
The text submitted, the node in the Guided Answer Tree the feedback was submitted on and the date and time 

**Expected result 4**
Gemeral Feedback pop up closes.


### Bookmarking Guides

_Adding a Bookmark_

1. Open GA extension in VSCode/SBAS  
2. Search for SAP Fiori Tools
3. Select  SAP Fiori Tools Guided Answer in the returned ist
4. Navgate through a Guided Answer ( Fiori Tools - > Deployment ->SBAS -> ABAP -> Request failed with status code 400 - Archive not okay) 
5. Click on star icon(See expected results 1)
6. Click on Home icon ( See expected results 2)
7. Close GA extension
8. Open GA extension ( See expected results 3)
9. Search for SAP Fiori Tools  ( See expected results 9)
10. Click on SAP Logo ( See expected results 10 ) 
11. Click on the bookmark ( See expected result 4) 
12. Click on the star icon ( See expected results 5)
13. Click on Home icon (See expected results 6)
14. Click on last visited Guided Answer (See expected results 4)
15. Click on star icon (See expected results 1)
16. Click on Home icon ( See expected results 2)
17. Click on Star icon opposited book marked guide  ( See expected results 7)
18. Close GA extension 
19. Open GA extension (See expected results 8)

**Expected Result 1**
Star icon is turned yellow 

**Expected Results 2**
Guided Answers Home page is displayed containing 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. Last visited section  displaying the last visited node e.g. SAP Fiori Tools - Archive not okay
    d. Bookmarks section displaying - SAP Fiori Tools - Archive not okay
    e. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    
**Expected Results 3**
Guided Answers Home page is displayed containing 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. Last visited section  displaying the last visited node e.g. SAP Fiori Tools - Archive not okay
    d. Bookmarks section displaying - SAP Fiori Tools - Archive not okay
    e. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    
**Expected Results 4**
The Guided Answer extension opens the node  "Request failed with status code 400 - Archive not okay"

**Expected Results 5**
Star icon is no longer yellow in colour

**Expected Results 6**
Guided Answers Home page is displayed containing 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. Last visited section  displaying the last visited node e.g. SAP Fiori Tools - Archive not okay
    d. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    
**Expected Results 7**
Guided Answers Home page is displayed containing 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. Last visited section  displaying the last visited node e.g. SAP Fiori Tools - Archive not okay
    d. Bookmarks section displaying bookmard guided e.g. SAP Fiori Tools - Archive not okay with the star icon not filled with yellow
    e. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    
**Expected Results 8**
Guided Answers Home page is displayed containing 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. Last visited section  displaying the last visited node e.g. SAP Fiori Tools - Archive not okay
    d. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE

**Expected Results 9**
The view port displays

    a. A list containing guides that are related to the 'SAP Fiori Tools' search criteria. 'SAP Fiori tools' , 'SAP Fiori tools - Application Preview' and 'Configuring the UI of a Fiori Element Application' should appear in the list
    b. SAP Fiori Tools guided has a yellow star 
    c. The name of the Guided Answer should appear in the list 
    d. The description of the Guided Answer  should appear in the list
    e. The Product the Guided Answer is associated to
    f. The Component the Guided Answer is associated to

**Expected Results 10**
Guided Answers Home page is displayed containing 
    a. SAP Logo and Guided Answers
    b. Empty search input field
    c. Last visited section  displaying the last visited node e.g. SAP Fiori Tools - Archive not okay
    d. Bookmarks section displaying bookmard guided e.g. SAP Fiori Tools - Archive not okay with the star icon not filled with yellow
    e. SBAS - A quick filters section containing a filter on Component: CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    
### Sharing Guided Answer content 

_VSCode and SBAS_

1. Open GA extension in VSCode/SBAS  
2. Search for SAP Fiori Tools
3. Select a SAP Fiori Tools Guided Answer in the returned ist
4. Navgate through a Guided Answer ( Fiori Tools - > Deployment ->SBAS -> ABAP -> Request failed with status code 400 - Archive not okay) 
5. Click on 'Copy this link' icon (See expected results 1)
6. Click on copy to clipboard icon (See expected results 2)
7. Click on Home icon
8. Paste link in the search input field (See expected results 3)
12. Click on Home icon 
13. Search for SAP Fiori Tools
3. Select a SAP Fiori Tools Guided Answer in the returned ist
14. Navgate through a Guided Answer ( Fiori Tools - > Deployment ->SBAS -> ABAP -> Request failed with status code 400 - Archive not okay)
15. Click on link icon (See expected results 1)
16. Click on 'Copy link with instructions' icon ( See expected results 2)
17. Paste copied instructions in notepad ( See expected results 8)
18. Copy link in instructions and paste link in the search input field ( see expected results 3)
19. Navigate to another node in the tree
20. Click on link icon
21. Highlight the link in the text input field and press Ctrl+C / Command+C
22. Click on Home icon
23. Paste link in the search input field (See expected results 4)
24. Navigate to another node in the tree
25. Click on the link icon 
26. Click on 'View on the GA website' link (See expected results 7)


_VSCode environment_
1. Open GA extension in VSCode  
2. Search for SAP Fiori Tools
3. Select a SAP Fiori Tools Guided Answer in the returned ist
4. Navgate through a Guided Answer ( Fiori Tools - > Deployment ->SBAS -> ABAP -> Request failed with status code 400 - Archive not okay) 
5. Click on link icon (See expected results 1)
6. Click on copy to clipboard icon (See expected results 2)
7. Paste link in notepad (See expected results 9)
2. Click on the link (See expected results 5) 
3. Click Open in 'Allow extensiont to open URI' pop up (See expected results 6) 
12. Click on Home icon 
13. Search for SAP Fiori Tools
14. Select a SAP Fiori Tools Guided Answer in the returned ist
15. Navgate through a Guided Answer ( Fiori Tools - > Deployment ->SBAS -> ABAP -> Request failed with status code 400 - Archive not okay)
16. Click on link icon (See expected results 1)
17. Click on Copy link with instructions icon ( See expected results 2)
18. Paste copied instructions in notepad ( See expected results 8)
19. Follow VSCode instructions and click on VSCode link ( See expected results 5) 
20. Click Open in 'Allow extension to open URI' pop up( See expected results 6) 

**Expected result 1**
'Share this guide' pop up appears displaying 
a. Guided Answer link in a text input field, 
b. 'Copy this link' icon 
c. 'Copy link with instructions' icon.
d. The following description text will also be displayed - 'Copy this link to share via email or messages. When pasted into the search input field of the Guided Answers extension, it will navigate you straight to this node.’ 
e. A link 'View on the GA website' will also appear in the pop up 

**Expected result 2**
Notification appears that the link was copied to the clipboard

**Expected result 3**
Node for that tree opens automatically. 'Request failed with status code - Archive not okay' 

**Expected result 4**
Node for that tree opens automatically.

**Expected result 5**
VSCode will be launched.

Note: VSCode must installed.

**Expected result 6**
The Guided Answer extension will be open displaying the content that was shared 

Note VSCode must be installed.

**Expected result 7**
The Guided Answer tree opens in browser window, showing the node content and the node path.

**Expected result 8**
The following instructions will appear in the notepad

_To resolve your reported issue, open Guided Answers extension by SAP, and follow the steps mentioned in the guide.
->If your IDE is VSCode, please click on the following link: "vscode://saposs.sap-guided-answers-extension#/tree/3046/actions/45995:45996:50742:46000:46005"
->If your IDE is SAP Business Application Studio, then:
  a. Launch Guided Answers via the command "SAP: Open Guided Answers"
  b. Paste the following guide shortlink into the search input field: "vscode://saposs.sap-guided-answers-extension#/tree/3046/actions/45995:45996:50742:46000:46005"

**Expected result 9**
The following link will appear in the notepad
vscode://saposs.sap-guided-answers-extension#/tree/3046/actions/45995:45996:50742:46000:46005 


### Navigating to another Guided Answer Tree or External content

Note: This test is testing specific links within a specific Guided Answer. The links within this Guided Answer be changed by external content creators.

1. Open Guided Answer Extension
2. Enter "vscode://saposs.sap-guided-answers-extension#/tree/2827/actions/41344:41346:57775:57776" into search input field
3. Scroll down to the bottom of the guide and click on 'Configure an SAP BTP Destination' ( See expected results 1)
4. Navigate back to 'Destination configuration in SAP BTP cockpit' node  using step back button
5. Click on 'Connecting to External Systems' ( See Expected Results 2 ) 

**Expected Results 1**
Guided Answer content is opened within the Guided Answer Extension. The tree component displays the navigation path from the previous Guided Answer guide to the new Guided Answers guide.
SAP Business Application Studio Troubleshooting -> Connectivity Troblesshooting -> Problems Connecting to External Systems -> Destination configuration in the SAP BTP cockpit -> SAP Fiori Tools -> Fiori Geneartor-> Application Generation in SAP Business Application -> The destination is mis-configured.

**Expected Results 2**
Browser window opens display external content.

### Displaying HTML and Node enhancements specific to VSCode or SAP Business Application Studio

Pre Req Open VSCode, Install Fiori Tools Extension Pack 

_VSCODE WITH FIORI TOOLS INSTALLED_

Pre Req: Create or Import a project

3. Open Guided Answer Extension
4. Enter Fiori Tools in search input field and press enter
5. Open Guided Answer Extension
6. Click on Fiori Generator outcome
7. Click on Services unavailable, All catalog service requests failed' outcome( See expected results 1)
8. Click Restart
9. Click Deployment of SAP Fiori application
10. Click SAP Business Application Studio
11. Click ABAP on Premise
12. Click Request failed with status code 400 - Archive not okay ( See expected results 2)
13. Click on 'Fiori: Archive project' link ( See expected results 3)
14. Click on Node Enhancement ( See expected results 3)
15. Reduce the Guided Answers extension view ( See expected results 3a)
16. Hover mouse on Node Enhancement icon  ( See expected results 3b)


_VSCODE WITH FIORI TOOLS NOT INSTALLED_

Pre Req: Create or Import a project

3. Open Guided Answer Extension
4. Enter Fiori Tools in search input field and press enter
5. Open Guided Answer Extension
9. Click on Deployment of SAP Fiori application
10. Click SAP Business Application Studio
11. Click ABAP on Premise
12. Click Request failed with status code 400 - Archive not okay ( See expected results 4)

_SAP BUSINESS APPLICATION STUDIO _ FIORI DEV SPACE_

1. Open SAP Business Application Studio
2. Create Fiori Dev Space or any dev space
3. Open Guided Answer Extension
4. Click on Fiori Generator outcome
5. Click on Services unavailable, All catalog service requests failed' outcome ( See expected results 5)
6. Click on 'Fiori: Open Environment Check' ( See expected results 6) 
7. Click on Environment Check node enhancment ( See expected results 7)


_SAP BUSINESS APPLICATION STUDIO _ FIORI DEV SPACE_

1. Open SAP Business Application Studio
2. Create Fiori Dev Space or any dev space
3. Open Guided Answer Extension
4. Click on Fiori Generator outcome
5. Click on Services unavailable, All catalog service requests failed' outcome ( See expected results 8)


**Expected result 1**
The "Fiori: Open Environment Check" does not appear as a clickable link in VSCODE 
No node enhancements appear

**Expected result 2**
'Fiori: Archive Project"  appears as a clickable link
 Node enhancements appear Archive Project - Create a zip of your project
 
**Expected result 3** 
Imported/Created project is ziped and available for download

**Expected result 3a** 
Node Enhancment reduce in size showing just the node enhancment icon. 

**Expected result 3b** 
Label of Node Enhancement appears in tooltip on hover. 

**Expected result 4**
The "Fiori: Archive Project" does not appear as a clickable link in the SBAS  
Node enhancements do not appear  as  Application modeler is not installed

**Expected result 5**
The "Fiori: Open Environment Check" appears as a clickable link in the SBAS  
Node enhancements appears 
 
**Expected result 6**
The command palette open showing two options Check Destination, Gathere Development Environment information
 
**Expected result 7**
The "Fiori: Open Environment Check" does not appear as a clickable link as Application Modeler is not installed in this dev space and Environment Check node enhancement doesn't appear . 


### GA API Exception Handling

_VSCODE_
1. Open the 'Command Palette'
2. Enter 'SAP: Open Guided Answers'
3. Select 'SAP: Open Guided Answers' 
4. Enter Fiori Tools in Search input field ( See expected result 1 ) 
5. Select Code in VSCode Nav bar
6. Select Settings in drop down menu
7. Click Settings in menu 
8. Enter 'Guided Answers' in the setting search input field 
9. Enter 'https://ga.support.sap.comXXX' in the SAP Guided Answers API host input field
10. Close settings
11. Open the 'Command Palette'
12. Enter 'SAP: Open Guided Answers'
13. Select 'SAP: Open Guided Answers' 
14. Enter Fiori Tools in Search input field ( See expected result 2 ) 

_SBAS_
1. Open the 'Command Palette'
2. Enter 'SAP: Open Guided Answers'
3. Select 'SAP: Open Guided Answers' 
4. Enter Fiori Tools in Search input field ( See expected result 1 ) 
9. Click on menu icon in side tool bar
10. Select File
11. Select Preferences
12. Click Settings in menu 
13. Enter 'Guided Answers' in the setting search input field 
7. Click Settings in menu 
8. Enter 'Guided Answers' in the setting search input field 
9. Enter 'https://ga.support.sap.comXXX' in the SAP Guided Answers API host input field
10. Close Settings
11. Open the 'Command Palette'
12. Enter 'SAP: Open Guided Answers'
13. Select 'SAP: Open Guided Answers' 
14. Enter Fiori Tools in Search input field ( See expected result 2 ) 

**Expected result 1**
List of Guided Answers are returned

**Expected result 2**
Message 'Guided Answers is currently unavailable - Please Try Again later ' is displayed along with a search icon with a sad face.
