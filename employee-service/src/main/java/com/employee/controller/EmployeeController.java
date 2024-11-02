package com.employee.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.employee.entity.Employee;
import com.employee.service.EmployeeService;

@CrossOrigin(maxAge = 3360)
@RestController
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/employee")
    public ResponseEntity<List<Employee>> getAllEmployee() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable("employeeId") Long employeeId) {
        Employee empObj = employeeService.getEmployeeById(employeeId);
        if (empObj == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(empObj);
    }

    @PostMapping("/employee")
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
    	if (employee.getName() == null || employee.getManager() == null || employee.getSalary() == null) {
            return ResponseEntity.badRequest().body(null);  // Respond with 400 if data is incomplete
        }
        return ResponseEntity.ok(employeeService.addEmployee(employee));
    }

    @PatchMapping("/employee/{employeeId}")
    public ResponseEntity<Employee> updateEmployee(@RequestBody Employee employee, @PathVariable("employeeId") Long employeeId) {
        Employee empObj = employeeService.getEmployeeById(employeeId);
        if (empObj == null) {
            return ResponseEntity.notFound().build();
        }
        empObj.setManager(employee.getManager());
        empObj.setName(employee.getName());
        empObj.setSalary(employee.getSalary());
        return ResponseEntity.ok(employeeService.updateEmployee(empObj));
    }

    @DeleteMapping("/employee/{employeeId}")
    public ResponseEntity<String> deleteEmployee(@PathVariable("employeeId") Long employeeId) {
        Employee empObj = employeeService.getEmployeeById(employeeId);
        if (empObj == null) {
            return ResponseEntity.notFound().build();
        }
        String deleteMsg = employeeService.deleteEmployee(empObj);
        return ResponseEntity.ok(deleteMsg);
    }
}
