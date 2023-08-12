SELECT 
	emp.id AS theEmpId, 
	emp.empFullName AS theName, 
	designation.description AS theDesig, 
	grade.description AS theGrade, 
	deptt.name AS theDeptt, 
	discipline.description AS theDiscp, 
	grade.hourlyRate AS theHrRate,
	curWorkPlans = (SELECT COUNT(workPlan.id) AS numberWorkPlans FROM     emp INNER JOIN workPlan ON emp.curDeptt = workPlan.depttId WHERE  (emp.id = 300))
FROM     deptt INNER JOIN
                  emp ON deptt.id = emp.curDeptt INNER JOIN
                  discipline INNER JOIN
                  designation ON discipline.id = designation.discpId ON emp.curDesig = designation.id INNER JOIN
                  grade ON designation.gradeId = grade.id
WHERE  (emp.id = 300)