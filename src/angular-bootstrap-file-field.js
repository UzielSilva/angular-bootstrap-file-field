/* @preserve
 *
 * angular-bootstrap-file
 * https://github.com/itslenny/angular-bootstrap-file-field
 *
 * Version: 0.1.4 - 02/03/2016
 * License: MIT
 */

angular.module('bootstrap.fileField',[])
.directive('fileField', [ '$parse', function($parse) {
  return {
    require:'ngModel',
    restrict: 'E',
    link: function (scope, element, attrs, ngModel) {
        //set default bootstrap class
        if(!attrs.class && !attrs.ngClass){
            element.addClass('btn');
        }

        // Allowed variavle for manage allowed property

        var allowed = attrs.allowed ? JSON.parse(attrs.allowed) : null;

        // Error variable for manage error property

        var error = attrs.error ? $parse(attrs.error) : null;

        var fileField = element.find('input');

        fileField.bind('change', function(event){
            scope.$evalAsync(function () {
              
              // Variable for verify allowed extensions

              var passed = false;

              if(!allowed){ passed = true; }

              else {
                
                if(!Array.isArray(allowed)){ throw 'Allowed property must be an array'; }
                
                allowed.forEach(function(type){

                  var patt = new RegExp('.*\.' + type);
                  if(patt.exec(event.target.files[0].name)){
                    passed = true;
                  }

                });

              }

              if(passed){
                scope.$evalAsync(function(){
                    error.assign(scope, undefined);
                  });
                ngModel.$setViewValue(event.target.files[0]);
                if(attrs.preview){
                  var reader = new FileReader();
                  reader.onload = function (e) {
                    scope.$evalAsync(function(){
                      scope[attrs.preview]=e.target.result;
                    });
                  };
                  reader.readAsDataURL(event.target.files[0]);
                }

              }else{
                if(error){
                  scope.$evalAsync(function(){
                    error.assign(scope, 'Only ' + allowed +  ' files are allowed');
                  });
                }
              }

            });
        });
        fileField.bind('click',function(e){
            e.stopPropagation();
        });
        element.bind('click',function(e){
            e.preventDefault();
            fileField[0].click()
        });        
    },
    template:'<button type="button"><ng-transclude></ng-transclude><input type="file" style="display:none"></button>',
    replace:true,
    transclude:true
  };
}]);