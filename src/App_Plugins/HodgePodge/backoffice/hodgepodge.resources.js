angular.module("umbraco.resources").factory("Our.Umbraco.HodgePodge.Resources",
    function ($http, umbRequestHelper) {
        return {
            getDataTypesByKey: function (keys) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: "/umbraco/backoffice/HodgePodge/HodgePodgeApi/GetDataTypesByKey",
                        method: "GET",
                        params: { keys: keys }
                    }),
                    "Failed to retrieve datatypes by key"
                );
            },
            getPropertyTypeScaffoldsByKey: function (keys) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: "/umbraco/backoffice/HodgePodge/HodgePodgeApi/GetPropertyTypeScaffoldsByKey",
                        method: "GET",
                        params: { keys: keys }
                    }),
                    "Failed to retrieve property type scaffolds by key"
                );
            }
        };
    });
