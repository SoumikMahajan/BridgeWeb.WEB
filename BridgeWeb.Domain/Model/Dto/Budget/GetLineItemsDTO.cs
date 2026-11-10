using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class GetLineItemsDTO
    {       public string? totalID { get; set; }
            public long projectId { get; set; }
            public long budgetSectionId { get; set; }
            public long lineItemID { get; set; }
            public long itemOrder { get; set; }
            public long itemOrders { get; set; }
            public string? items { get; set; }
            public string? itemDescriptions { get; set; }
            public string? specNum { get; set; }
            public string? vendor { get; set; }
            public decimal quantity { get; set; }
            public long? uomid { get; set; }
            public string? uom { get; set; }
            public decimal cost { get; set; }
            public string? note { get; set; }
            public bool toWareHouse { get; set; }
            public string? commitAmountAdjust { get; set; }
            public DateTime dateCreated { get; set; }
            public long createdBy { get; set; }
            public bool status { get; set; }
            public long spacing { get; set; }
            public string? header { get; set; }
            public string? poid { get; set; }
            public  decimal commit { get; set; }
            public decimal adjust { get; set; }
            public bool taxable { get; set; }
            public string? model { get; set; }
            public bool nonfrieght { get; set; }
        

    }
}
