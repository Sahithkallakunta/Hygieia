/**
 * Controller for performing authentication or signingup a new user */
(function () {
    'use strict';

    angular
        .module(HygieiaConfig.module)
        .controller('LoginController', LoginController);


    LoginController.$inject = ['$scope', 'loginData', '$location', '$cookies', '$http'];
    function LoginController($scope, loginData, $location, $cookies, $http) {
        var login = this;

        // public variables
        login.showAuthentication = $cookies.authenticated;
        login.id = '';
        login.passwd = '';
        login.apiup = false;


        //public methods
        login.doLogin = doLogin;
        login.doSignup = doSignup;
        login.templateUrl = "app/dashboard/views/navheader.html";
        login.doCheckState = doCheckState;
        login.checkApi = checkApi;


        function doCheckState() {
            //Call the method to make sure api layer is up
            checkApi();

            if ($cookies.authenticated) {
                $location.path('/site');

            }
            else {
                $location.path('/');
            }
        }

        function doLogin(valid) {
            if (valid) {
                loginData.login(document.lg.login.value, document.lg.password.value).then(processResponse);
            }
        }


        function processResponse(data) {

            console.log("Authentication is:" + data);

            if (data) {
                $cookies.authenticated = true;
                $cookies.username = document.lg.login.value;

                $location.path('/site');

            }
            else {
                $scope.alerts.splice(0, $scope.alerts.length);
                $scope.alerts.push({type: 'danger', msg: 'Incorrect Username and Password please check'});
            }
        }

        function doSignup() {
            console.log("In signup");
            $location.path('/signup');
        }

        function checkApi() {
            var url = '/api/dashboard';

            $http.get(url)
                .success(function (data, status, headers, config) {

                    if (status == 200) {
                        console.log("API Connectivity");
                        login.apiup = true;
                    }
                    // we will add explicit code to check if we we secure the api layer.
                    else {
                        console.log("API layer down");
                    }
                })
                .error(function (data, status, headers, config) {

                    login.apiup = false;

                });
        }

    }
})();
