namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POLineItems_POHistory
    {
        public string? FldID { get; set; }
        public long? POLineItemID { get; set; }
        public long? POID { get; set; }
        public long? LineItemID { get; set; }
        public long? ItemOrder { get; set; }
        public string? Item { get; set; }
        public string? ItemDescription { get; set; }
        public long? Itemnumber { get; set; }
        public string? SpecNum { get; set; }
        public string? Vendor { get; set; }
        public decimal? AprvdBdgtQty { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Extended { get; set; }
        public string? UOM { get; set; }
        public string? AprvdBdgtCost { get; set; }
        public decimal? Cost { get; set; }
        public string? Note { get; set; }
        public bool? ToWarehouse { get; set; }
        public string? CommitAmountAdjust { get; set; }
        public long? BudgetID { get; set; }
        public string? BudgetSectionName { get; set; }
        public string? ReceivedQuantity { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public long? ArrivalStatus { get; set; }
        public long? Tag { get; set; }
        public DateTime? DateCreated { get; set; }
        public long? CreatedBy_ID { get; set; }
        public bool? Status { get; set; }
        public long? NoStateTax { get; set; }
        public long? NoGSTHST { get; set; }
        public long? NoPST { get; set; }
        public string? ItemDtldDesc { get; set; }
        public long? Spacing { get; set; }
        public string? Header { get; set; }
        public string? Version { get; set; }
        public string? InsertDate { get; set; }
        public string? POBackUPID { get; set; }
        //public string? LevelStatus { get; set; }
    }
}
