angular.module('HomeController',['btford.socket-io'])

.factory('socket', ['socketFactory',function (socketFactory) {
	return socketFactory();
}])

.controller('HomeCtrl',['$scope','$http','socket',function ($scope,$http,socket){

	$scope.remails = [];

	var allContacts = function() {
		$http.get('http://127.0.0.1:8080/api/contacts').success(function(response) {
			$scope.contacts = response;
			//console.log($scope.contacts);
		});
	};

	allContacts();

	$scope.sendMail = function() {
		//console.log($scope.semail);
		$http.post('http://127.0.0.1:8080/api/semail', $scope.semail).success(function(response) {
			console.log(response);
			$scope.semail = {};
		});
	};

	socket.on("receive email", function(remail){
		console.log(remail);
		$scope.remails.push(remail);
	});

}]);