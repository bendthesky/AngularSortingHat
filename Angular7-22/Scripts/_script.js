var app = angular.module("myApp", []);
app.factory("Students", function () {
    return [];
});
app.factory("Houses", function () {
    return [
            { name: "Gryffindor", crest: "images/Gryffindor_crest_by_tuliipiie-d491bqc.jpg" },
            { name: "Hufflepuff", crest: "images/L_PINTRADING_Souvenirs_Pins_HarryPotter_Souvenirs_HufflepuffCrestMedallionPin_1230702.jpg"},
            { name: "Ravenclaw", crest: "images/20080505084513!Ravenclawcrest.jpg"},
            { name: "Slytherin", crest: "images/Slytherin-Crest-slytherin-17304074-250-284.jpg"}];
})
app.controller("SortingHatController",
    function ($scope, $http, Students, Houses) {
        $scope.houses = Houses;
        $scope.students = Students;
        $scope.addStudent = function (student) {
            var newStudent = { name: student.name, house: student.house };
            $http.post("https://sortinghat.firebaseio.com/.json", newStudent)
            .success(function (data) {
                newStudent.id = data.name;
                $scope.students.push(newStudent);
                student.name = "";
                student.house = "";
            })
            .error(function (data) {
                console.log(JSON.stringify(data));
            })
        };
        $http.get("https://sortinghat.firebaseio.com/.json")
        .success(function (data) {
            for (var s in data) {
                data[s].id = s;
                $scope.students.push(data[s])
            }
        })
        .error(function () {
            console.log("Oopsie...")
        })
    });

app.controller("HousesController",
    function ($scope, $http, Students, Houses) {
        $scope.students = Students;
        $scope.houses = Houses;
        $scope.deleteStudent = function (student) {
            $http.delete("https://sortinghat.firebaseio.com/" + student.id + "/.json")
            .success(function () {
                $scope.students.splice($scope.students.indexOf(student), 1);
            })
            .error(function () {
                alert("A muggle is running our system...");
            })
        };
        $scope.editStudent = function (student) {
            $scope.aStudent = { name: student.name, house: student.house, id: student.id };
            $("#editModal").modal();
        };
        $scope.saveStudent = function (student) {
            $http({
                method: "PATCH",
                url: "https://sortinghat.firebaseio.com/" + student.id + "/.json",
                data: { name: student.name, house: student.house }
            })
            .success(function () {
                alert("Woohoo!");
                $("#editModal").modal("hide");
                $scope.students[
                $scope.students.map(function (x) { return x.id; }).indexOf(student.id)] = student;
            })
            .error(function () {
                alert("Dang: " + JSON.stringify(data))
            });
        }
        $scope.getCrest = function (house) {
            return $scope.houses[$scope.houses.map(function (x) { return x.name }).indexOf(house)].crest;
        }

});