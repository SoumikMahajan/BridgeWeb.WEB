using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class CreateNewProjectBankAccount
    {
        public string? FldID { get; set; }
        public long ProjectID { get; set; }

        public long InsertedBy { get; set; }
    }
}
