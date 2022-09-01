Keyboard Navigation to be tested 

1. SAP Business Application Studio
2. Microsoft Visual Studio Code


### Open Guided Answers 

**GIVEN** the user opens the 'Command Palette'  
**WHEN** the user enters 'SAP: Open Guided Answers'  
**THEN** 'SAP: Open Guided Answers' appears in the command palette drop down  

**GIVEN** 'SAP: Open Guided Answers' appears in the command palette dropdown  
**WHEN** The user selects 'SAP : Open Guided Answers'  
**THEN** the Guided Answers Extension opens in the view port and the cursor appears in the search input field  

### Search Guided Answers Content

**GIVEN** the Guided Answer Extension is opened  
**WHEN** the user enters 'SAP Fiori tools' in the search field  
**THEN** a list of Guided Answers closely matching the search criteria appears in the list  

### Navigating through the Guided Answers List  

**GIVEN** the user has searched Guided Answers content  
**WHEN**  the user tabs  
**THEN** the user is navigated to the list of Guided Answers with the first guide highlighted and given focus  

### Navigating through the Guided Answers List  

**GIVEN** the user has focus on the first Guided Answer in the returned search list  
**WHEN**  the user uses the up, down or left and right arrow keys  
**THEN** the user is navigated through the list. Each guide highlighted as the user navigates  

**GIVEN** the user has focused on one of the Guided Answers in the list  
**WHEN** the user hits enter  
**THEN** the user is navigated to the Guided Answers Detail page with focus given to the Home icon on the Details page  


### Navigating through theGuided Answers Details page

**GIVEN** the user has selected a Guided Answer on the Home page  
**WHEN** the user uses the up , down or left and right arrow keys  
**THEN** the user is navigated between the Home and Step Back keys in the header area of the Details page  

**GIVEN** the user has selected a Guided Answer on the Home page and has focus on the header of the Details page  
**WHEN** the user hits the tab key  
**THEN** the user is navigated to the first level/node in the tree component  

**GIVEN** the user has focus on the tree component on the Details page  
**WHEN** the user hits the tab key  
**THEN** the user is navigated to the first link/button in the content area. The first link/button is scrolled into view.  

**GIVEN** the user has focus on the content area of the Details page  
**WHEN** the user uses the up, down, left and right arrow keys  
**THEN** the user is navigated through the different links/buttons of the content area  

**GIVEN** the user has focus on a button/outcome on the content area  
**WHEN** the user uses hits enter  
**THEN** the user is navigated to the content area for next node in the Guided Answer Tree with focus given to the first home button  

**GIVEN** the user has focus on a home on the content area  
**WHEN** the user uses hits tab  
**THEN** the user is navigated back to the tree component  

**GIVEN** the user has focus on the tree component  
**WHEN** the user uses up, down, left and right arrow keys  
**THEN** the user is navigated through the different nodes of the Guided Answer Tree  

**GIVEN** the user has focus on a node in the tree component  
**WHEN** the user hits tab  
**THEN** the user is navigated  to the content area for that node in the Guided Answers Tree  

**GIVEN** the user has focus on the content area for that node in the Guided Answer  
**WHEN** the user hits tab  
**THEN** the user is navigated to the Home link in the Details page header bar  

**GIVEN** the user has focus on the header bar  
**WHEN** the user uses the up, down, left and right arrow keys  
**THEN** the user is navigated the user is navigated between the Home and Step Back and Restart keys  

**GIVEN** the user has focus on the header bar  
**WHEN** the user shift tab  
**THEN** the user is navigated back to the content area with focus on the first link/button. The first link/button is scrolled into view.  

