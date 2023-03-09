
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
[#137](https://github.com/SAP/guided-answers-extension/issues/137)

Prerequisites: Guided Answers Extension is installed in either SAP Business Application Studio (SBAS) or Microsoft Visual Studio Code (VSCODE)



### Open Guided Answers in VSCODE

1. Open VSCode
1. Open the 'Command Palette'
2. Enter 'SAP: Open Guided Answers'
3. Select 'SAP: Open Guided Answers' ( See expected result 1 ) 
4. Make view port smaller ( See expected results 2 ) 

### Open Guided Answers in SBAS

1. Open SAP Business Application Studio
1. Open the 'Command Palette'
2. Enter 'SAP: Open Guided Answers'
3. Select 'SAP: Open Guided Answers' ( See expected result 3 ) 
4. Make view port smaller ( See expected results 2 ) 


**Expected Results 1** 

Guided Answers extension opens in view port
    a. A blank home page 
    b. Empty search input field
    c. A grid icon for the Product filter
    d. A id icon for the Component filter

**Expected Results 2** 

The search input field falls under the SAP Guided Answers Extension 


**Expected Results 3** 

Guided Answers extension opens in view port
    a. A component filter is applied  CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE
    b. A list of Guided Answer Content associated to the components CA-FE-FAL, CA-FE-FLP-EU, CA-FE-FLP-DT, CA-UI2-INT-BE, CA-UI2-INT-FE, CA-UI2-THD, CA-UX-IDE appears
    b. Empty search input field
    c. A grid icon for the Product filter
    d. A id icon for the Component filter . Id icon is highlighted in blue as Component filter is applied by default.





### Search Guided Answers Content

1. Open Guided Answers Extension
2. Clear filters if filters have been applied e.g. SBAS default component filters.
3. Enter 'SAP Fiori Tools' in search fields (See expected result 1)

**Expected Results 1**

The view port displays

    a. A list containing guides that are related to the 'SAP Fiori Tools' search criteria. 'SAP Fiori tools' , 'SAP Fiori tools - Application Preview' and 'Configuring the UI of a Fiori Element Application' should appear in the list
    b. The name of the Guided Answer should appear in the list 
    b. The description of the Guided Answer  should appear in the list
    c. The Product the Guided Answer is associated to
    d. The Component the Guided Answer is associated to





### Filtering Guided Answers Content on Product 

1. Open Guided Answers Extension 
2. Clear filters if filters have been applied e.g. SBAS default component filters.
3. Enter 'Fiori Tools' in search input field
4. Click on Product Filter ( See expected result 1 ) 
5. Enter 'Fiori Tools' in the pop up search bar (See expected result 2)
6. Check 'SAP Fiori Tools'
7. Click 'Appy Filter'( See expected result 3)
8. Click 'Clear Filter' ( See expected result 4)

**Expected result 1**

A pop up appears containing all products that the returned Guided Answers list are associated to

**Expected result 2**

Only SAP Fiori Tools appars in Product list

**Expected result 3**

Text appears informing the user that the outcomes list has been filtered on product 'SAP Fiori Tools' 
All outcomes appearing in the list are associated to the product 'SAP Fiori Tools' 

**Expected result 4**

The outcome list is refreshed displaying all Guided Answers closely mathcing the Guided Answers search input





### Filtering Guided Answers Content on Components 

1. Open Guided Answers Extension 
2. 2. Clear filters if filters have been applied e.g. SBAS default component filters.
3. Enter 'Fiori tools' in search input field
4. Click on Component Filter ( See expected result 1 ) 
5. Enter 'CA-UX-IDE' in the pop up search bar (See expected result 2)
6. Check 'CA-UX-IDE'
7. Click 'Appy Filter'( See expected result 3)
8. Click 'Clear Filter' ( See expected result 4)

**Expected result 1**
A pop up appears containing all components that the returned Guided Answers list are associated to

**Expected result 2**
Only component 'CA-UX-IDE' appears in list 

**Expected result 3**
Text appears informing the user that the outcomes list has been filtered on component 'CA-UX-IDE' 
All outcomes appearing in the list are associated to the product 'CA-UX-IDE' 

**Expected result 4**
The outcome list is refreshed displaying all Guided Answers closely mathcing the Guided Answers search input





### Filtering Guided Answers Content on Products and Components 

1. Open Guided Answer Extension
2. Clear filters if filters have been applied e.g. SBAS default component filters.
3. Enter 'SAP Business Application Studio' in search input field
4. Click on Product Filter
5. Enter 'SAP Business Application Studio' in product pop input field
6. Click Apply Filter
7. Click on Component Filter ( See expected results 1 ) 
8. User selects 'CA-WDE'
9. Click Apply Filter ( See expected results 2)

**Expected result 1**
Component Filter pop up opens displaying all the components associated to the outcomes list that is filtered on 'SAP Business Application Studio. 
This list contains 

        a. CA-WDE
        b. BC-NEO-CPT
        c. HAN-WDE-DOC

Note: This list is subject to change based on Guided Answers being continually added for different products and components

**Expected result 2**
Text informing the user the outcomes list is filtered on 'SAP Business Application Studio' and the component 'CA-WDE'. The outcomes list displays outcomes associated to 'SAP Business Application Studio' and components 'CA_WDE' 





### Open Guided Answers Content 

1. Open Guided Answers Extension
2. Clear filters if filters have been applied e.g. SBAS default component filters.
3. Enter SAP Fiori Tools in search
4. Select SAP Fiori Tools Guided Answer in the list ( See expected result 1)
5. Select an outcome of the first node of the Guided Answer (See expected result 2)
6. Select multiple outcomes in the Guided Answer Tree 
7. Click 'Step back' ( See expected result 3)
8. Click on a  node in the tree component ( See expected result 4)
9. Click 'Restart' ( See expected result 5)
10. Click Home icon


**Expected Result 1**

View port now displays
    a. 'All Answers' link
    b. Guided Answers content tree showing the first node of the Guided Answer Tree
    c. The title of the Guided Answer
    d. The content of the first Guided Answer node
    e. The outcomes of the Guided Answer content 

Note: Check the content matches the content in the web application e.g. headers , bullet points , images 

**Expected Result 2**

The contents of that outcome/node is displayed  

    a. 'All Answers' link
    b. 'Step back' and 'Restart' Link 
    c. Guided Answers content tree showing the first node of the Guided Answer Tree and the outcome the user selected is underlined in blue 
    c. The contents of the Guided Answer
           1. Images
           2. Bullet points
           3. Paragraphs
           4. Videos
    d. The content of the first Guided Answer content 
    e. The outcomes of the Guided Answer content 

Note: Check the content matches the content in the web application e.g. headers , bullet points , images , scrolling the content


**Expected result 3**

The user is returned to the previous node of the tree content  

**Expected result 4**

The user is returned to the start of the Guided Answer  

**Expected result 4**

The user is navigated to the node in the Guided Answer Tree  

**Expected result 5**

The user is returned to the start of the Guided Answer  

**Expected result 6**

The user is navigated to the Guided Answers home page to an empty search bar




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
 b. A 'Send' Button
 c. A 'Close' Button
 
**Expected result 2**
Text appears in suggestion input field
Pop up stretches in size dependent on the amount text inputted. Scroll bar appears on pop up if text inputed is longer than the height of the screen

**Expected result 3**
Message Sent pop up appears.
Note: Verify that the submission of the general feedback is captured in the backend with the GA content creator of the outcome that you selected.
The text submitted, the node in the Guided Answer Tree the feedback was submitted on and the date and time 

**Expected result 4**
Gemeral Feedback pop up closes.





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
The "Fiori: Archive Project" appears doesnot appear as a clickable link in the SBAS  
Node enhancements do not appear  as  Application modeler is not installed

**Expected result 5**
The "Fiori: Open Environment Check" appears as a clickable link in the SBAS  
Node enhancements appears 
 
**Expected result 6**
The command palette open showing two options Check Destination, Gathere Development Environment information
 
**Expected result 7**
The "Fiori: Open Environment Check" does not appear as a clickable link as Application Modeler is not installed in this dev space and Environment Check node enhancement doesn't appear . 
