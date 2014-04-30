Available Questions Types
========================


 Multiple Choices Single Answer
=============================

The form contains 2 sections

1. correct answer input field
2. list of options for incorrect answers

The display will mix the different options with the correct answer.
Users will mark the correct answer with a radio button

An answer is correct iff only the correct answer is selected.

 Multiple Choices Multiple Answers
==================================

The form contains 2 sections

1. list of options for correct answers
2. list of options for incorrect answers

The display will mix the different options with the correct answer.
Users will mark the correct answers with a checkboxes.

 An answer is correct iff all the correct answers were selected.

True/False Answer
==================


This is a simpler multi choice question. It has 1 section - the question.

 Fill in the blanks
====================

The form contains 2 sections

1. textarea for the text. The blanks should be marked with 3 underscores (___).
2. list of answers. The order of the answers should match the order of the blanks.

The display will mix the answers.
The display will replace the placeholders with a select box.
Users will mark the correct answer for each blank by choosing a value in the select box.

An answer is correct iff the select value for each select box matches in value and index.

Technical Note: The display algorithm should split the string by "___". Then we should iterate
over the text items and add a select box between each one. The select box's model should be an array
where the index of the array correlates to the expected answer index.


Exact Match Question
====================

The form contains 2 fields

1. The question as free text
2. The answer as free text

The user enters the answer using an input field.

The answer is correct iff the user's answer equals to the expected answer.


Features for each question
===========================

Add an explanation
===================

Editors can choose to ask for an explanation on a question.

If an explanation is required, the question will not be accepted without one.

The explanation is used for editor's review and does not take part of the score or the feedback.

Add a comment
=============

We will allow users to comment on each question.
This is an optional field and does not get validated at any point and it is not part of the quiz score.

The comment is sent to the editor.
The comment is viewed on the question when searching for questions.

A comment belongs to a question, a step in lesson. If any of these does not exists, the comment should be voted for deletion by admin users.





Implementation Note
====================


Please note that the data in the database contains information about which is the correct answer.
This means that students can cheat simply by looking at the network.

To avoid this, we should add logic to the backend to do the following

1. remove the relevant data.
2. decide if answer is correct or not.