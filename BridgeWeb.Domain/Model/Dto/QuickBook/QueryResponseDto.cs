using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.QuickBook
{

    public class QueryResponseDto
    {
        public QueryResponse? QueryResponse { get; set; }
        public DateTime time { get; set; }
    }

    public class QueryResponse
    {
        public List<Account>? Account { get; set; }
        public int startPosition { get; set; }
        public int maxResults { get; set; }
    }

    public class Account
    {
        public string Name { get; set; } = string.Empty;
        public bool SubAccount { get; set; }
        public string? FullyQualifiedName { get; set; }
        public bool Active { get; set; }
        public string? Classification { get; set; }
        public string? AccountType { get; set; }
        public string? AccountSubType { get; set; }
        public int AcctNum { get; set; }
        public decimal CurrentBalance { get; set; }
        public decimal CurrentBalanceWithSubAccounts { get; set; }
        public CurrencyRef? CurrencyRef { get; set; }
        public string? domain { get; set; }
        public bool sparse { get; set; }
        public string? Id { get; set; }
        public string? SyncToken { get; set; }
        public Metadata? MetaData { get; set; }
        public ParentRef? ParentRef { get; set; }
    }

    public class CurrencyRef
    {
        public string? value { get; set; }
        public string? name { get; set; }
    }

    public class Metadata
    {
        public DateTime CreateTime { get; set; }
        public DateTime LastUpdatedTime { get; set; }
    }

    public class ParentRef
    {
        public string? value { get; set; }
    }

}
