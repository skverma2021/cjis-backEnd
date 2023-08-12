-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE GetDaysInMonth
    @InputMonth INT,
    @InputYear INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Validate input parameters
    IF @InputMonth < 1 OR @InputMonth > 12
    BEGIN
        RAISERROR('Invalid input month. Please provide a valid month (1 to 12).', 16, 1);
        RETURN;
    END

    IF @InputYear < 1753 OR @InputYear > 9999
    BEGIN
        RAISERROR('Invalid input year. Please provide a valid year (1753 to 9999).', 16, 1);
        RETURN;
    END

    -- Calculate the first and last day of the input month
    DECLARE @FirstDayOfMonth DATE = DATEFROMPARTS(@InputYear, @InputMonth, 1);
    DECLARE @LastDayOfMonth DATE = DATEADD(DAY, -1, DATEADD(MONTH, 1, @FirstDayOfMonth));

    -- Generate a list of all days in the input month
    WITH Calendar AS
    (
        SELECT @FirstDayOfMonth AS [Date]
        UNION ALL
        SELECT DATEADD(DAY, 1, [Date]) AS [Date]
        FROM Calendar
        WHERE DATEADD(DAY, 1, [Date]) <= @LastDayOfMonth
    )
    SELECT [Date]
    FROM Calendar
    OPTION (MAXRECURSION 0);
END;

