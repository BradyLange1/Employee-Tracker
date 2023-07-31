SELECT role.id, role.title, department.name, role.salary
FROM role
JOIN department ON role.department_id = department.id
ORDER BY role.id;