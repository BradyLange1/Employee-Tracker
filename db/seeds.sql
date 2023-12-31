INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO role (title, department_id, salary)
VALUES ("Sales Lead", 4, "100000"),
       ("Salesperson", 4, "80000"),
       ("Lead Engineer", 1, "150000"),
       ("Software Engineer", 1, "120000"),
       ("Account Manager", 2, "160000"),
       ("Accountant", 2, "125000"),
       ("Legal Team Lead", 3, "250000"),
       ("Lawyer", 3, "190000");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, null),
       ("Mike", "Chan", 2, 1),
       ("Ashley", "Rodriguez", 3, 2),
       ("Brady", "Lange", 4, 3),
       ("Jenna", "Seavey", 5, 4),
       ("Jim", "Lange", 6, 5),
       ("Marshall", "Mathers", 7, 6),
       ("Saul", "Goodman", 8, 7);

