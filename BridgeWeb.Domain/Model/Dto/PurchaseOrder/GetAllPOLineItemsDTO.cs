using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class GetAllPOLineItemsDTO
    {
        [Key]
        public long POLineItemID { get; set; }
        public string TotalID { get; set; } = string.Empty;
        public long ProjectID { get; set; }
        public long BudgetSectionID { get; set; }   
        public long LineItemID { get; set; }

        public long ItemOrder { get; set; }

        public string Item { get; set; } = string.Empty;
        public string ItemDescription { get; set; } = string.Empty;

        public string SpecNum { get; set; } = string.Empty;
        public string ItemDtldDesc { get; set; } = string.Empty;
        public double? Extended { get; set; }

        public string ReceivedQuantity { get; set; } = string.Empty;
        public string Reference { get; set; } = string.Empty;
        public string Vendor { get; set; } = string.Empty;
        public decimal? Quantity { get; set; }
        public long? UOMID { get; set; }
        public string UOM { get; set; } = string.Empty;
        public decimal? Cost { get; set; }
        public string Note { get; set; } = string.Empty;
        public bool? ToWarehouse { get; set; }
        public string CommitAmountAdjust { get; set; } = string.Empty;
        public DateTime? DateCreated { get; set; }
        public long? CreatedBy_ID { get; set; }
        public bool? Status { get; set; }
        public bool? sp { get; set; }
        public string Header { get; set; } = string.Empty;
        public string IsExceeded { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Spacing { get; set; } = string.Empty;




    }
}
