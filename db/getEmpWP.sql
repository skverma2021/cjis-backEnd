SELECT workPlan.id AS wpId, emp.id
FROM     emp INNER JOIN
                  workPlan ON emp.curDeptt = workPlan.depttId
WHERE  (emp.id = 300)