SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(mgr_emp.first_name, ' ', mgr_emp.last_name) AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT OUTER JOIN employee mgr_emp ON employee.manager_id = mgr_emp.id;