'use strict';

describe('Controller: mainController', function () {

  // load the controller's module
  beforeEach(module('brtmtApp'));
  beforeEach(module('socketMock'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/basicInfo')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    MainCtrl = $controller('mainController', {
      $scope: scope
    });
  }));

  it('should attach basic host info to the scope', function () {
    $httpBackend.flush();
    expect(scope.awesomeThings).not.to.be(null);
  });
});
