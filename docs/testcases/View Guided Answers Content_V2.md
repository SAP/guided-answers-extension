
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
[#230](https://github.com/SAP/guided-answers-extension/issues/230)

Prerequisites: Guided Answers Extension is installed in either SAP Business Application Studio (SBAS) or Microsoft Visual Studio Code (VSCODE)



### Open Guided Answers (SBAS and VSCODE)


1. Open VSCode or SAP Business Application Studio
1. Open the 'Command Palette'
2. Eneter 'SAP: Open Guided Answers'
3. Select 'SAP: Open Guided Answers' ( See expected result 1 ) 
4. Make view port smaller ( See expected results 2 ) 


**Expected Results 1** 

Guided Answers extension opens in view port
    a. A blank home page 
    b. Empty search input field
    c. A grid icon for the Product filter
    d. A id icon for the Component filter

**Expected Results 2** 
  
The search input field falls under the SAP Guided Answers Extension 
    
    
    
 
### Search Guided Answers Content

1. Open Guided Answers Extension
2. Enter 'SAP Fiori Tools' in serch fields (See expected result 1)


**Expected Results 1**

The view port displays

    a. A list containing guides that are related to the 'SAP Fiori Tools' search criteria.
    b. The name of the Guided Answer should appear in the list 
    b. The description of the Guided Answer  should appear in the list
    c. The Product the Guided Answer is associated to
    d. The Component the Guided Answer is associated to





### Filtering Guided Answers Content on Product 

1. Open Guided Answers Extension 
2. Enter 'Fiori Tools' in search input field
3. Click on Product Filter ( See expected result 1 ) 
4. Enter 'Fiori Tools' in the pop up search bar (See expected result 2)
5. Check 'SAP Fiori Tools'
6. Click 'Appy Filter'( See expected result 3)
7. Click 'Clear Filter' ( See expected result 4)


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
2. Enter 'Fiori tools' in search input field
3. Click on Component Filter ( See expected result 1 ) 
4. Enter 'CA-UX-IDE' in the pop up search bar (See expected result 2)
5. Check 'CA-UX-IDE'
6. Click 'Appy Filter'( See expected result 3)
7. Click 'Clear Filter' ( See expected result 4)

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
2. Enter 'SAP Business Application Studio' in search input field
3. Click on Product Filter
4. Enter 'SAP Business Application Studio' in product pop input field
5. Click Apply Filter
6. Click on Component Filter ( See expected results 1 ) 
7. User selects 'CA-WDE'
8. Click Apply Filter ( See expected results 2)


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

1. Open GA
2. Enter SAP Fiori Tools in search
3. Select SAP Fiori Tools Guided Answer in the list ( See expected result 1)
4. Select an outcome of the first node of the Guided Answer (See expected result 2)
5. Select multiple outcomes in the Guided Answer Tree 
5. Click 'Step back' ( See expected result 3)
6. Click on a  node in the tree component ( See expected result 4)
7. Click 'Restart' ( See expected result 5)
7. Click Home icon


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
   
  
  
  
  
### Displaying enhancements specific to VSCode or SAP Business Application Studio

Pre Req Open VSCode, Install Fiori Tools Extension Pack 

_VSCODE_

1. Open VSCode
2. Open Guided Answer Extension
2. Enter Fiori Tools in search input field and press enter
3. Click on Fiori Generator outcome
4. Click on 'In SAP Business Application Studio - Services unavailable, All catalog service requests failed' ( See expected results 1)

**Expected result 1**

The "Fiori: Open Environment Check" does not appear as a clickable link in VSCODE 


_SAP Business Appliction Studio Fiori Dev Space_

1. Open SAP Business Application Studio
2. Create Fiori Dev Space
3. Open Guided Answer Extension
4. Click on Fiori Generator outcome
5. Click on 'In SAP Business Application Studio - Services unavailable, All catalog service requests failed' ( See expected results 2)

**Expected result 1**

 The "Fiori: Open Environment Check" appears as a clickable link in the SBAS  

_SAP Business Appliction Studio Low Code Dev Space_

1. Open SAP Business Application Studio
2. Create Fiori Dev Space
3. Open Guided Answer Extension
4. Click on Fiori Generator outcome
5. Click on 'In SAP Business Application Studio - Services unavailable, All catalog service requests failed' ( See expected results 2)

**Expected result 1**

The "Fiori: Open Environment Check" does not appear as a clickable link as Application Modeler is not installed in this dev space. 
