'use strict';

angular.module('lergoApp')
    .controller('HomepageCtrl', function ($scope) {

        function getRandomWeight(){
            return Math.floor(Math.random() * 100 % 14 + 10);
        }

        $scope.filters = [
            { 'label' : 'age range', 'options':['1-6','6-10','10-15','15-20','Custom'], 'select':null},
            { 'label' : 'language', 'options':['languages.en','languages.he','languages.ru'], 'translate':true, 'select':null},
            { 'label' : 'subject', 'options':['subject.spelling','subject.math','subject.art'], 'translate':true, 'select':null}
        ];


        $scope.tags = [ 'confusing words', 'tricks', 'visual', 'fun' ];

        $scope.labels = [
            'adding and subtracting',
            'audio',
            'algebra',
            'alternative energy',
            'angles',
            'animated',
            'area',
            'arts',
            'atoms',
            'bats',
            'big data',
            'bullying',
            'capital letters',
            'career',
            'chemistry',
            'clock',
            'cloud',
            'cats',
            'confusing words',
            'creating lessons',
            'creativity',
            'critical thinking',
            'curriculum',
            'cyber security',
            'decimals',
            'dinosaurs',
            'diversity',
            'division',
            'dna',
            'dolphins',
            'einstein',
            'english',
            'ethics',
            'exercises',
            'exponents',
            'flowers',
            'foreign',
            'languages',
            'fractures',
            'french',
            'fun',
            'galileo',
            'gene',
            'geography',
            'geometry',
            'grammar',
            'graphs',
            'gravity',
            'interactive',
            'interest',
            'internet',
            'kinetic',
            'knowledge',
            'latitude and longitude',
            'learning strategies',
            'pollution',
            'public speaking',
            'quiz',
            'science',
            'shakespeare',
            'social',
            'responsibility',
            'social studies',
            'software programming',
            'spanish',
            'spelling',
            'sun',
            'sustainability',
            'synonyms',
            'technology',
            'test prep',
            'tests and quizzes',
            'test-taking',
            'strategies',
            'time',
            'tips & tricks',
            'visual',
            'water',
            'waves',
            'wh questions',
            'x-ray'
        ];


        $scope.sections = [
            { 'label':'featured', lessons:[
                { 'age' : 9, 'time':'07:00', 'questions':9, 'title':'angles101', 'by':['Sally'], 'at':'5 months ago', 'languages':['en','ar','ru'], 'stats': [ {'type':'views','value':129},{'type':'likes', 'value':13}, {'type':'comments', 'value':5}]},
                { 'age' : 8, 'time':'15:00', 'questions':23, 'title':'confusingWords', 'by':['Liat','Tony'], 'at':'2 months ago', 'languages':['en','he'], 'stats':[{'type':'views','value':52},{'type':'likes', 'value':3}, {'type':'comments', 'value':3}]},
                { 'age' : 10, 'time':'23:30', 'questions':5, 'title':'introScience', 'by':['Jlevym','Nava'], 'at':'11 months ago', 'languages':['en','he','fr'], 'stats':[{'type':'views','value':437},{'type':'likes', 'value':36}, {'type':'comments', 'value':7}]}
            ]},
            { 'label':'popular', lessons:[
                { 'age' : 6, 'time':'06:00', 'questions':5, 'title':'gravity', 'by':['Albert'], 'at':'6 months ago', 'languages':['en','ar','ru','he'], 'stats': [ {'type':'views','value':129},{'type':'likes', 'value':13}, {'type':'comments', 'value':5}]},
                { 'age' : 11, 'time':'23:30', 'questions':23, 'title':'buildRobots', 'by':['Barak'], 'at':'10 months ago', 'languages':['en'], 'stats':[{'type':'views','value':52},{'type':'likes', 'value':3}, {'type':'comments', 'value':3}]},
                { 'age' : 9, 'time':'26:00', 'questions':8, 'title':'energy', 'by':['Tracy'], 'at':'1 months ago', 'languages':['en','he'], 'stats':[{'type':'views','value':437},{'type':'likes', 'value':36}, {'type':'comments', 'value':7}]}
            ]},
            { 'label':'new', lessons:[
                { 'age' : 10, 'time':'06:00', 'questions':5, 'title':'gravity', 'by':['Albert'], 'at':'6 months ago', 'languages':['en','ar','ru','he'], 'stats': [ {'type':'views','value':129},{'type':'likes', 'value':13}, {'type':'comments', 'value':5}]},
                { 'age' : 13, 'time':'23:30', 'questions':23, 'title':'buildRobots', 'by':['Barak'], 'at':'10 months ago', 'languages':['en'], 'stats':[{'type':'views','value':52},{'type':'likes', 'value':3}, {'type':'comments', 'value':3}]},
                { 'age' : 9, 'time':'26:00', 'questions':8, 'title':'energy', 'by':['Tracy'], 'at':'1 months ago', 'languages':['en','he'], 'stats':[{'type':'views','value':437},{'type':'likes', 'value':36}, {'type':'comments', 'value':7}]}
            ]}

        ];



        for ( var i =0; i < $scope.labels.length; i++ ){
            $scope.labels[i] = { text : $scope.labels[i], weight: getRandomWeight()};
        }

    });
