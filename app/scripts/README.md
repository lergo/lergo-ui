standards
=========


this page tries to depict standards in lergo. 

at the time of writing it ( 2-FEB-2016 ) these standard are not enforced yet, 
so you may see inconsistencies between what is written here and what is actual.

this standard is meant for new code to be written aligned to it and legacy code to some day align to it. 

pull request that help us get legacy code to align to the standard are welcomed. 

how to organize files
========================

## general 
this project's structure is functional based. 
all js files go under `app/scripts`, html files go under `app/views` etc..

under scripts we have `directives`, `filters`, `controllers` etc..
the structure is based on yeoman's angular generator. so if you are wondering where things should go, advise that project. 

the component is define by naming consistency. so if I have a component for 'create your own' section in lergo, 
the view, css and js will have `CreateYourOwn` prefix to them. 

it is then easy to find all component related files using an ide and searching for `CreateYourOWn`. 

## sub structure by model 
 
lergo has several main models

 - users
 - lessons
 - questions
 - invitations
 - reports
 - abuse reports
 - roles
 - faqs - this model is used in 'about lergo' section and is still under debate. we might move it to our documentation website
 
each functional unit should be divided to those section. 
the name of the section should be in plural form. 

## sub sub structure

more granular structure is not standardized yet. 
for now we are trying to separate it to some logical groups. 

For example
 - controllers
   - reports ==> sub category
     - classReports ==> sub sub category
       - ClassReportsDisplayCtrl.js

we need to keep track that this split is logical and does not get out of hand.

the example above is only an example. in the classReport scenario we did not actually need another level

## keeping consistencies between functional units

it is crucial to keep consistencies between function units. 

so that if i have the structure

 - controllers
   - reports
     - classReports
       - ClassReportsDisplayCtrl.js
       
i should have something similar in all other units
       
 - style
   - reports
     - classReports
       - ClassReportsDisplay.scss
 - views
   - reports
     - classReports
       - ClassReportsDisplay.html

## file name

give your file a meaningful name, prefix by the component.
 
examples: 
 - UserSectionLessonsIndex.js
 - UserSectionReportsIndex.js
 
 - LessonDisplayStepDisplay.js
 - LessonDisplayIntro.js
 - LessonDisplayEnd.js
 
## files that are ng-included
 
files that are included should have an underscore at the beginning of their name. 

for example : `_index.html`
 
inclusion for files should be seriously considered. you are most likely in need for a directive instead. 

however, in some cases this might be required for a lack of better suggestion.

for example, when we show a step, we want to separate the display to 2 html files - video and quiz. 
which html to display? 

you could have 

```
&lt;div ng-if="step.type === 'lesson'"> &lt;lesson-view>&lt;/lesson-view> &lt;/div> 
&lt;div ng-if="step.type === 'quiz'"> &lt;quiz-view>&lt;/quiz-view>&lt;/div>
```

or you could have 
```
&lt;<div ng-include="{{getStepDisplay(step)}}"></div>


$scope.getStepDisplay = function( step ){ return 'views/lessons/steps/_' + getStepType(step) + '.html'; }
```

each method has it pros and cons. 

*note:*  regardless the method you chose, you should probably have a `&lt;step-display>` directive. 


## examples of how not to do things

by the time of writing this the files are in a mess. we had this horrible structure: 
 
 - app
   - scripts
     - controller 
       - invites
       - lessons
         - invitations
           - Display.js
           - Report.js
         - invites
           - PublicShare.js
         - report
           - Write
         - Display.js
         - Index.js
       - reports
         - Index.js
       
 - unclear hierarchy between lesson, invite and report.
 - too many files named `Index` or some other obscure name
 - not a clear separation for components. 
 
 
# do not reference permissions
 
do not write AdminSection or AdminLessonIndex. 

permissions should be abstracted as much as possible. 
 
Writing `UserSection` is fine as it is meant for a component where users go to their own section. and does not distinguishes their permissions. 

Writing 'AdminMenu' for example, is fine as it is an administrative menu, and does not refer to the user's permission as well. 

Writing `PublicLessonDisplay`, `AdminLessonDisplay` and `UserLessonDisplay` is bad as it has logic in the name of the component.
 
so for example, we should have `UserSectionLessonsIndex` for a user lessons, and then `UserSectionUsersIndex` for managing users. 

They're both in the UserSection component. The fact that managing users requires special permissions should not be reflected in the name of the file.
 
Instead it should be well documented in spec files, in documentation and in code.
 
 
# Defining a route
 
ultimately we will move to ui-router now that it mature enough. 

until then, we recommend doing the following: 

```
.when({
    templateUrl: 'views/../..html',
    controller: function(){}
})
```

and then in the view

```
<div class="base-layout">
    <div ng-controller="UserSectionLessonsIndexCtrl">
    </div>
</div>
```

why is this better?

 - it seems that form support is better. 
 - this solves a known bug in angular: http://stackoverflow.com/a/26634944/1068746
   - true that you can put everything on scope in an object. but this is actually cleaner
 - this actually aligns to how ui-router is implementing routes. so the move will be easier. 



         
