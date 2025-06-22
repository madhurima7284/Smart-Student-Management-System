// Apex Class: StudentController.cls
public with sharing class StudentController {
    @AuraEnabled(cacheable=true)
    public static List<Student__c> getStudents() {
        return [SELECT Id, Name, Roll_Number__c, Department__c, GPA__c, Feedback__c FROM Student__c];
    }

    @AuraEnabled
    public static void addStudent(Student__c newStudent) {
        insert newStudent;
    }

    @AuraEnabled
    public static void updateStudent(Student__c updatedStudent) {
        update updatedStudent;
    }

    @AuraEnabled
    public static void deleteStudent(Id studentId) {
        delete [SELECT Id FROM Student__c WHERE Id = :studentId];
    }
}


<!--  Component: StudentList.cmp -->
<aura:component controller="StudentController" implements="force:appHostable,flexipage:availableForAllPageTypes" access="global">
    <aura:attribute name="students" type="Student__c[]" />
    <aura:handler name="init" value="this" action="{!c.doInit}" />

    <lightning:card title="Student List">
        <aura:iteration items="{!v.students}" var="student">
            <c:StudentCard student="{!student}" />
        </aura:iteration>
    </lightning:card>
</aura:component>


// Controller: StudentListController.js
({
    doInit: function(component, event, helper) {
        var action = component.get("c.getStudents");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.students", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    }
})


<!--  Component: StudentCard.cmp -->
<aura:component>
    <aura:attribute name="student" type="Student__c" />
    <lightning:card title="{!v.student.Name}">
        <p class="slds-p-horizontal_small">Roll No: {!v.student.Roll_Number__c}</p>
        <p class="slds-p-horizontal_small">Department: {!v.student.Department__c}</p>
        <p class="slds-p-horizontal_small">GPA: {!v.student.GPA__c}</p>
        <p class="slds-p-horizontal_small">Feedback: {!v.student.Feedback__c}</p>
    </lightning:card>
</aura:component>


<!--  Component: StudentForm.cmp -->
<aura:component controller="StudentController">
    <aura:attribute name="newStudent" type="Student__c" default="{'sobjectType': 'Student__c'}"/>

    <lightning:card title="Add New Student">
        <lightning:input label="Name" value="{!v.newStudent.Name}" />
        <lightning:input label="Roll Number" value="{!v.newStudent.Roll_Number__c}" />
        <lightning:input label="Department" value="{!v.newStudent.Department__c}" />
        <lightning:input label="GPA" type="number" value="{!v.newStudent.GPA__c}" />
        <lightning:textarea label="Feedback" value="{!v.newStudent.Feedback__c}" />
        <lightning:button label="Add Student" onclick="{!c.addStudent}" variant="brand" />
    </lightning:card>
</aura:component>


//  Controller: StudentFormController.js
({
    addStudent: function(component, event, helper) {
        var action = component.get("c.addStudent");
        action.setParams({ newStudent: component.get("v.newStudent") });

        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                $A.get('e.force:refreshView').fire();
                alert("Student added successfully!");
            } else {
                alert("Failed to add student.");
            }
        });
        $A.enqueueAction(action);
    }
})



