package com.employee.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Table(name="employee", schema="emp")

public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long employeeId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String manager;

    @Column(nullable = false)
    private Double salary;

    
    public Employee() {}
    
    public Employee(String name, String manager, Double salary) {
        this.name = name;
        this.manager = manager;
        this.salary = salary;
    }

    // Getters and setters for each field
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getManager() { return manager; }
    public void setManager(String manager) { this.manager = manager; }

    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }
    
    
}
