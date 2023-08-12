SELECT COUNT(workPlan.id) AS numberWorkPlans
FROM     emp INNER JOIN
                  workPlan ON emp.curDeptt = workPlan.depttId
WHERE  (emp.id = 300)