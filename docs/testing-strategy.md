This document details the testing strategy for the Guided Answer Extension.



### New Feature Testing

- When a new feature is complete a manual testcase must be created or an existing testcase must be updated with a new test case.
- All testcases for the Guided Answer Extension are located [here](https://github.com/SAP/guided-answers-extension/tree/main/docs/testcases)
- The github issue detailing the feature must be reference the testcase.
- The testcase must also reference the user story.
  

### Regression Testing 
  
- A full regression must be completed for each release.
- A test report must be generated for each release.
  
A full regression must test the following areas across the different supported evironments
       - The installation of the extension
       - All new features
       - All previously released functionality

The supported environments are as follows
  - VSCode
  - SAP Business Application Studio dev spaces
  
        SAP Business Application Studio - SAP Fiori                  
        Full Stack Cloud Application 
        SAP HANA Native Application 
        Low-Code-Based Full-Stack Cloud Application 
        SAP Mobile Application
        Basic        
  
  
  ### Bugs
  All Bugs found should be raised in github. The [bug report template](https://github.com/SAP/guided-answers-extension/issues/new?assignees=&labels=type%3Abug&template=bug_report.md&title=BUG+-+) should be used to provide details fo the bug. 
  A priority will be assigned to the bug. 
  
  There is stop and fix process for all high bugs raised. 
