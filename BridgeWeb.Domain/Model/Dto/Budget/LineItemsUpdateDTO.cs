namespace BridgeWeb.Domain.Model.Dto.Budget;


public class LineItemsUpdateDTO
{
    public long LineItemID { get; set; }
    public decimal? Quantity { get; set; }
    public decimal? Cost { get; set; }
    public long? CreatedBy_ID { get; set; }
    public string? ItemDescription { get; set; }
    public string? SpecNum { get; set; }
    public string? Vendor { get; set; }
    public long? UOMID { get; set; }
    public string? Note { get; set; }
    public string? Category { get; set; }
    public bool? Taxable { get; set; }
    public string? Model { get; set; }
    public bool? nonfreight { get; set; }
    public decimal? Adjust { get; set; }
    public long? BudgetSectionID { get; set; }
    public decimal? CommitAmountAdjust { get; set; }
}

//public class LineItemsUpdateDTO
//{
//    public long LineItemID { get; set; }
//    public string? Item { get; set; }
//    public string? ItemDescription { get; set; }
//    public long? UOMID { get; set; }
//    public decimal? Quantity { get; set; }
//    public decimal? Cost { get; set; }
//    public long? BudgetSectionID { get; set; }
//    public string? SpecNum { get; set; }
//    public string? Vendor { get; set; }
//    public string? Model { get; set; }
//    public string? Header { get; set; }
//    public string? Note { get; set; }
//    public bool? Taxable { get; set; }
//    public bool? nonfreight { get; set; }
//    public string? CommitAmountAdjust { get; set; }
//    public decimal? Remaining { get; set; }
//    public decimal? Adjust { get; set; }
//    public long? CreatedBy_ID { get; set; }
//    public string? Category { get; set; }
//}
