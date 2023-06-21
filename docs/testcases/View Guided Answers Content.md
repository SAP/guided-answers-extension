
### Associated user stories 
[#60](https://github.com/SAP/guided-answers-extension/issues/60),
[#89](https://github.wdf.sap.corp/ux-engineering/tools-suite/issues/89),
[#90](https://github.wdf.sap.corp/ux-engineering/tools-suite/issues/90),
[#91](https://github.wdf.sap.corp/ux-engineering/tools-suite/issues/91),
[#143](https://github.wdf.sap.corp/ux-engineering/tools-suite/issues/143),
[#164](https://github.wdf.sap.corp/ux-engineering/tools-suite/issues/164)
[#199](https://github.com/SAP/guided-answers-extension/issues/199),

Prerequisites: Guided Answers Extension is installed in either SAP Business Application Studio (SBAS) or Microsoft Visual Studio Code (VSCODE)



### Open Guided Answers (SBAS and VSCODE)

**GIVEN** the user opens the 'Command Palette' in SAP Business Application Studio/VSCODE  
**WHEN** the user enters 'SAP: Open Guided Answers'  
**THEN** 'SAP: Open Guided Answers' appears in the command palette drop down


**GIVEN** 'SAP: Open Guided Answers' appears in the command palette dropdown  
**WHEN** The user selects 'SAP : Open Guided Answers'  
**THEN** the Guided Answers Extension opens in the view port showing:  

    a. A blank home page 
    b. Empty search input field

**GIVEN** the Guided Answer Extension is opened  
**WHEN** the user makes the view port smaller  
**THEN** the Guided Answers Extension adapts:  
  
    a.The search input field falls under the SAP Guided Answers Extension 

### Search Guided Answers Content

**GIVEN** the Guided Answer Extension is opened  
**WHEN** the user enters 'SAP Fiori tools' in the search field  
**THEN** a list of guided answers closely matching the search criteria appears in the list. The list contains  

    a. A list containing guides that are related to the 'SAP Fiori Tools' search criteria.
    b. The name of the Guided Answer should appear in the list 
    b. The description of the Guided Answer  should appear in the list
    c. The Product the Guided Answer is associated to
    d. The Component the Guided Answer is associated to


### Open Guided Answers Content 

**GIVEN** the user has searched Guided Answers content  
**WHEN**  the user selects a Guided Answer  
**THEN** the Guided Answer is opened showing:  

    a. 'All Answers' link
    b. Guided Answers content tree showing the first node of the Guided Answer Tree
    c. The title of the Guided Answer
    d. The content of the first Guided Answer node
    e. The outcomes of the Guided Answer content 

Note: Check the content matches the content in the web application e.g. headers , bullet points , images 

**GIVEN** the user has selected a Guided Answer  
**WHEN**  the user selects an outcome  
**THEN** the contents of that outcome/node is displayed  

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

**GIVEN** the user has selected an outcome  
**WHEN** the user clicks 'Step back'  
**THEN** the user is returned to the previous node of the tree content  

**GIVEN** the user has selected an outcome  
**WHEN** the user clicks 'Restart'  
**THEN** the user is returned to the start of the Guided Answer  

**GIVEN** the user has selected an outcome  
**WHEN** the user clicks a node in the tree component  
**THEN** the user is navigated to the node in the Guided Answer Tree  

**GIVEN** the user has selected an outcome  
**WHEN** the user clicks on 'All answers'  
**THEN** the user is navigated to the Guided Answers home page  
    
    a. an empty search 
    
**GIVEN** the user has selected an outcome  
**WHEN** the user clicks through all of the outcome nodes/options
**THEN** the user will view the last node of the outcome
    
    a. Text saying 'Please tell us if this answer was helpful'
    b. A button saying 'This solved my issue'
    c. A button saying 'This did not solve my issue'
    
    
### The Guided Answer solved the issue 

**GIVEN** the user has clicked through all the available nodes of a GA tree/outcome  
**WHEN** the user clicks 'This solved my issue'
**THEN** a pop up appears showing 
      
     a. Text - 'Thanks! We are glad to hear that your issue has been resolved and we hope that you enjoying using the Guided Answers application'
     b. A 'Home' Button
     c. A Close Button
     
**GIVEN** the user has clicked 'This solved solved my issue' and the Thanks pop up appears
**WHEN** the user clicks the 'Home' button 
**THEN** the user is navigated to the home page 

**GIVEN** the user has clicked 'This solved solved my issue' and Thanks pop up appears
**WHEN** the user clicks the 'Close' button 
**THEN** the user remains on the last node of the selected outcome

Note: Verify that the submission of the 'This solved my issue' is captured in the backend with the GA content creator of the outcome that you selected.
 
### The Guided Answer did not solve the issue 

**GIVEN** the user has clicked through all the available nodes of a GA tree/outcome  
**WHEN** the user clicks 'This did not solve my issue'
**THEN** the user is navigated to a node with the following information

        a. Heading  'The issue was not resolved'
        b. Description: 'We are sorry to hear that your issue was not yet resolved. There are several options to getting further assistance' 
        c. A list of options e.g Start Expert Chart, Open and Incident
 
Note: The options listed are dependend on the Guided Answer content creator they can add custom options or go for default options to be displayed to the user when the issue is not solved. Verify the options match the options displayed in the Guided Answer web application.
        
**GIVEN** the user has clicked 'This did not solve my issue'
**WHEN** the user clicks on one of the options listed
**THEN** the user is navigated to a browswer where the user can continue with the option they selected.

Note: Verify that the submission of the 'This did not solve my issue' is captured in the backend with the GA content creator of the outcome that you selected.


### Displaying enhancements specific to VSCode or SAP Business Application Studio

Pre Req: 

**GIVEN** In the development environment VSCode,the user has Fiori Tools extension pack installed,  has opened the Guided Answers Extension and searched and selected Fiori Tools 
**WHEN** the user clicks on 'Fiori Generator' **AND** 'In SAP Business Application Studio - Services unavailable, All catalog service requests failed'  
**THEN** the "Fiori: Open Environment Check" does not appear as a clickable link in VSCODE  

**GIVEN** In the development environment SAP Business Application Studio ,the user has Fiori Tools extension pack installed, has opened the Guided Answers Extension , searched and selected Fiori Tools  
**WHEN** the user clicks on 'Fiori Generator' **AND THEN** 'In SAP Business Application Studio - Services unavailable, All catalog service requests failed'  
**THEN** the "Fiori: Open Environment Check" appears as a clickable link in the SBAS  

**GIVEN** In the development environment SAP Business Apllication Studion, the user has Fiori Tools extension is not installed,  opened the Guided Answers Extension , searched and selected Fiori Tools
**WHEN** the user clicks on 'Fiori Generator' **AND THEN** 'In SAP Business Application Studio - Services unavailable, All catalog service requests failed'  
**THEN** the "Fiori: Open Environment Check" does not appear as a clickable link in VSCODE   

Note: The low code now code development space in SAP Business Application Studion would be set up to not have the Fiori Tools Extension pack installed. 

