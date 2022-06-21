
Pre Req: Guided Answers Extension is installed


### Open Guided Answers (SBAS and VSCODE)

**GIVEN** the user opens in the 'Command Pallette' in SBAS/VSCODE
**WHEN** the user enters 'SAP: Open Guided Answers'
**THEN** 'SAP:Open Guided Answers' appears in the command palette drop down


**GIVEN** 'SAP: Open Guided Answes' appears in the command paletted dropdown 
**WHEN** The user selects 'SAP : Open Guided Answers' 
**THEN** the Guided Answers Extension opens in the view port showing: 

    a. A blank home page 
    b. Empty search input field

**GIVEN** the Guided Answer Extension is opened
**WHEN** the makes the view port smaller 
**THEN** the Guided Answers Extension adapts:
  
    a.The search input field falls under the SAP Guided Answers Extension 

### Search Guided Answers Content

**GIVEN** the Guided Answer Extension is opened
**WHEN** the user enters search crtieria
**THEN** a list of guided answers closely matching the search criteria appears in the list. The list contains 

    a. The name of the Guided Answer
    b. The description of the Guided Answer 



### Open Guided Answers Content 

**GIVEN** the user has searched Guided Answers content
**WHEN**  the user selects a Guided Answer
**THEN** the Guide Answer is opened showing:

    a. 'All Answers' link
    b. Guided Answers content tree showing the first node of the Guided Answer Tree
    c. The title of the Guided Answer
    d. The content of the first Guided Answer content 
    e. The outcomes of the Guided Answer content 

Note: Check the content matches the content in the web application e.g. headers , bullet points , images 

**GIVEN** the user has selected a Guided Answer 
**WHEN**  the user selects an outcome 
**THEN** the contents of that outcome/node is displayed

    a. 'All Answers' link
    b. 'Step back' and 'Restart' Link 
    c. Guided Answers content tree showing the first node of the Guided Answer Tree and the outcome the user selected is underlined in blue 
    c. The contents of the Guided Answer
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
