/**
 * Created by bjcarson75 on 1/24/16.
 */
(function(){
    'use strict'

    angular.module('app.services', []);
    angular.module('app.controllers', []);
    angular.module('app', ['app.services', 'app.controllers']);

    angular.module('app.services')
        .service('messageService', function($rootScope){
            var messages = {
                navbar: {
                    title: 'MSG_NAVBAR',
                    status: true,
                    message: 'The navbar is open by default.'
                },
                home: {
                    title: 'MSG_HOME',
                    status: true,
                    message: 'The home page is active by default.'
                }
            };

            return {
                sendMessage: function(message, data){
                    $rootScope.$broadcast(message.title, data);
                    console.log('messageService broadcasting message to rootScope! ' + data.message);
                },
                messages: messages
            }
        })
        .service('navbarService', function(messageService){
            var navMessage = messageService.messages.navbar;

            this.sendMessage = function(nav){
                console.log(nav)
                console.log('navbarService sending update to message service: ' + nav.status + ' ' + nav.message);
                messageService.sendMessage(navMessage, nav);
            }

            this.getMessage = function(){
                console.log('navbarService passing message: ' + JSON.stringify(navMessage));
                return navMessage;
            }

            this.openNav = function(status){
                this.sendMessage(status);
            }

            this.closeNav = function(status){
                this.sendMessage(status);
            }

            this.toggleNav = function(){
                var currentStatus = this.getMessage();
                console.log('togglenav')
                console.log(currentStatus);
            }
        })
        .service('homeService', function(messageService){
            var MESSAGE = messageService.messages;
            var homeMessage = messageService.messages.home;
            this.sendMessage = function(home){
                console.log('home service sending message to message service: ' + home.status + ' ' + home.message);
                messageService.sendMessage(homeMessage, home);
            }
            this.getMessage = function(){
                return MESSAGE;
            }
        });

    angular.module('app.controllers')
        .controller('NavbarController', function($scope, navbarService){
            var vm = this;

            var navStatus = navbarService.getMessage();
            console.log('NavbarController getting navbar status from navbarService: ' + navStatus.status + ' ' + navStatus.message);
            vm.navOpen = navStatus;

            $scope.$on('MSG_NAVBAR', function(data, message){
                console.log('NavbarController has detected an update! ' + message.message);
                vm.navOpen = message;
            });

            vm.openNav = function(){
                vm.navOpen = {status:true, message:'The navbar has been opened by the navbarController.'};
                navbarService.openNav(vm.navOpen);
            }

            vm.closeNav = function(){
                vm.navOpen = {status:false, message: 'The navbar has been closed by the navbarController.'};
                navbarService.closeNav(vm.navOpen);
            }


        });

    angular.module('app.controllers')
        .controller('HomeController', function($scope, homeService, navbarService){
            var vm = this;

            $scope.$on('MSG_NAVBAR', function(data, message){
                console.log('HomeController has detected an update! ' + message.message);
                vm.navOpen = message;
            });

            vm.messages = homeService.getMessage();
            console.log('HomeController getting all statuses from homeService: ' + JSON.stringify(vm.messages));
            vm.navOpen = vm.messages.navbar;

            vm.toggleNavbar = function(){
                if(vm.navOpen){
                    // close navbar
                    vm.navOpen = {status:false, message:'The navbar has been toggled (to closed) by the HomeController.'};
                    navbarService.closeNav(vm.navOpen);
                } else {
                    // open navbar
                    vm.navOpen = {status:true, message:'The navbar has been toggled (to open) by the HomeController.'};
                    navbarService.openNav(vm.navOpen);
                }
            }

            vm.openNavbar = function(){
                vm.navOpen = {status:true, message:'The navbar has been opened by the HomeController.'};
                navbarService.openNav(vm.navOpen);
            }

            vm.closeNavbar = function(){
                vm.navOpen = {status:false, message:'The navbar has been closed by the HomeController.'};
                navbarService.closeNav(vm.navOpen);
            }
        });
})();