using BridgeWeb.Application.Common.Interfaces.Reports;
using BridgeWeb.Domain.Model.Dto.Report;
using Microsoft.AspNetCore.Hosting;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;

public class ExcelPostProcessor : IExcelPostProcessor
{
    private readonly IWebHostEnvironment _env;

    public ExcelPostProcessor(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task ProcessAsync(ExcelPostProcessContextDTO context)
    {
        if (!File.Exists(context.FilePath))
            throw new FileNotFoundException("Excel file not found.");

        var logoPath = Path.Combine(_env.WebRootPath, "images", "TCG-logo.png");

        using var package = new ExcelPackage(new FileInfo(context.FilePath));

        var worksheet = package.Workbook.Worksheets.FirstOrDefault()
            ?? throw new Exception("No worksheet found");

        var handlers = GetReportHandlers();

        if (!handlers.TryGetValue(context.ReportType, out var handler))
            throw new NotSupportedException($"Report type '{context.ReportType}' is not supported.");

        handler(worksheet, context.Parameters, logoPath);

        //switch (context.ReportType)
        //{
        //    case "Fabrication":
        //        ProcessFabrication(worksheet, context.Parameters, logoPath, "Fabrication");
        //        break;
        //    case "BudgetReportByItemForExcel":
        //        ProcessBudget(worksheet, context.Parameters, logoPath, "BudgetReportByItemForExcel");
        //        break;
        //    case "BudgetReportSummaryForExcel":
        //        ProcessBudgetSummery(worksheet, context.Parameters, logoPath, "BudgetReportSummaryForExcel");
        //        break;
        //    case "PurchaseCommitmentReportForExcel":
        //        PurchaseCommitment(worksheet, context.Parameters, logoPath, "PurchaseCommitmentReportForExcel");
        //        break;
        //    case "PurchaseCommitmentReport1ForExcel":
        //        PurchaseCommitment1(worksheet, context.Parameters, logoPath, "PurchaseCommitmentReport1ForExcel");
        //        break;
        //    case "PurchaseCommitmentReport2ForExcel":
        //        PurchaseCommitment2(worksheet, context.Parameters, logoPath, "PurchaseCommitmentReport2ForExcel");
        //        break;
        //    case "CommittedCostReportDetailForExcel":
        //        CommittedCostReportDetail(worksheet, context.Parameters, logoPath, "CommittedCostReportDetailForExcel");
        //        break;
        //    case "CommittedCostForExcel":
        //        CommittedCost(worksheet, context.Parameters, logoPath, "CommittedCostForExcel");
        //        break;
        //    case "ExpeditNoteForExcel":
        //        ExpeditNoteForExcel(worksheet, context.Parameters, logoPath, "ExpeditNoteForExcel");
        //        break;
        //    case "ExpeditNote1ForExcel":
        //        ExpeditNote1ForExcel(worksheet, context.Parameters, logoPath, "ExpeditNote1ForExcel");
        //        break;
        //    case "ExpeditNote2ForExcel":
        //        ExpeditNote2ForExcel(worksheet, context.Parameters, logoPath, "ExpeditNote2ForExcel");
        //        break;
        //    case "ExpeditNote3ForExcel":
        //        ExpeditNote3ForExcel(worksheet, context.Parameters, logoPath, "ExpeditNote3ForExcel");
        //        break;
        //    case "ExpeditNote4ForExcel":
        //        ExpeditNote4ForExcel(worksheet, context.Parameters, logoPath, "ExpeditNote4ForExcel");
        //        break;
        //    case "ExpeditNote5ForExcel":
        //        ExpeditNote5ForExcel(worksheet, context.Parameters, logoPath, "ExpeditNote5ForExcel");
        //        break;
        //    case "ExpeditNote6ForExcel":
        //        ExpeditNote6ForExcel(worksheet, context.Parameters, logoPath, "ExpeditNote6ForExcel");
        //        break;
        //    case "ExpeditNote7ForExcel":
        //        ExpeditNote7ForExcel(worksheet, context.Parameters, logoPath, "ExpeditNote7ForExcel");
        //        break;
        //    case "ExpeditNote8ForExcel":
        //        ExpeditNote8ForExcel(worksheet, context.Parameters, logoPath, "ExpeditNote8ForExcel");
        //        break;
        //    case "ReceivingReportSectionForExcel":
        //        ReceivingReportSection(worksheet, context.Parameters, logoPath, "ReceivingReportSectionForExcel");
        //        break;
        //    case "ReceivingReportSection1ForExcel":
        //        ReceivingReportSection(worksheet, context.Parameters, logoPath, "ReceivingReportSection1ForExcel");
        //        break;
        //    case "ReceivingReportSection2ForExcel":
        //        ReceivingReportSection(worksheet, context.Parameters, logoPath, "ReceivingReportSection2ForExcel");
        //        break;
        //    case "ReceivingReportSection3ForExcel":
        //        ReceivingReportSection(worksheet, context.Parameters, logoPath, "ReceivingReportSection3ForExcel");
        //        break;
        //    case "ReceivingReportSection4ForExcel":
        //        ReceivingReportSection(worksheet, context.Parameters, logoPath, "ReceivingReportSection4ForExcel");
        //        break;
        //    case "ExpeditNote4_ReceivingForExcel":
        //        ReceivingReportSection(worksheet, context.Parameters, logoPath, "ExpeditNote4_ReceivingForExcel");
        //        break;
        //    case "ExpeditNote3_ReceivingForExcel":
        //        ReceivingReportSection(worksheet, context.Parameters, logoPath, "ExpeditNote3_ReceivingForExcel");
        //        break;
        //    case "PODetailsForExcel":
        //        POReportSection(worksheet, context.Parameters, logoPath, "PODetailsForExcel");
        //        break;
        //    case "PODetails1ForExcel":
        //        POReportSection(worksheet, context.Parameters, logoPath, "PODetails1ForExcel");
        //        break;
        //    case "PODetails2ForExcel":
        //        POReportSection(worksheet, context.Parameters, logoPath, "PODetails2ForExcel");
        //        break;
        //    case "PODetails3ForExcel":
        //        POReportSection(worksheet, context.Parameters, logoPath, "PODetails3ForExcel");
        //        break;
        //    case "PODetails4ForExcel":
        //        POReportSection(worksheet, context.Parameters, logoPath, "PODetails4ForExcel");
        //        break;
        //    case "PODetails5ForExcel":
        //        POReportSection(worksheet, context.Parameters, logoPath, "PODetails5ForExcel");
        //        break;
        //    case "PODetails6ForExcel":
        //        POReportSection(worksheet, context.Parameters, logoPath, "PODetails6ForExcel");
        //        break;
        //}

        await package.SaveAsync().ConfigureAwait(false);
    }

    #region Report Handlers

    private void ProcessFabrication(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Fabrication Status Report", "Sorted by: Purchase Order (PO)", ReportType);

        ws.View.FreezePanes(7, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[6, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }

    private void ProcessBudget(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Budget Detail Report", "Grouped by: Project, Sorted by: Section", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }

    private void ProcessBudgetSummery(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Budget Summery Report", "Grouped by: Project, Sorted by: Section", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }

    private void PurchaseCommitment(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Purchase Commitment Report", "Grouped by: Project, Sorted by: Section", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }

    private void PurchaseCommitment1(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Purchase Commitment Report", "Grouped by: Vendor, Sorted by: PO", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }

    private void PurchaseCommitment2(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Purchase Commitment Report", "Grouped by: PO, Sorted by: Item", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }

    private void CommittedCostReportDetail(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Committed Cost Detail", "Grouped by: Project, Sorted by: Section", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }

    private void CommittedCost(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Committed Cost Summary", "Grouped by: Project, Sorted by: Section", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }

    private void ExpeditNoteForExcel(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Status", "Grouped by: Section, Sorted by: Item", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }

    private void ExpeditNote1ForExcel(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Status", "Grouped by: Section, Sorted by: PO", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }

    private void ExpeditNote2ForExcel(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Status", "Grouped by: Section,Sorted by: Arrival Date", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }
    private void ExpeditNote3ForExcel(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Status", "Grouped by: Vendor, Sorted by: Item", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }
    private void ExpeditNote4ForExcel(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Status", "Grouped by: Vendor, Sorted by: PO", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }
    private void ExpeditNote5ForExcel(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Status", "Grouped by: Vendor, Sorted by: Arrival Date", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }
    private void ExpeditNote6ForExcel(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Status", "Grouped by: Status, Sorted by: Item", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }
    private void ExpeditNote7ForExcel(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Status", "Grouped by: Status, Sorted by: PO", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }
    private void ExpeditNote8ForExcel(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        InsertCommonHeader(ws, parameters, logoPath, "Status", "Grouped by: Status, Sorted by: Arrival Date", ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }
    private void ReceivingReportSection(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        string title = "Receiving Report";
        string subTitle = _reportSubTitles.TryGetValue(ReportType, out var value)
                        ? value
                        : string.Empty;

        InsertCommonHeader(ws, parameters, logoPath, title, subTitle, ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }
    private void POReportSection(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        string title = "PO Detail Report";
        string subTitle = _reportSubTitles.TryGetValue(ReportType, out var value)
                        ? value
                        : string.Empty;

        InsertCommonHeader(ws, parameters, logoPath, title, subTitle, ReportType);

        ws.View.FreezePanes(7, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[6, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }
    private void POReportSummerySection(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        string title = "PO Summary Report";
        string subTitle = _reportSubTitles.TryGetValue(ReportType, out var value)
                        ? value
                        : string.Empty;

        InsertCommonHeader(ws, parameters, logoPath, title, subTitle, ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }
    private void InvoiceReportSummery(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        string title = "Invoice Summary Report";
        string subTitle = _reportSubTitles.TryGetValue(ReportType, out var value)
                        ? value
                        : string.Empty;

        InsertCommonHeader(ws, parameters, logoPath, title, subTitle, ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }
    private void InvoiceReportDetails(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        // ✅ Delete first column (this shifts all columns left)
        if (ws.Dimension != null && ws.Dimension.End.Column >= 1)
        {
            ws.DeleteColumn(1);
        }

        string title = "Invoice Detail Report";
        string subTitle = _reportSubTitles.TryGetValue(ReportType, out var value)
                        ? value
                        : string.Empty;

        InsertCommonHeader(ws, parameters, logoPath, title, subTitle, ReportType);

        ws.View.FreezePanes(7, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[6, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }
    private void PaymentReportDetails(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        string title = "Payment Report";
        string subTitle = _reportSubTitles.TryGetValue(ReportType, out var value)
                        ? value
                        : string.Empty;

        InsertCommonHeader(ws, parameters, logoPath, title, subTitle, ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }
    private void ApprovalStatusForExcel(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string ReportType)
    {

        string title = "Approval Status";
        string subTitle = _reportSubTitles.TryGetValue(ReportType, out var value)
                        ? value
                        : string.Empty;

        InsertCommonHeader(ws, parameters, logoPath, title, subTitle, ReportType);

        ws.View.FreezePanes(6, 1);

        if (ws.Dimension != null)
        {
            ws.Cells[5, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFilter = true;
        }
    }



    #endregion

    #region Shared Header Logic

    private Dictionary<string, Action<ExcelWorksheet, Dictionary<string, string>, string>> GetReportHandlers()
    {
        return new Dictionary<string, Action<ExcelWorksheet, Dictionary<string, string>, string>>(StringComparer.OrdinalIgnoreCase)
        {
            ["Fabrication"] = (ws, p, logo) => ProcessFabrication(ws, p, logo, "Fabrication"),

            ["BudgetReportByItemForExcel"] = (ws, p, logo) => ProcessBudget(ws, p, logo, "BudgetReportByItemForExcel"),
            ["BudgetReportSummaryForExcel"] = (ws, p, logo) => ProcessBudgetSummery(ws, p, logo, "BudgetReportSummaryForExcel"),

            ["PurchaseCommitmentReportForExcel"] = (ws, p, logo) => PurchaseCommitment(ws, p, logo, "PurchaseCommitmentReportForExcel"),
            ["PurchaseCommitmentReport1ForExcel"] = (ws, p, logo) => PurchaseCommitment1(ws, p, logo, "PurchaseCommitmentReport1ForExcel"),
            ["PurchaseCommitmentReport2ForExcel"] = (ws, p, logo) => PurchaseCommitment2(ws, p, logo, "PurchaseCommitmentReport2ForExcel"),

            ["CommittedCostReportDetailForExcel"] = (ws, p, logo) => CommittedCostReportDetail(ws, p, logo, "CommittedCostReportDetailForExcel"),
            ["CommittedCostForExcel"] = (ws, p, logo) => CommittedCost(ws, p, logo, "CommittedCostForExcel"),

            ["ExpeditNoteForExcel"] = (ws, p, logo) => ExpeditNoteForExcel(ws, p, logo, "ExpeditNoteForExcel"),
            ["ExpeditNote1ForExcel"] = (ws, p, logo) => ExpeditNote1ForExcel(ws, p, logo, "ExpeditNote1ForExcel"),
            ["ExpeditNote2ForExcel"] = (ws, p, logo) => ExpeditNote2ForExcel(ws, p, logo, "ExpeditNote2ForExcel"),
            ["ExpeditNote3ForExcel"] = (ws, p, logo) => ExpeditNote3ForExcel(ws, p, logo, "ExpeditNote3ForExcel"),
            ["ExpeditNote4ForExcel"] = (ws, p, logo) => ExpeditNote4ForExcel(ws, p, logo, "ExpeditNote4ForExcel"),
            ["ExpeditNote5ForExcel"] = (ws, p, logo) => ExpeditNote5ForExcel(ws, p, logo, "ExpeditNote5ForExcel"),
            ["ExpeditNote6ForExcel"] = (ws, p, logo) => ExpeditNote6ForExcel(ws, p, logo, "ExpeditNote6ForExcel"),
            ["ExpeditNote7ForExcel"] = (ws, p, logo) => ExpeditNote7ForExcel(ws, p, logo, "ExpeditNote7ForExcel"),
            ["ExpeditNote8ForExcel"] = (ws, p, logo) => ExpeditNote8ForExcel(ws, p, logo, "ExpeditNote8ForExcel"),

            ["ReceivingReportSectionForExcel"] = (ws, p, logo) => ReceivingReportSection(ws, p, logo, "ReceivingReportSectionForExcel"),
            ["ReceivingReportSection1ForExcel"] = (ws, p, logo) => ReceivingReportSection(ws, p, logo, "ReceivingReportSection1ForExcel"),
            ["ReceivingReportSection2ForExcel"] = (ws, p, logo) => ReceivingReportSection(ws, p, logo, "ReceivingReportSection2ForExcel"),
            ["ReceivingReportSection3ForExcel"] = (ws, p, logo) => ReceivingReportSection(ws, p, logo, "ReceivingReportSection3ForExcel"),
            ["ReceivingReportSection4ForExcel"] = (ws, p, logo) => ReceivingReportSection(ws, p, logo, "ReceivingReportSection4ForExcel"),

            ["ExpeditNote4_ReceivingForExcel"] = (ws, p, logo) => ReceivingReportSection(ws, p, logo, "ExpeditNote4_ReceivingForExcel"),
            ["ExpeditNote3_ReceivingForExcel"] = (ws, p, logo) => ReceivingReportSection(ws, p, logo, "ExpeditNote3_ReceivingForExcel"),

            ["PODetailsForExcel"] = (ws, p, logo) => POReportSection(ws, p, logo, "PODetailsForExcel"),
            ["PODetails1ForExcel"] = (ws, p, logo) => POReportSection(ws, p, logo, "PODetails1ForExcel"),
            ["PODetails2ForExcel"] = (ws, p, logo) => POReportSection(ws, p, logo, "PODetails2ForExcel"),
            ["PODetails3ForExcel"] = (ws, p, logo) => POReportSection(ws, p, logo, "PODetails3ForExcel"),
            ["PODetails4ForExcel"] = (ws, p, logo) => POReportSection(ws, p, logo, "PODetails4ForExcel"),
            ["PODetails5ForExcel"] = (ws, p, logo) => POReportSection(ws, p, logo, "PODetails5ForExcel"),
            ["PODetails6ForExcel"] = (ws, p, logo) => POReportSection(ws, p, logo, "PODetails6ForExcel"),

            ["POReportSummaryForExcel"] = (ws, p, logo) => POReportSummerySection(ws, p, logo, "POReportSummaryForExcel"),
            ["POReportSummary1ForExcel"] = (ws, p, logo) => POReportSummerySection(ws, p, logo, "POReportSummary1ForExcel"),
            ["POReportSummary2ForExcel"] = (ws, p, logo) => POReportSummerySection(ws, p, logo, "POReportSummary2ForExcel"),
            ["POReportSummary3ForExcel"] = (ws, p, logo) => POReportSummerySection(ws, p, logo, "POReportSummary3ForExcel"),
            ["POReportSummary4ForExcel"] = (ws, p, logo) => POReportSummerySection(ws, p, logo, "POReportSummary4ForExcel"),
            ["POReportSummary5ForExcel"] = (ws, p, logo) => POReportSummerySection(ws, p, logo, "POReportSummary5ForExcel"),
            ["POReportSummary6ForExcel"] = (ws, p, logo) => POReportSummerySection(ws, p, logo, "POReportSummary6ForExcel"),

            ["InvoiceSummaryForExcel"] = (ws, p, logo) => InvoiceReportSummery(ws, p, logo, "InvoiceSummaryForExcel"),
            ["InvoiceSummary1ForExcel"] = (ws, p, logo) => InvoiceReportSummery(ws, p, logo, "InvoiceSummary1ForExcel"),
            ["InvoiceSummary2ForExcel"] = (ws, p, logo) => InvoiceReportSummery(ws, p, logo, "InvoiceSummary2ForExcel"),
            ["InvoiceSummary3ForExcel"] = (ws, p, logo) => InvoiceReportSummery(ws, p, logo, "InvoiceSummary3ForExcel"),
            ["InvoiceSummary4ForExcel"] = (ws, p, logo) => InvoiceReportSummery(ws, p, logo, "InvoiceSummary4ForExcel"),
            ["InvoiceSummary5ForExcel"] = (ws, p, logo) => InvoiceReportSummery(ws, p, logo, "InvoiceSummary5ForExcel"),
            ["InvoiceSummary6ForExcel"] = (ws, p, logo) => InvoiceReportSummery(ws, p, logo, "InvoiceSummary6ForExcel"),
            ["InvoiceSummary7ForExcel"] = (ws, p, logo) => InvoiceReportSummery(ws, p, logo, "InvoiceSummary7ForExcel"),
            ["InvoiceSummary8ForExcel"] = (ws, p, logo) => InvoiceReportSummery(ws, p, logo, "InvoiceSummary8ForExcel"),
            ["InvoiceSummary9ForExcel"] = (ws, p, logo) => InvoiceReportSummery(ws, p, logo, "InvoiceSummary9ForExcel"),
            ["InvoiceSummary10ForExcel"] = (ws, p, logo) => InvoiceReportSummery(ws, p, logo, "InvoiceSummary10ForExcel"),

            ["InvoiceDetailsForExcel"] = (ws, p, logo) => InvoiceReportDetails(ws, p, logo, "InvoiceDetailsForExcel"),
            ["InvoiceDetails1ForExcel"] = (ws, p, logo) => InvoiceReportDetails(ws, p, logo, "InvoiceDetails1ForExcel"),
            ["InvoiceDetails2ForExcel"] = (ws, p, logo) => InvoiceReportDetails(ws, p, logo, "InvoiceDetails2ForExcel"),
            ["InvoiceDetails3ForExcel"] = (ws, p, logo) => InvoiceReportDetails(ws, p, logo, "InvoiceDetails3ForExcel"),
            ["InvoiceDetails4ForExcel"] = (ws, p, logo) => InvoiceReportDetails(ws, p, logo, "InvoiceDetails4ForExcel"),
            ["InvoiceDetails5ForExcel"] = (ws, p, logo) => InvoiceReportDetails(ws, p, logo, "InvoiceDetails5ForExcel"),
            ["InvoiceDetails6ForExcel"] = (ws, p, logo) => InvoiceReportDetails(ws, p, logo, "InvoiceDetails6ForExcel"),
            ["InvoiceDetails7ForExcel"] = (ws, p, logo) => InvoiceReportDetails(ws, p, logo, "InvoiceDetails7ForExcel"),
            ["InvoiceDetails8ForExcel"] = (ws, p, logo) => InvoiceReportDetails(ws, p, logo, "InvoiceDetails8ForExcel"),
            ["InvoiceDetails9ForExcel"] = (ws, p, logo) => InvoiceReportDetails(ws, p, logo, "InvoiceDetails9ForExcel"),
            ["InvoiceDetails10ForExcel"] = (ws, p, logo) => InvoiceReportDetails(ws, p, logo, "InvoiceDetails10ForExcel"),

            ["PrintedChequeListForExcel"] = (ws, p, logo) => PaymentReportDetails(ws, p, logo, "PrintedChequeListForExcel"),
            ["PrintedChequeList1ForExcel"] = (ws, p, logo) => PaymentReportDetails(ws, p, logo, "PrintedChequeList1ForExcel"),

            ["ApprovalStatusForExcel"] = (ws, p, logo) => ApprovalStatusForExcel(ws, p, logo, "ApprovalStatusForExcel"),
            ["ApprovalStatus1ForExcel"] = (ws, p, logo) => ApprovalStatusForExcel(ws, p, logo, "ApprovalStatus1ForExcel"),
            ["ApprovalStatus2ForExcel"] = (ws, p, logo) => ApprovalStatusForExcel(ws, p, logo, "ApprovalStatus2ForExcel"),
            ["ApprovalStatus3ForExcel"] = (ws, p, logo) => ApprovalStatusForExcel(ws, p, logo, "ApprovalStatus3ForExcel")
        };
    }

    private static readonly Dictionary<string, string> _reportSubTitles = new()
    {
        { "ReceivingReportSectionForExcel", "Grouped by: Vendor, Sorted by: Item" },
        { "ReceivingReportSection1ForExcel", "Grouped by: Vendor, Sorted by: PO" },
        { "ReceivingReportSection2orExcel", "Grouped by: Section, Sorted by: PO" },
        { "ReceivingReportSection3ForExcel", "Grouped by: Section, Sorted by: Vendor" },
        { "ReceivingReportSection4ForExcel", "Grouped by: Section,Sorted by: Item" },
        { "ExpeditNote4_ReceivingForExcel", "Grouped by: Project, Sorted by: PO" },
        { "ExpeditNote3_ReceivingForExcel", "Grouped by: Project, Sorted by: Item" },
        { "PODetailsForExcel", "Grouped by: Vendor, Sorted by: Date" },
        { "PODetails1ForExcel", "Grouped by: Vendor, Sorted by: PO" },
        { "PODetails2ForExcel", "Grouped by: None, Sorted by: Date" },
        { "PODetails3ForExcel", "Grouped by: None, Sorted by: PO" },
        { "PODetails4ForExcel", "Grouped by: None, Sorted by: Vendor" },
        { "PODetails5ForExcel", "Grouped by: Currency, Sorted by: PO" },
        { "PODetails6ForExcel", "Grouped by: Currency, Sorted by: Vendor" },

        { "POReportSummaryForExcel", "Grouped by: Vendor, Sorted by: Date" },
        { "POReportSummary1ForExcel", "Grouped by: Vendor, Sorted by: PO" },
        { "POReportSummary2ForExcel", "Grouped by: None, Sorted by: PO" },
        { "POReportSummary3ForExcel", "Grouped by: None, Sorted by: Date" },
        { "POReportSummary4ForExcel", "Grouped by: None, Sorted by: Vendor" },
        { "POReportSummary5ForExcel", "Grouped by: Currency, Sorted by: PO" },
        { "POReportSummary6ForExcel", "Grouped by: Currency, Sorted by: Vendor" },

        { "InvoiceSummaryForExcel", "Grouped by: Vendor, Sorted by: Date" },
        { "InvoiceSummary1ForExcel", "Grouped by: Vendor, Sorted by: Invoice Number" },
        { "InvoiceSummary2ForExcel", "Grouped by: Bank Account, Sorted by: Date" },
        { "InvoiceSummary3ForExcel", "Grouped by: Bank Account, Sorted by: Invoice Number" },
        { "InvoiceSummary4ForExcel", "Grouped by: Bank Account, Sorted by: Vendor" },
        { "InvoiceSummary5ForExcel", "Grouped by: None, Sorted by: Date" },
        { "InvoiceSummary6ForExcel", "Grouped by: None, Sorted by: Invoice Number" },
        { "InvoiceSummary7ForExcel", "Grouped by: None, Sorted by: Vendor" },
        { "InvoiceSummary8ForExcel", "Grouped by: Currency, Sorted by: Invoice Number" },
        { "InvoiceSummary9ForExcel", "Grouped by: Currency, Sorted by: Date" },
        { "InvoiceSummary10ForExcel", "Grouped by: Currency, Sorted by: Vendor" },

        { "InvoiceDetailsForExcel", "Grouped by: Vendor, Sorted by: Date" },
        { "InvoiceDetails1ForExcel", "Grouped by: Vendor, Sorted by: Invoice Number" },
        { "InvoiceDetails2ForExcel", "Grouped by: Bank Account, Sorted by: Date" },
        { "InvoiceDetails3ForExcel", "Grouped by: Bank Account, Sorted by: Invoice Number" },
        { "InvoiceDetails4ForExcel", "Grouped by: Bank Account, Sorted by: Vendor" },
        { "InvoiceDetails5ForExcel", "Grouped by: None, Sorted by: Date" },
        { "InvoiceDetails6ForExcel", "Grouped by: None, Sorted by: Invoice Number" },
        { "InvoiceDetails7ForExcel", "Grouped by: None, Sorted by: Vendor" },
        { "InvoiceDetails8ForExcel", "Grouped by: Currency, Sorted by: Date" },
        { "InvoiceDetails9ForExcel", "Grouped by: Currency, Sorted by: Vendor" },
        { "InvoiceDetails10ForExcel", "Grouped by: Currency, Sorted by: Invoice Number" },

        { "PrintedChequeListForExcel", "Sorted by: Payment Number, Grouped by: Bank Account" },
        { "PrintedChequeList1ForExcel", "Sorted by: Payment Date, Grouped by: Bank Account" },

        { "ApprovalStatusForExcel", "Grouped by: Approval Type, Sorted by: Item" },
        { "ApprovalStatus1ForExcel", "Grouped by: Approval Type, Sorted by: PO" },
        { "ApprovalStatus2ForExcel", "Grouped by: Approval Type, Sorted by: Required Date" },
        { "ApprovalStatus3ForExcel", "Grouped by: None, Sorted by: PO" }
    };


    private void InsertCommonHeader(ExcelWorksheet ws, Dictionary<string, string> parameters, string logoPath, string title, string subtitle, string ReportType)
    {
        int lastColumn = ws.Dimension?.End.Column ?? 14;

        ws.InsertRow(1, 4);

        MergeAndStyleLogoCell(ws);

        if (!string.IsNullOrWhiteSpace(logoPath) && File.Exists(logoPath))
            AddLogo(ws, logoPath);

        var projectInfo = ParseHeaderContent(parameters["Projects"] ?? "");
        var filter = parameters["ReportParameterFilter"] ?? "";
        var userName = parameters["User"] ?? "";

        FormatTitle(ws, lastColumn, title, ReportType);
        FormatSubtitle(ws, lastColumn, subtitle, userName, ReportType);
        FormatProjectRow(ws, lastColumn, projectInfo);
        FormatFilterRow(ws, lastColumn, filter);
    }

    private static void MergeAndStyleLogoCell(ExcelWorksheet ws)
    {
        ws.Cells[1, 1, 2, 1].Merge = true;

        ws.Column(1).Width = 14.29;
        ws.Row(1).Height = 33;      // Updated to match final design
        ws.Row(2).Height = 24.75;   // Updated to match final design

        var cell = ws.Cells[1, 1, 2, 1];
        cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
        cell.Style.Fill.BackgroundColor.SetColor(Color.White);
    }

    private static void AddLogo(ExcelWorksheet ws, string logoPath)
    {
        var pic = ws.Drawings.AddPicture(
            "CompanyLogo",
            new FileInfo(logoPath)
        );

        // Anchor to top-left of A1
        pic.SetPosition(0, 2, 0, 2); // slight padding

        // Calculate merged cell size (A1:A2)
        double colWidthPx = ws.Column(1).Width * 7;
        double rowHeightPx = (ws.Row(1).Height + ws.Row(2).Height) * 1.33;

        // Apply exact size
        pic.SetSize((int)colWidthPx - 6, (int)rowHeightPx - 6);

        // Keep image locked to cell
        pic.EditAs = OfficeOpenXml.Drawing.eEditAs.OneCell;
    }

    private static void FormatTitle(ExcelWorksheet ws, int lastCol, string title, string ReportType)
    {
        ws.Cells[1, 2].Value = title;
        ws.Cells[1, 2, 1, lastCol].Merge = true;

        var row = ws.Cells[1, 2, 1, lastCol];
        row.Style.Font.Name = "Calibri";
        row.Style.Font.Size = 16;
        row.Style.Font.Bold = true;
        row.Style.Font.Color.SetColor(ColorTranslator.FromHtml("#435869"));

        row.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        row.Style.VerticalAlignment = ExcelVerticalAlignment.Center;

    }

    private static void FormatSubtitle(ExcelWorksheet ws, int lastCol, string subtitle, string userName, string ReportType)
    {
        if (ReportType == "Fabrication")
        {
            int timestampStartCol = lastCol - 2;

            int subtitleCol = 7;
            ws.Cells[2, subtitleCol].Value = subtitle;

            if (!string.IsNullOrEmpty(userName))
            {
                string dateStr = DateTime.Now.ToString("yyyy-MM-dd");
                string userInfo = $" By {userName}";
                ws.Cells[2, timestampStartCol].Value = $"{dateStr}{userInfo}";

                ws.Cells[2, timestampStartCol, 2, lastCol].Merge = true;
            }

            var subtitleCell = ws.Cells[2, subtitleCol];
            subtitleCell.Style.Font.Name = "Calibri";
            subtitleCell.Style.Font.Size = 10;
            subtitleCell.Style.Font.Bold = true;
            subtitleCell.Style.Font.Italic = false;
            subtitleCell.Style.Font.Color.SetColor(ColorTranslator.FromHtml("#435869"));
            subtitleCell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            subtitleCell.Style.VerticalAlignment = ExcelVerticalAlignment.Top;

            if (!string.IsNullOrEmpty(userName))
            {
                var timestampCell = ws.Cells[2, timestampStartCol];
                timestampCell.Style.Font.Name = "Calibri";
                timestampCell.Style.Font.Size = 10;
                timestampCell.Style.Font.Bold = true;
                timestampCell.Style.Font.Italic = false;
                timestampCell.Style.Font.Color.SetColor(ColorTranslator.FromHtml("#435869"));
                timestampCell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                timestampCell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
        }
        else
        {
            int subtitleCol = 2;
            ws.Cells[2, subtitleCol].Value = $"    {subtitle}";  // 4 leading spaces

            var subtitleCell = ws.Cells[2, subtitleCol];
            subtitleCell.Style.Font.Name = "Calibri";
            subtitleCell.Style.Font.Size = 10;
            subtitleCell.Style.Font.Bold = true;
            subtitleCell.Style.Font.Italic = false;
            subtitleCell.Style.Font.Color.SetColor(ColorTranslator.FromHtml("#435869"));
            subtitleCell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
            subtitleCell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;

            // Timestamp in the LAST column only (no merge)
            if (!string.IsNullOrEmpty(userName))
            {
                string dateStr = DateTime.Now.ToString("yyyy-MM-dd");
                ws.Cells[2, lastCol].Value = $"{dateStr} By {userName}";
                var timestampCell = ws.Cells[2, lastCol];
                timestampCell.Style.Font.Name = "Calibri";
                timestampCell.Style.Font.Size = 10;
                timestampCell.Style.Font.Bold = true;
                timestampCell.Style.Font.Italic = false;
                timestampCell.Style.Font.Color.SetColor(ColorTranslator.FromHtml("#435869"));
                timestampCell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                timestampCell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                //timestampCell.Style.WrapText = true;
                timestampCell.Style.ShrinkToFit = true;
            }

        }

    }

    private static void FormatProjectRow(ExcelWorksheet ws, int lastCol, string projectInfo)
    {
        string displayText = projectInfo.StartsWith("PROJECT:", StringComparison.OrdinalIgnoreCase)
            ? projectInfo
            : $"PROJECT:  {projectInfo}";

        ws.Cells[3, 1].Value = displayText;
        ws.Cells[3, 1, 3, lastCol].Merge = true;

        var row = ws.Cells[3, 1, 3, lastCol];

        // Font styling - updated color to match final design
        row.Style.Font.Name = "Calibri";
        row.Style.Font.Size = 12;
        row.Style.Font.Bold = true;
        row.Style.Font.Color.SetColor(ColorTranslator.FromHtml("#435869"));  // Updated color

        // NO BACKGROUND - transparent
        // Removed Fill.PatternType and BackgroundColor

        // Alignment
        row.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
        row.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
        row.Style.Indent = 1;

        // NO BORDER - removed bottom border

        // Row height
        ws.Row(3).Height = 24;
    }

    private static void FormatFilterRow(ExcelWorksheet ws, int lastCol, string vendorStatusInfo)
    {
        string displayText = vendorStatusInfo.StartsWith("FILTERS:", StringComparison.OrdinalIgnoreCase)
            ? vendorStatusInfo
            : $"FILTERS: {vendorStatusInfo}";

        ws.Cells[4, 1].Value = displayText;
        ws.Cells[4, 1, 4, lastCol].Merge = true;

        var row = ws.Cells[4, 1, 4, lastCol];

        // Font styling - updated color to match final design
        row.Style.Font.Name = "Calibri";
        row.Style.Font.Size = 10;
        row.Style.Font.Bold = true;
        row.Style.Font.Color.SetColor(ColorTranslator.FromHtml("#435869"));  // Updated color

        // NO BACKGROUND - transparent
        // Removed Fill.PatternType and BackgroundColor

        // Alignment
        row.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
        row.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
        row.Style.Indent = 1;

        // NO BORDER - removed bottom border

        // Row height
        ws.Row(4).Height = 24;
    }

    #endregion

    private static string ParseHeaderContent(string headerContent)
    {
        if (string.IsNullOrWhiteSpace(headerContent))
            return string.Empty;

        // Try newline delimiter
        if (headerContent.Contains("\r\n") || headerContent.Contains("\n"))
        {
            var lines = headerContent.Split(new[] { "\r\n", "\n" },
                StringSplitOptions.RemoveEmptyEntries);
            return string.Join(", ", lines).Trim();
        }

        return headerContent;
    }

    private static void RemoveEmptyPlaceholderColumns(ExcelWorksheet ws)
    {
        if (ws.Dimension == null) return;

        int lastCol = ws.Dimension.End.Column;
        const double hiddenThreshold = 0.5;

        for (int col = lastCol; col >= 1; col--)
        {
            var colDim = ws.Column(col);

            if (colDim.Width < hiddenThreshold)
            {
                bool isEmpty = IsColumnEmpty(ws, col);

                if (isEmpty)
                {
                    ws.DeleteColumn(col);
                }
                else
                {
                    colDim.Width = 12.0;
                    colDim.Hidden = false;
                }
            }
        }
    }

    private static bool IsColumnEmpty(ExcelWorksheet ws, int colNumber)
    {
        if (ws.Dimension == null) return true;

        int lastRow = ws.Dimension.End.Row;

        for (int row = 1; row <= lastRow; row++)
        {
            var cell = ws.Cells[row, colNumber];
            if (cell.Value != null && !string.IsNullOrWhiteSpace(cell.Value.ToString()))
            {
                return false; // Found data
            }
        }

        return true; // Column is empty
    }
}